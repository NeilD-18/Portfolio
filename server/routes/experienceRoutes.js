import express from "express";
import upload from "../middleware/upload.js";

import experienceControllers from "../controllers/experienceControllers.js";

const router = express.Router();

//Experience Routes
router.get('/experiences', experienceControllers.getExperiences)
router.post('/experiences', upload.single('companyPicture'),  experienceControllers.addExperience);
router.delete('/experiences/:publicId', experienceControllers.deleteExperience);
router.put('/experience/update/:publicId', upload.single('companyPicture'), experienceControllers.updateExperience)
router.get('/experience/image/:key', experienceControllers.getExperienceImage);

export default router