import express from "express";
import multer from "multer";
import controllerFunctions from "../controllers/authControllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//Project Routes
router.get('/projects', controllerFunctions.getProjects);
router.get('/projects/image/:key', controllerFunctions.getProjectImage);
router.post('/add-project', upload.single('projectImage'), controllerFunctions.addProject)
router.put('/projects/update/:publicId', upload.single('projectImage'), controllerFunctions.updateProject)
router.delete('/projects/delete/:publicId', controllerFunctions.deleteProject)

export default router