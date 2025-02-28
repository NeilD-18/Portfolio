import About from "../models/aboutModel.js";
import { s3Client, uploadFileToS3, deleteFileFromS3 } from "../utils/s3FileUpload.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const getBio = async (req, res) => {
    try {
        const bio = await About.findOne();
        if (!bio) {
            return res.status(404).json({ message: 'Bio not found' });
        }
        res.status(200).json(bio);
    } catch (error) {
        console.error('Error fetching bio:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to update the bio
const updateBio = async (req, res) => {
    const { about } = req.body;

    if (!about) {
        return res.status(400).json({ message: 'About field is required' });
    }

    try {
        let bio = await About.findOne();

        if (bio) {
            bio.about = about;
            bio = await bio.save();
        } else {
            bio = new About({ about });
            bio = await bio.save();
        }

        res.status(200).json(bio);
    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const getAboutImage = async(req, res) => { 
    const { key } = req.params;
    
    try {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        };

        const command = new GetObjectCommand(params);
        const s3Response = await s3Client.send(command);

        res.setHeader('Content-Type', s3Response.ContentType);
        s3Response.Body.pipe(res);
    } catch (error) {
        console.error('Error fetching image from S3:', error.message);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
}


const getAboutImages = async(req,res) => {
    try {
      
        const about = await About.findOne();
      if (!about) return res.status(404).json({ images: [null, null, null, null] });
  
      // Ensure the returned array always has 4 slots
      const images = [null, null, null, null];
      
      about.images.forEach((key, index) => {
        images[index] = key
          ? `${req.protocol}://${req.get("host")}/about/image/${encodeURIComponent(key)}`
          : null;
      });
  
      res.status(200).json({ images });
    } catch (error) {
      console.error("Error fetching about images:", error.message);
      res.status(500).json({ error: "Failed to fetch about images" });
    }
};




const updateAboutImage = async (req, res) => {
    try {
        const { index } = req.body; // The index of the image slot (0 to 3)
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        // Validate index and file
        if (index === undefined || index < 0 || index > 3) {
            return res.status(400).json({ error: "Valid image slot index (0-3) is required" });
        }
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        // Upload the image to S3
        const s3Response = await uploadFileToS3(req.file, 'about');
        console.log('S3 Upload Response:', s3Response);
        const newImageKey = s3Response.key; // S3 key for the new image

        // Fetch the `About` document
        let about = await About.findOne();

        // Get the key of the previous image (if any) to delete
        const previousImageKey = about.images[index];

        // Update the specific slot with the new S3 key
        about.images[index] = newImageKey;

        // Save the updated `About` document
        await about.save();

        // Delete the previous image from S3 (if it existed)
        if (previousImageKey) {
            await deleteFileFromS3(previousImageKey);
        }

        res.status(200).json({ message: "Image updated successfully", key: newImageKey });
    } catch (error) {
        console.error("Error updating about image:", error.message || error);
        res.status(500).json({ error: "Failed to update about image" });
    }
};

export default { getBio, updateBio, updateAboutImage, getAboutImages, getAboutImage }