import express from "express";
import projectsControllers from "../controllers/projectsControllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//Project Routes
router.get('/projects', projectsControllers.getProjects);
router.get('/projects/image/:key', projectsControllers.getProjectImage);
router.post('/add-project', upload.single('projectImage'), projectsControllers.addProject)
router.put('/projects/update/:publicId', upload.single('projectImage'), projectsControllers.updateProject)
router.delete('/projects/delete/:publicId', projectsControllers.deleteProject)

export default router