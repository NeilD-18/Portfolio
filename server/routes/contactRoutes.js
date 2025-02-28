import express from "express";

import controllerFunctions from "../controllers/authControllers.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//Contact Routes
router.get('/contact', controllerFunctions.getContact)
router.put('/update-contact', upload.single('resume'), controllerFunctions.updateContact)

export default router