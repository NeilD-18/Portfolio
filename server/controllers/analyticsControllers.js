import axios from 'axios';

/**
 * Analytics Controller
 * Fetches analytics data from PostHog Query API for the portal dashboard
 * 
 * Required env vars:
 * - POSTHOG_PROJECT_ID: Your project ID (found in PostHog Settings > Project > Project ID)
 * - POSTHOG_PERSONAL_API_KEY: Personal API key starting with 'phx_' (NOT the project key 'phc_')
 *   Create at: PostHog > Settings > Personal API Keys > Create key (needs "Query Read" permission)
 */

// Query API uses different host than ingestion API
// Ingestion: https://us.i.posthog.com (for sending events)
// Query API: https://us.posthog.com (for reading data)
const POSTHOG_QUERY_HOST = process.env.POSTHOG_QUERY_HOST || 'https://us.posthog.com';
const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;

/**
 * Validate PostHog configuration
 */
const validateConfig = () => {
    const errors = [];
    
    if (!POSTHOG_PROJECT_ID) {
        errors.push('POSTHOG_PROJECT_ID is not set');
    }
    
    if (!POSTHOG_PERSONAL_API_KEY) {
        errors.push('POSTHOG_PERSONAL_API_KEY is not set');
    } else if (POSTHOG_PERSONAL_API_KEY.startsWith('phc_')) {
        errors.push('POSTHOG_PERSONAL_API_KEY appears to be a project key (phc_). You need a Personal API Key (phx_) with Query Read permission. Create one at: PostHog > Settings > Personal API Keys');
    }
    
    if (errors.length > 0) {
        throw new Error(errors.join('. '));
    }
};

/**
 * Helper to make PostHog Query API requests
 * Docs: https://posthog.com/docs/api/queries
 */
const queryPostHog = async (sqlQuery, queryName = 'analytics_query') => {
    validateConfig();

    const url = `${POSTHOG_QUERY_HOST}/api/projects/${POSTHOG_PROJECT_ID}/query/`;
    
    const payload = {
        query: {
            kind: 'HogQLQuery',
            query: sqlQuery,
        },
        name: queryName,
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            timeout: 30000, // 30 second timeout
        });

        return response.data;
    } catch (error) {
        if (error.response) {
            // PostHog returned an error
            const status = error.response.status;
            const data = error.response.data;
            
            if (status === 401) {
                throw new Error('Invalid PostHog API key. Make sure POSTHOG_PERSONAL_API_KEY is a Personal API Key (phx_) with Query Read permission.');
            } else if (status === 403) {
                throw new Error('PostHog API key lacks permission. Ensure your Personal API Key has "Query Read" scope.');
            } else if (status === 404) {
                throw new Error(`PostHog project ${POSTHOG_PROJECT_ID} not found. Check your POSTHOG_PROJECT_ID.`);
            } else {
                throw new Error(`PostHog API error (${status}): ${JSON.stringify(data)}`);
            }
        }
        throw error;
    }
};

/**
 * Get traffic overview (pageviews and unique visitors per day)
 * GET /api/analytics/traffic?days=30
 */
export const getTrafficOverview = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        const result = await queryPostHog(`
            SELECT 
                toDate(timestamp) as date,
                count() as pageviews,
                count(DISTINCT distinct_id) as visitors
            FROM events
            WHERE 
                event = '$pageview'
                AND timestamp >= now() - INTERVAL ${days} DAY
                AND timestamp <= now()
            GROUP BY date
            ORDER BY date ASC
            LIMIT 1000
        `, `traffic_overview_${days}d`);
        
        const rows = result.results || [];
        
        const data = {
            days: rows.map(row => ({
                date: row[0],
                pageviews: row[1],
                visitors: row[2],
            })),
            totals: {
                pageviews: rows.reduce((sum, row) => sum + row[1], 0),
                visitors: rows.reduce((sum, row) => sum + row[2], 0),
            }
        };

        res.json(data);
    } catch (error) {
        console.error('Error fetching traffic data:', error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get top pages
 * GET /api/analytics/pages?days=30&limit=10
 */
export const getTopPages = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const limit = parseInt(req.query.limit) || 10;

        const result = await queryPostHog(`
            SELECT 
                properties.$current_url as url,
                count() as views,
                count(DISTINCT distinct_id) as visitors
            FROM events
            WHERE 
                event = '$pageview'
                AND timestamp >= now() - INTERVAL ${days} DAY
            GROUP BY url
            ORDER BY views DESC
            LIMIT ${limit}
        `, `top_pages_${days}d`);
        
        const rows = result.results || [];
        
        const pages = rows.map(row => ({
            url: row[0],
            views: row[1],
            visitors: row[2],
        }));

        res.json({ pages });
    } catch (error) {
        console.error('Error fetching top pages:', error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get LLM analytics (Ask Neil usage)
 * GET /api/analytics/llm?days=30
 */
export const getLLMAnalytics = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        // Query for $ai_generation events (from @posthog/ai wrapper)
        const result = await queryPostHog(`
            SELECT 
                toDate(timestamp) as date,
                count() as generations,
                sum(
                    coalesce(toIntOrZero(toString(properties.$ai_input_tokens)), 0) + 
                    coalesce(toIntOrZero(toString(properties.$ai_output_tokens)), 0)
                ) as total_tokens,
                sum(
                    coalesce(toFloatOrZero(toString(properties.$ai_input_cost_usd)), 0) + 
                    coalesce(toFloatOrZero(toString(properties.$ai_output_cost_usd)), 0)
                ) as total_cost
            FROM events
            WHERE 
                event = '$ai_generation'
                AND timestamp >= now() - INTERVAL ${days + 1} DAY
            GROUP BY date
            ORDER BY date ASC
            LIMIT 1000
        `, `llm_analytics_${days}d`);
        
        const rows = result.results || [];
        
        const data = {
            days: rows.map(row => ({
                date: row[0],
                generations: row[1],
                tokens: row[2] || 0,
                cost: row[3] || 0,
            })),
            totals: {
                generations: rows.reduce((sum, row) => sum + row[1], 0),
                tokens: rows.reduce((sum, row) => sum + (row[2] || 0), 0),
                cost: rows.reduce((sum, row) => sum + (row[3] || 0), 0),
            }
        };

        res.json(data);
    } catch (error) {
        console.error('Error fetching LLM analytics:', error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get combined dashboard data
 * GET /api/analytics/dashboard?days=30
 */
export const getDashboard = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        // Fetch all data in parallel
        const [trafficData, pagesData, llmData] = await Promise.all([
            getTrafficData(days),
            getPagesData(days),
            getLLMData(days),
        ]);

        res.json({
            traffic: trafficData,
            pages: pagesData,
            llm: llmData,
            period: days,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Internal helpers for getDashboard
async function getTrafficData(days) {
    const result = await queryPostHog(`
        SELECT 
            toDate(timestamp) as date,
            count() as pageviews,
            count(DISTINCT distinct_id) as visitors
        FROM events
        WHERE 
            event = '$pageview'
            AND timestamp >= now() - INTERVAL ${days} DAY
        GROUP BY date
        ORDER BY date ASC
        LIMIT 1000
    `, `dashboard_traffic_${days}d`);
    
    const rows = result.results || [];
    
    return {
        days: rows.map(row => ({
            date: row[0],
            pageviews: row[1],
            visitors: row[2],
        })),
        totals: {
            pageviews: rows.reduce((sum, row) => sum + row[1], 0),
            visitors: rows.reduce((sum, row) => sum + row[2], 0),
        }
    };
}

async function getPagesData(days) {
    const result = await queryPostHog(`
        SELECT 
            properties.$current_url as url,
            count() as views,
            count(DISTINCT distinct_id) as visitors
        FROM events
        WHERE 
            event = '$pageview'
            AND timestamp >= now() - INTERVAL ${days} DAY
        GROUP BY url
        ORDER BY views DESC
        LIMIT 10
    `, `dashboard_pages_${days}d`);
    
    const rows = result.results || [];
    
    return {
        pages: rows.map(row => ({
            url: row[0],
            views: row[1],
            visitors: row[2],
        }))
    };
}

async function getLLMData(days) {
    const result = await queryPostHog(`
        SELECT 
            toDate(timestamp) as date,
            count() as generations,
            sum(
                coalesce(toIntOrZero(toString(properties.$ai_input_tokens)), 0) + 
                coalesce(toIntOrZero(toString(properties.$ai_output_tokens)), 0)
            ) as total_tokens,
            sum(
                coalesce(toFloatOrZero(toString(properties.$ai_input_cost_usd)), 0) + 
                coalesce(toFloatOrZero(toString(properties.$ai_output_cost_usd)), 0)
            ) as total_cost
        FROM events
        WHERE 
            event = '$ai_generation'
            AND timestamp >= now() - INTERVAL ${days + 1} DAY
        GROUP BY date
        ORDER BY date ASC
        LIMIT 1000
    `, `dashboard_llm_${days}d`);
    
    const rows = result.results || [];
    
    return {
        days: rows.map(row => ({
            date: row[0],
            generations: row[1],
            tokens: row[2] || 0,
            cost: row[3] || 0,
        })),
        totals: {
            generations: rows.reduce((sum, row) => sum + row[1], 0),
            tokens: rows.reduce((sum, row) => sum + (row[2] || 0), 0),
            cost: rows.reduce((sum, row) => sum + (row[3] || 0), 0),
        }
    };
}

/**
 * Debug endpoint to check raw event counts
 * GET /api/analytics/debug
 */
export const getDebugInfo = async (req, res) => {
    try {
        // Get total count of $ai_generation events (no time filter)
        const llmCount = await queryPostHog(`
            SELECT count() as total
            FROM events
            WHERE event = '$ai_generation'
        `, 'debug_llm_count');

        // Get count with 30 day filter
        const llmCount30d = await queryPostHog(`
            SELECT count() as total
            FROM events
            WHERE event = '$ai_generation'
            AND timestamp >= now() - INTERVAL 31 DAY
        `, 'debug_llm_count_30d');

        // Get recent $ai_generation events
        const recentLLM = await queryPostHog(`
            SELECT 
                timestamp,
                properties.$ai_model as model,
                properties.$ai_input_tokens as input_tokens,
                properties.$ai_output_tokens as output_tokens
            FROM events
            WHERE event = '$ai_generation'
            ORDER BY timestamp DESC
            LIMIT 10
        `, 'debug_recent_llm');

        res.json({
            llm_total_all_time: llmCount.results?.[0]?.[0] || 0,
            llm_total_30d: llmCount30d.results?.[0]?.[0] || 0,
            recent_llm_events: recentLLM.results || [],
            server_time: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Debug error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export default {
    getTrafficOverview,
    getTopPages,
    getLLMAnalytics,
    getDashboard,
    getDebugInfo,
};
