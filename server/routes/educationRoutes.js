import express from 'express';
import { getEducation, getEducationImage, addEducation, updateEducation, deleteEducation } from '../controllers/educationControllers.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Education Routes
router.get('/education', getEducation);
router.get('/education/image/:key', getEducationImage);
router.post('/education', upload.single('logo'), addEducation);
router.put('/education/:publicId', upload.single('logo'), updateEducation);
router.delete('/education/:publicId', deleteEducation);

export default router;
