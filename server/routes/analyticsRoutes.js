import express from "express";
import authenticateToken from "../middleware/auth.js";
import analyticsControllers from "../controllers/analyticsControllers.js";

const router = express.Router();

// All analytics routes require authentication (admin only)
router.get("/analytics/traffic", authenticateToken, analyticsControllers.getTrafficOverview);
router.get("/analytics/pages", authenticateToken, analyticsControllers.getTopPages);
router.get("/analytics/llm", authenticateToken, analyticsControllers.getLLMAnalytics);
router.get("/analytics/dashboard", authenticateToken, analyticsControllers.getDashboard);
router.get("/analytics/debug", authenticateToken, analyticsControllers.getDebugInfo);

export default router;
