import userModel from "../models/userModel.js";
import About from "../models/aboutModel.js";
import utils from "../utils/encrypt.js"
import jwt from "jsonwebtoken"; 
import Experience from "../models/experienceModel.js";
import { s3Client, uploadFileToS3, deleteFileFromS3 } from "../utils/s3FileUpload.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid'



const test = (req, res) => { 
    res.json("test works");
   
}

//Login Endpoint
const loginUser = async (req, res) => { 
    try { 
        const { username, password } = req.body;

        //if user exists
        const user = await userModel.findOne({username});
        if (!user) { 
            return res.json({
                error: "Username not found"
            })
        }
        
        //Check if passwords match
        const passwordsMatch = await utils.comparePassword(password, user.password);
        if (passwordsMatch) { 
           
            jwt.sign({username: user.username, id: user._id}, process.env.JWT_SECRET, {}, (err,token) => { 
                if (err) throw err;
                res.cookie('token', token).json(user)
            })
        }
        else { 
            return res.json({
                error: "Incorrect Password"
            })
        }

    } catch (error) { 
        console.log(error)
    }

}





//Register Endpoint
const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body; 

        //Check if username is entered
        if (!username) { 
            return res.json({
                error: 'Username is Required'
            })
        }
        
        //Check password
        if (!password || password.length < 6) { 
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        }
        //check username against database
        const exists = await userModel.findOne({username}); 
        if (exists) {
            return res.json({
                error: 'Username is Taken Already' 
            })
        }

        const hashedPassword = await utils.hashPassword(password); 

        const user = await userModel.create({
            username, password: hashedPassword, 
        })

        return res.json(user)
        
    } catch (error) {
        console.log(error)
    }
}

//logout user endpoint
const logoutUser = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) }).json({ message: 'Logged out successfully' });
};

//Get Profile Endpoint
const getProfile = (req,res) => { 
    const {token} = req.cookies
    if (token) { 
        jwt.verify(token, process.env.JWT_SECRET, {}, (err,user) => { 
            if (err) throw err;
            res.json(user)
        })
    } 
    else { 
        res.json(null)
    }
}


// Controller to get the bio
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
        const { role, responsibilities, startDate, endDate } = req.body;
        
        console.log('role', role)
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        // Validate required fields
        if (!role || !responsibilities || !startDate || !endDate) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Initialize the variable to store the S3 key
        let companyPictureKey = null;

        // Upload the file to S3 and get the key
        if (req.file) {
            const s3Response = await uploadFileToS3(req.file);
            console.log('S3 Upload Response:', s3Response);
            companyPictureKey = s3Response.key; // Save the key to MongoDB
        }

        // Create a new experience document
        const newExperience = new Experience({
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
      const { role, responsibilities, startDate, endDate } = req.body;
  
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
  
      // Validate required fields
      if (!role || !responsibilities || !startDate || !endDate) {
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
        const s3Response = await uploadFileToS3(newFile);
        console.log('S3 Upload Response:', s3Response);
        companyPictureKey = s3Response.key; // Update the S3 key to the new image
      }
  
      // Now update the experience in the database
      experience = await Experience.findOneAndUpdate(
        { publicId }, // Filter
        {
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


export default { test, registerUser, loginUser, getProfile, logoutUser, getBio, updateBio, addExperience, deleteExperience,  updateExperience, getExperiences, getExperienceImage }