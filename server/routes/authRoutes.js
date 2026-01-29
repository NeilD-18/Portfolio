import express from "express"; 
import cors from "cors"; 
import rateLimit from "express-rate-limit";
import  authControllers from "../controllers/authControllers.js"
import authenticateToken from "../middleware/auth.js";


const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", authControllers.test)
router.post("/register", authLimiter, authControllers.registerUser)
router.post("/login", authLimiter, authControllers.loginUser)
router.post("/logout", authLimiter, authControllers.logoutUser)
router.get("/profile", authControllers.getProfile)
router.get("/portal", authenticateToken, authControllers.test)

export default router

 
