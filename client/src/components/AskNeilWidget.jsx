import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

const DEFAULT_PROMPTS = [
  "Give me the 30-second overview",
  "What projects showcase backend skills?",
  "What's Neil's basketball background?",
  "What should I ask in an interview?",
];

const bubble = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

/**
 * Parse and render formatted text (bold, bullets, line breaks)
 */
const FormattedText = ({ text }) => {
  if (!text) return null;

  // Split by line breaks first
  const lines = text.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, lineIdx) => {
        // Skip empty lines but preserve spacing
        if (line.trim() === '') {
          return <div key={lineIdx} className="h-1" />;
        }

        // Check if it's a bullet point
        const isBullet = /^[\s]*[•\-\*]\s/.test(line);
        const cleanLine = isBullet ? line.replace(/^[\s]*[•\-\*]\s/, '') : line;

        // Parse bold text (**text** or __text__)
        const parts = cleanLine.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);

        const renderedParts = parts.map((part, partIdx) => {
          // Check if this part is bold
          if (/^\*\*[^*]+\*\*$/.test(part) || /^__[^_]+__$/.test(part)) {
            const boldText = part.replace(/^\*\*|\*\*$|^__|__$/g, '');
            return (
              <span key={partIdx} className="font-semibold text-white">
                {boldText}
              </span>
            );
          }
          return <span key={partIdx}>{part}</span>;
        });

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1">
              <span className="text-[#915EFF] mt-1.5 text-[8px]">●</span>
              <span className="flex-1">{renderedParts}</span>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="leading-relaxed">
            {renderedParts}
          </p>
        );
      })}
    </div>
  );
};

export default function AskNeilWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState(DEFAULT_PROMPTS);
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState(() => [
    {
      id: "intro",
      role: "assistant",
      content: "Ask me anything about Neil — **projects**, **experience**, **education**, or what to talk about in an interview.",
      meta: null,
    },
  ]);

  // Fetch suggested prompts on mount
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await axios.get("/api/ask/prompts");
        if (response.data.prompts?.length) {
          setSuggestedPrompts(response.data.prompts);
        }
      } catch (error) {
        console.log("Using default prompts");
      }
    };
    fetchPrompts();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const push = (msg) => setMessages((prev) => [...prev, msg]);

  const handlePrompt = async (prompt) => {
    // Add user message immediately
    push({ id: `u-${Date.now()}`, role: "user", content: prompt, meta: null });
    
    setLoading(true);
    
    try {
      const response = await axios.post("/api/ask", { query: prompt });
      
      if (response.data.success && response.data.answer) {
        const { title, body, sources, isFiltered } = response.data.answer;
        push({
          id: `a-${Date.now()}`,
          role: "assistant",
          content: body,
          meta: { title, sources, isFiltered },
        });
      } else {
        push({
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "I couldn't find an answer to that. Try asking about projects, experience, or education!",
          meta: null,
        });
      }
    } catch (error) {
      console.error("Error asking Neil:", error);
      push({
        id: `a-${Date.now()}`,
        role: "assistant",
        content: "Something went wrong. Please try again!",
        meta: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || loading) return;
    setDraft("");
    handlePrompt(text);
  };


  return (
    <div className="fixed bottom-6 left-6 z-[60]">
      {/* Closed state pill */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(true)}
            className="group flex items-center gap-3 rounded-full border border-white/10 bg-primary/80 backdrop-blur-md px-4 py-3 shadow-lg hover:border-[#915EFF]/40 transition-colors"
            aria-label="Open Ask Neil"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#915EFF] to-[#00CEA8] text-white font-bold">
              N
            </span>
            <span className="text-white text-sm font-semibold">Ask Neil</span>
            <span className="text-secondary text-xs hidden sm:block">
              quick answers • no scrolling
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Open state */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-[340px] sm:w-[420px] rounded-3xl overflow-hidden border border-white/10 bg-primary/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#915EFF]/10 to-[#00CEA8]/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#915EFF] to-[#00CEA8] flex items-center justify-center text-white font-bold shadow-lg">
                  N
                </div>
                <div className="leading-tight">
                  <p className="text-white font-semibold">Ask Neil</p>
                  <p className="text-secondary text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    AI-powered • knows my portfolio
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors flex items-center justify-center text-lg"
                aria-label="Close Ask Neil"
              >
                ×
              </button>
            </div>

            {/* Suggested prompts */}
            <div className="px-5 pt-4">
              <p className="text-secondary text-[11px] uppercase tracking-[0.2em] font-semibold">
                Try asking
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestedPrompts.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    onClick={() => !loading && handlePrompt(p)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 hover:border-[#915EFF]/40 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="px-5 py-4 max-h-[360px] overflow-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  variants={bubble}
                  initial="hidden"
                  animate="show"
                  className={`w-full flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-[#915EFF]/30 to-[#00CEA8]/30 border border-[#915EFF]/30 text-white"
                        : "bg-black/40 border border-white/10 text-white/90"
                    }`}
                  >
                    {/* Title badge for assistant messages */}
                    {m.role === "assistant" && m.meta?.title && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] uppercase tracking-[0.15em] font-bold px-2 py-0.5 rounded-full ${
                          m.meta.isFiltered 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-[#00CEA8]/20 text-[#00CEA8]'
                        }`}>
                          {m.meta.title}
                        </span>
                      </div>
                    )}
                    
                    {/* Message content with formatting */}
                    <div className="text-sm">
                      {m.role === "assistant" ? (
                        <FormattedText text={m.content} />
                      ) : (
                        <p className="leading-relaxed">{m.content}</p>
                      )}
                    </div>
                    
                    {/* Sources */}
                    {m.meta?.sources?.length > 0 && !m.meta?.isFiltered && (
                      <div className="mt-3 pt-2 border-t border-white/5">
                        <p className="text-[10px] text-secondary/70 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {m.meta.sources.join(" • ")}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Loading indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#915EFF] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#915EFF]/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-[#915EFF]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 border-t border-white/10 pt-4">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask about projects, experience, skills…"
                  disabled={loading}
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-secondary focus:outline-none focus:border-[#915EFF]/50 disabled:opacity-50 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !draft.trim()}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#915EFF] to-[#00CEA8] text-white font-semibold text-sm hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
