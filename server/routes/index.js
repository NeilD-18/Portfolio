import express from "express";
import authRoutes from "./authRoutes.js";
import aboutRoutes from "./aboutRoutes.js";
import experienceRoutes from "./experienceRoutes.js";
import projectRoutes from "./projectRoutes.js";
import contactRoutes from "./contactRoutes.js";
import educationRoutes from "./educationRoutes.js";
import moodBoardRoutes from "./moodBoardRoutes.js";
import askRoutes from "./askRoutes.js";

const router = express.Router();

// Use the separate route files
router.use(authRoutes);
router.use(aboutRoutes);
router.use(experienceRoutes);
router.use(projectRoutes);
router.use(contactRoutes);
router.use(educationRoutes);
router.use(moodBoardRoutes);
router.use(askRoutes);

export default router;
