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

export default router