import express from "express"; 
import cors from "cors"; 
import  authControllers from "../controllers/authControllers.js"
import authenticateToken from "../middleware/auth.js";


const router = express.Router();


router.get("/", authControllers.test)
router.post("/register", authControllers.registerUser)
router.post("/login",  authControllers.loginUser)
router.post("/logout", authControllers.logoutUser)
router.get("/profile", authControllers.getProfile)
router.get("/portal", authenticateToken, authControllers.test)

export default router

 
