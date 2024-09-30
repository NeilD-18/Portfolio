import express from "express"; 
import cors from "cors"; 
import  controllerFunctions from "../controllers/authControllers.js"
import authenticateToken from "../middleware/auth.js";
import multer from "multer";


const router = express.Router();


//middleware 
router.use(
    cors({
            credentials: true,
            origin: 'http://localhost:5173'

    })
)

// Configure multer storage
const storage = multer.memoryStorage(); 

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });


router.get("/", controllerFunctions.test)
router.post("/register", controllerFunctions.registerUser)
router.post("/login",  controllerFunctions.loginUser)
router.post("/logout", controllerFunctions.logoutUser)
router.get("/profile", controllerFunctions.getProfile)
router.get("/portal", authenticateToken, controllerFunctions.test)
router.get("/about", controllerFunctions.getBio)
router.put("/about", controllerFunctions.updateBio)
router.get('/experiences', controllerFunctions.getExperiences)
router.post('/experiences', upload.single('companyPicture'),  controllerFunctions.addExperience);
router.delete('/experiences/:publicId', controllerFunctions.deleteExperience);
router.put('/experience/update/:publicId', controllerFunctions.updateExperience)
router.get('/experience/image/:key', controllerFunctions.getExperienceImage);

export default router