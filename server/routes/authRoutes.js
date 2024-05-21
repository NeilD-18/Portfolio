import express from "express"; 
import cors from "cors"; 
import  controllerFunctions from "../controllers/authControllers.js"


const router = express.Router();


//middleware 
router.use(
    cors({
            credentials: true,
            origin: 'http://localhost:5173'

    })
)

router.get("/", controllerFunctions.test)
router.post("/register", controllerFunctions.registerUser)
router.post("/login",  controllerFunctions.loginUser)
router.get("/profile", controllerFunctions.getProfile)

export default router