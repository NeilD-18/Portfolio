import OpenAI from "openai";
import About from "../models/aboutModel.js";
import Project from "../models/projectModel.js";
import Experience from "../models/experienceModel.js";
import Education from "../models/educationModel.js";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const KB_CACHE_TTL_MS = Number(process.env.ASK_KB_TTL_MS || '300000'); // 5 minutes
let knowledgeCache = {
    data: null,
    timestamp: 0
};

/**
 * Use AI to classify if a query is relevant to Neil's portfolio
 * This is a cheap call (~20-30 tokens) that saves expensive calls
 */
const classifyQueryRelevance = async (query) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a classifier for Neil's portfolio chatbot. Determine if this question could reasonably be answered by Neil talking about himself, his work, or his background.

CONTEXT: This is a chatbot on Neil's portfolio website. When users say "you" or ask for an "overview", they mean Neil.

Answer "yes" if the question is about:
- Neil himself, his background, who he is
- His projects, work, or things he's built
- His experience, internships, jobs
- His education, skills, tech stack
- His interests, hobbies, basketball
- Interview tips or what to ask him
- Any question where "you" refers to Neil

Answer "no" if it's:
- General coding questions (algorithms, syntax)
- Questions about other people/celebrities
- Random topics (weather, recipes, news)
- Requests to write code/content unrelated to Neil

Respond with ONLY "yes" or "no".

Examples:
- "Give me the 30-second overview" → yes (overview of Neil)
- "Tell me about yourself" → yes
- "What have you built?" → yes
- "What are your strengths?" → yes
- "Summarize your background" → yes
- "Why should we hire you?" → yes
- "Give me code for two sum" → no
- "What's the weather?" → no
- "Who is Elon Musk?" → no`
                },
                { role: "user", content: query }
            ],
            max_tokens: 3,
            temperature: 0,
        });

        const response = completion.choices[0]?.message?.content?.toLowerCase().trim();
        return response === "yes";
    } catch (error) {
        console.error("Classification error:", error);
        // On error, fall back to allowing the query (better UX than blocking)
        return true;
    }
};

/**
 * Quick pre-filter for VERY obvious off-topic queries (saves API calls)
 * Be conservative here - when in doubt, let the classifier decide
 */
const isObviouslyOffTopic = (query) => {
    const q = query.toLowerCase().trim();
    
    // If query mentions Neil-related terms, never block with regex
    const neilTerms = /\b(neil|portfolio|resume|cv|interview|hire|project|experience|education|union|basketball|intern)\b/i;
    if (neilTerms.test(q)) {
        return false; // Let it through, it's probably relevant
    }
    
    // Only block VERY specific off-topic patterns
    const definitelyOffTopic = [
        // Explicit code/algorithm requests
        /(code|implement|solve|write).*(two sum|binary search|leetcode|hackerrank|fibonacci|sorting algorithm)/i,
        /\b(leetcode|hackerrank|codewars|advent of code)\b/i,
        
        // Explicit general knowledge
        /^(who is|who was) (elon|trump|biden|taylor|bezos|zuckerberg|gates|obama)/i,
        /^(what's the|what is the) (weather|capital of|population of|president of)/i,
        
        // Explicit content generation (not about Neil)
        /^write (me |a )?(poem|story|essay|song|letter) about (?!neil|you)/i,
        
        // Cooking/recipes
        /\b(recipe for|how to cook|how to bake|ingredients for)\b/i,
        
        // Translation/math
        /^(translate|convert .* to|calculate|compute|solve this equation)/i,
    ];

    return definitelyOffTopic.some(pattern => pattern.test(q));
};

/**
 * Check if query is obviously about Neil (skip classifier)
 */
const isObviouslyRelevant = (query) => {
    const q = query.toLowerCase().trim();
    
    const relevantPatterns = [
        // Direct references to Neil
        /\b(neil|you|your|yourself)\b/i,
        /\b(portfolio|resume|cv)\b/i,
        
        // Self-introduction queries
        /^(tell me about yourself|who are you|introduce yourself)/i,
        /^(what (do you|did you)|where (do you|did you)|how (do you|did you))/i,
        
        // Interview/hiring context
        /\b(hire|hiring|interview|candidate)\b/i,
        
        // Education
        /\b(union college|d3|basketball|gpa|degree|major|minor)\b/i,
        
        // Work/role queries - these are asking about Neil's experience
        /\b(role|position|job|internship|intern|work)\b/i,
        /\bthe .* (role|position|job|internship)\b/i,
        /\bat .* (role|position|job)\b/i,
        
        // Project queries
        /\b(project|built|build|created|developed)\b/i,
        
        // Skills/tech queries in portfolio context
        /\b(tech stack|skills|experience with|worked with)\b/i,
        
        // Overview/summary requests (on a portfolio, these are about Neil)
        /\b(overview|summary|background|about)\b/i,
        /^(tell me|give me|what's|what is).*(overview|summary|background)/i,
    ];

    return relevantPatterns.some(pattern => pattern.test(q));
};

/**
 * Gathers all portfolio data
 */
const gatherKnowledgeBase = async () => {
    const [about, projects, experiences, education] = await Promise.all([
        About.findOne(),
        Project.find().sort({ pinned: -1, createdAt: -1 }),
        Experience.find().sort({ 'dateRange.endDate': -1 }),
        Education.find().sort({ order: 1 })
    ]);

    return {
        bio: about?.about || "",
        projects: projects.map(p => ({
            title: p.title,
            description: p.description,
            techStack: p.techStack,
            category: p.category,
            pinned: p.pinned
        })),
        experiences: experiences.map(e => ({
            role: e.role,
            company: e.companyName,
            responsibilities: e.responsibilities,
            startDate: e.dateRange?.startDate,
            endDate: e.dateRange?.endDate
        })),
        education: education.map(e => ({
            school: e.school,
            degree: e.degree,
            minor: e.minor,
            year: e.year,
            gpa: e.gpa,
            status: e.status,
            courses: e.courses
        }))
    };
};

const getKnowledgeBaseCached = async () => {
    const now = Date.now();
    if (knowledgeCache.data && (now - knowledgeCache.timestamp) < KB_CACHE_TTL_MS) {
        return knowledgeCache.data;
    }

    const fresh = await gatherKnowledgeBase();
    knowledgeCache = { data: fresh, timestamp: now };
    return fresh;
};

/**
 * Build system prompt with portfolio context
 */
const buildSystemPrompt = (knowledgeBase) => {
    const projectsList = knowledgeBase.projects
        .map(p => `- ${p.title} (${p.category || 'General'}): ${p.description}${p.techStack ? ` | Tech: ${p.techStack}` : ''}${p.pinned ? ' [FEATURED]' : ''}`)
        .join('\n');

    const experiencesList = knowledgeBase.experiences
        .map(e => `- ${e.role} at ${e.company}${e.responsibilities ? `: ${e.responsibilities.substring(0, 200)}...` : ''}`)
        .join('\n');

    const educationList = knowledgeBase.education
        .map(e => `- ${e.school}: ${e.degree}${e.minor ? `, Minor in ${e.minor}` : ''} (${e.year})${e.gpa ? ` - GPA: ${e.gpa}` : ''}${e.status ? ` [${e.status}]` : ''}${e.courses?.length ? ` | Courses: ${e.courses.join(', ')}` : ''}`)
        .join('\n');

    const allTech = new Set();
    knowledgeBase.projects.forEach(p => {
        if (p.techStack) {
            p.techStack.split(',').forEach(t => allTech.add(t.trim()));
        }
    });

    return `You are an AI assistant representing Neil Daterao on his portfolio website. You speak AS Neil in first person ("I", "my", "me"). Be conversational, confident, and personable — like Neil would be in an interview.

=== RESPONSE FORMATTING RULES ===
Format your responses for excellent readability:

1. **Use bullet points** for lists (use • or -)
2. **Bold important terms** using **text** syntax
3. Keep paragraphs short (2-3 sentences max)
4. Use line breaks between sections
5. For project/experience summaries, use this format:
   **Project Name** — Brief description
   • Key point 1
   • Key point 2

6. Keep total response concise but well-structured
7. Use headers sparingly, only for longer responses

=== TONE GUIDELINES ===
- Be enthusiastic but professional
- Sound human and conversational, not robotic
- Highlight achievements naturally without bragging
- If asked about something not in the data, say you'd be happy to discuss it in person
- Only use the portfolio data provided below. If the answer is not in the data, say: "I don't have that detail here, but I'm happy to talk about it."

=== NEIL'S PORTFOLIO DATA ===

**BIO:**
${knowledgeBase.bio || "I'm a passionate developer who loves building clean, modern applications."}

**PROJECTS:**
${projectsList || "Projects are being updated."}

**EXPERIENCE:**
${experiencesList || "Experience details coming soon."}

**EDUCATION:**
${educationList || "Education details coming soon."}

**TECH STACK:**
${Array.from(allTech).join(', ') || "Various modern technologies"}

**ADDITIONAL CONTEXT:**
- Neil is a D3 basketball player at Union College — demonstrates discipline, teamwork, and time management
- He balances athletics with rigorous academics in CS and Math
- He's passionate about building things that matter

=== END PORTFOLIO DATA ===

Remember: Respond naturally as Neil would, with clean formatting for easy reading!`;
};

/**
 * Determine sources based on query
 */
const determineSources = (query) => {
    const q = query.toLowerCase();
    const sources = [];

    if (q.includes('project') || q.includes('built') || q.includes('build') || q.includes('tech') || q.includes('stack') || q.includes('code')) {
        sources.push('Projects');
    }
    if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('intern') || q.includes('company')) {
        sources.push('Experience');
    }
    if (q.includes('education') || q.includes('school') || q.includes('degree') || q.includes('study') || q.includes('college')) {
        sources.push('Education');
    }
    if (q.includes('basketball') || q.includes('athlete') || q.includes('sport') || q.includes('about') || q.includes('who')) {
        sources.push('About');
    }

    return sources.length > 0 ? sources : ['About', 'Projects'];
};

/**
 * Generate title based on query
 */
const generateTitle = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('overview') || q.includes('30-second') || q.includes('who')) return 'Quick Overview';
    if (q.includes('project')) return 'Projects';
    if (q.includes('experience') || q.includes('work') || q.includes('job')) return 'Experience';
    if (q.includes('education') || q.includes('school') || q.includes('degree')) return 'Education';
    if (q.includes('tech') || q.includes('stack') || q.includes('skill')) return 'Tech Stack';
    if (q.includes('basketball') || q.includes('athlete')) return 'Student-Athlete';
    if (q.includes('interview') || q.includes('ask')) return 'Interview Tips';
    
    return 'About Neil';
};

/**
 * Off-topic response template
 */
const getOffTopicResponse = () => ({
    success: true,
    answer: {
        title: "Off-Topic",
        body: "I'm here to help you learn about **Neil** — not general questions! 😊\n\nTry asking about:\n• My **projects** and what I've built\n• My **work experience** and internships\n• My **education** at Union College\n• My **tech stack** and skills\n• What to **ask me in an interview**",
        sources: ['System'],
        isFiltered: true
    }
});

/**
 * Main endpoint handler for Ask Neil
 */
export const askNeil = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({ error: "Please provide a question" });
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            console.error("OPENAI_API_KEY not configured");
            return res.status(500).json({ error: "AI service not configured" });
        }

        // Step 1: Quick regex filter for obvious off-topic queries (FREE)
        if (isObviouslyOffTopic(query)) {
            console.log(`[Ask Neil] Blocked by regex: "${query.substring(0, 50)}..."`);
            return res.json(getOffTopicResponse());
        }

        // Step 2: Skip classifier for obviously relevant queries (FREE)
        const obviouslyRelevant = isObviouslyRelevant(query);
        
        // Step 3: Use AI classifier for ambiguous queries (~3 tokens, very cheap)
        if (!obviouslyRelevant) {
            const isRelevant = await classifyQueryRelevance(query);
            if (!isRelevant) {
                console.log(`[Ask Neil] Blocked by classifier: "${query.substring(0, 50)}..."`);
                return res.json(getOffTopicResponse());
            }
        }

        // Step 4: Query is relevant - gather portfolio data and generate response
        const knowledgeBase = await getKnowledgeBaseCached();
        const systemPrompt = buildSystemPrompt(knowledgeBase);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: query }
            ],
            max_tokens: 400,
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0]?.message?.content || "I'd be happy to tell you more — feel free to reach out directly!";

        const sources = determineSources(query);
        const title = generateTitle(query);

        res.json({
            success: true,
            answer: {
                title,
                body: aiResponse,
                sources
            }
        });

    } catch (error) {
        console.error("Error in askNeil:", error);
        
        if (error.code === 'insufficient_quota') {
            return res.status(503).json({ error: "AI service temporarily unavailable" });
        }
        
        res.status(500).json({ error: "Failed to process your question" });
    }
};

/**
 * Get suggested prompts
 */
export const getSuggestedPrompts = async (req, res) => {
    try {
        const knowledgeBase = await getKnowledgeBaseCached();
        
        const prompts = [
            "Give me the 30-second overview",
            "What projects showcase backend skills?",
        ];

        if (knowledgeBase.experiences.length > 0) {
            prompts.push(`Tell me about the ${knowledgeBase.experiences[0].company} role`);
        }

        if (knowledgeBase.education.length > 0) {
            prompts.push("What's Neil studying?");
        }

        prompts.push("What should I ask in an interview?");

        res.json({ prompts });
    } catch (error) {
        console.error("Error getting suggested prompts:", error);
        res.status(500).json({ error: "Failed to get prompts" });
    }
};
