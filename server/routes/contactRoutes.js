import express from "express";
import contactControllers from "../controllers/contactControllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//Contact Routes
router.get('/contact', contactControllers.getContact)
router.put('/update-contact', upload.single('resume'), contactControllers.updateContact)

export default router