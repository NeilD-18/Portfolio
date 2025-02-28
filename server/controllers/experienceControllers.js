import Experience from "../models/experienceModel.js";
import { s3Client, uploadFileToS3, deleteFileFromS3 } from "../utils/s3FileUpload.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid'


const deleteExperience = async (req, res) => {
    try {
        const { publicId } = req.params;

        // Find and delete the experience by publicId
        const deletedExperience = await Experience.findOneAndDelete({ publicId });

        if (deletedExperience) {
            const s3Key = deletedExperience.companyPicture; // Assuming companyPicture holds the S3 object key

            if (s3Key) {
                // Use the helper function to delete the image from S3
                await deleteFileFromS3(s3Key);
                console.log("Company picture deleted from S3.");
            }

            res.status(200).json({ message: "Experience and corresponding image deleted successfully" });
        } else {
            res.status(404).json({ error: "Experience not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete experience or image" });
    }
};

const addExperience = async (req, res) => {
    try {
        const { companyName, role, responsibilities, startDate, endDate } = req.body;
        
        console.log('role', role)
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        // Validate required fields
        if (!companyName || !role || !responsibilities || !startDate || !endDate) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Initialize the variable to store the S3 key
        let companyPictureKey = null;

        // Upload the file to S3 and get the key
        if (req.file) {
            const s3Response = await uploadFileToS3(req.file, 'experience');
            console.log('S3 Upload Response:', s3Response);
            companyPictureKey = s3Response.key; // Save the key to MongoDB
        }

        // Create a new experience document
        const newExperience = new Experience({
            companyName: companyName, 
            companyPicture: companyPictureKey, // Save the S3 key
            role,
            responsibilities,
            dateRange: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
            publicId: uuidv4(),
        });

        // Save the new experience to the database
        await newExperience.save();
        res.status(201).json(newExperience);
    } catch (error) {
        console.error("Error adding experience:", error.message || error);
        res.status(500).json({ error: "Failed to add experience" });
    }
};



const updateExperience = async (req, res) => {
    try {
      const { publicId } = req.params; // Assuming the experience ID is passed as a URL parameter
      const { companyName, role, responsibilities, startDate, endDate } = req.body;
  
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
  
      // Validate required fields
      if (!companyName || !role || !responsibilities || !startDate || !endDate) {
        console.log("something wrong here");
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Find the experience by publicId
      let experience = await Experience.findOne({ publicId });
      if (!experience) {
        return res.status(404).json({ error: "Experience not found" });
      }
  
      // Initialize the variable for the S3 key
      let companyPictureKey = experience.companyPicture; // Keep the existing key unless a new image is uploaded
      console.log("Current company picture key:", companyPictureKey);
  
      // Check if a new file is uploaded
      if (req.file) {
        console.log('file uplaoded!!')
        const newFile = req.file;
  
        // If there's an existing image, delete it from S3
        if (companyPictureKey && companyPictureKey !== newFile.originalname) {
          const deleteResponse = await deleteFileFromS3(companyPictureKey);
          console.log('S3 Delete Response:', deleteResponse);
        }
  
        // Upload the new image to S3
        const s3Response = await uploadFileToS3(newFile, 'experience');
        console.log('S3 Upload Response:', s3Response);
        companyPictureKey = s3Response.key; // Update the S3 key to the new image
      }
  
      // Now update the experience in the database
      experience = await Experience.findOneAndUpdate(
        { publicId }, // Filter
        {
          companyName,
          role,
          responsibilities,
          dateRange: {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
          },
          companyPicture: companyPictureKey,
        },
        { new: true } // Return the updated document
      );
  
      res.status(200).json(experience);
    } catch (error) {
      console.error("Error updating experience:", error.message || error);
      res.status(500).json({ error: "Failed to update experience" });
    }
  };
  

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

const getExperienceImage = async (req, res) => { 
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
};

export default { deleteExperience, addExperience, updateExperience, getExperienceImage, getExperiences }