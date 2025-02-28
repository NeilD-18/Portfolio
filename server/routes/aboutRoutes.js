import express from "express";
import aboutControllers from "../controllers/aboutControllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//About Routes
router.get("/about", aboutControllers.getBio)
router.put("/about", aboutControllers.updateBio)
router.get('/about/image/:key', aboutControllers.getAboutImage)
router.get('/about/images', aboutControllers.getAboutImages)
router.post('/about/update-image', upload.single("file"), aboutControllers.updateAboutImage)

export default router