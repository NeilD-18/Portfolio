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

router.get('/about/image/:key', controllerFunctions.getAboutImage)
router.get('/about/images', controllerFunctions.getAboutImages)
router.post('/about/update-image', upload.single("file"), controllerFunctions.updateAboutImage)




router.get('/experiences', controllerFunctions.getExperiences)
router.post('/experiences', upload.single('companyPicture'),  controllerFunctions.addExperience);
router.delete('/experiences/:publicId', controllerFunctions.deleteExperience);
router.put('/experience/update/:publicId', upload.single('companyPicture'), controllerFunctions.updateExperience)
router.get('/experience/image/:key', controllerFunctions.getExperienceImage);

export default router


const getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ 'dateRange.startDate': -1 }); // Sort by date in ascending order

        // Map through experiences to generate correct image URLs
        const experiencesWithImageUrls = experiences.map(exp => {
            return {
                ...exp.toObject(),
                companyPicture: `${req.protocol}://${req.get('host')}/experience/image/${encodeURIComponent(exp.companyPicture)}`
            };
        });

        res.status(200).json(experiencesWithImageUrls);
    } catch (error) {
        console.error("Error retrieving experiences:", error.message || error);
        res.status(500).json({ error: "Failed to retrieve experiences" });
    }
};