import express from "express";
import controllerFunctions from "../controllers/authControllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//About Routes
router.get("/about", controllerFunctions.getBio)
router.put("/about", controllerFunctions.updateBio)
router.get('/about/image/:key', controllerFunctions.getAboutImage)
router.get('/about/images', controllerFunctions.getAboutImages)
router.post('/about/update-image', upload.single("file"), controllerFunctions.updateAboutImage)

export default router