import express from "express";
import rateLimit from "express-rate-limit";
import { askNeil, getSuggestedPrompts } from "../controllers/askControllers.js";

const router = express.Router();

const askLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/ask - Main endpoint for asking questions
router.post("/ask", askLimiter, askNeil);

// GET /api/ask/prompts - Get suggested prompts
router.get("/ask/prompts", getSuggestedPrompts);

export default router;
