import express from "express";
import upload from "../middleware/upload.js";
import controllerFunctions from "../controllers/authControllers.js";

const router = express.Router();

//Experience Routes
router.get('/experiences', controllerFunctions.getExperiences)
router.post('/experiences', upload.single('companyPicture'),  controllerFunctions.addExperience);
router.delete('/experiences/:publicId', controllerFunctions.deleteExperience);
router.put('/experience/update/:publicId', upload.single('companyPicture'), controllerFunctions.updateExperience)
router.get('/experience/image/:key', controllerFunctions.getExperienceImage);

export default router