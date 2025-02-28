import multer from "multer";

// Configure multer storage (memory storage since files go to S3)
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;