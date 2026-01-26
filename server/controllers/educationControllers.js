import Education from "../models/educationModel.js";
import { s3Client, uploadFileToS3, deleteFileFromS3 } from "../utils/s3FileUpload.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

// Get all education entries
const getEducation = async (req, res) => {
    try {
        const education = await Education.find().sort({ order: 1 });
        
        // Map through education to generate correct image URLs
        const educationWithImageUrls = education.map(edu => {
            return {
                ...edu.toObject(),
                logo: edu.logo ? `${req.protocol}://${req.get('host')}/api/education/image/${encodeURIComponent(edu.logo)}` : null
            };
        });
        
        res.status(200).json(educationWithImageUrls);
    } catch (error) {
        console.error("Error fetching education:", error);
        res.status(500).json({ error: "Failed to fetch education" });
    }
};

// Get education image from S3
const getEducationImage = async (req, res) => {
    const { key } = req.params;
    
    try {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: decodeURIComponent(key),
        };

        const command = new GetObjectCommand(params);
        const s3Response = await s3Client.send(command);

        res.setHeader('Content-Type', s3Response.ContentType);
        if (s3Response.ETag) {
            res.setHeader('ETag', s3Response.ETag);
            if (req.headers['if-none-match'] === s3Response.ETag) {
                return res.status(304).end();
            }
        }
        if (s3Response.LastModified) {
            res.setHeader('Last-Modified', s3Response.LastModified.toUTCString());
        }
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        s3Response.Body.pipe(res);
    } catch (error) {
        console.error('Error fetching image from S3:', error.message);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
};

// Add new education entry
const addEducation = async (req, res) => {
    try {
        const { school, location, degree, minor, year, gpa, status, courses } = req.body;

        if (!school || !location || !degree || !year) {
            return res.status(400).json({ error: "School, location, degree, and year are required" });
        }

        let logoKey = null;
        if (req.file) {
            const s3Response = await uploadFileToS3(req.file, 'education');
            logoKey = s3Response.key;
        }

        // Parse courses if it's a string
        let parsedCourses = courses;
        if (typeof courses === 'string') {
            parsedCourses = courses.split(',').map(c => c.trim()).filter(c => c);
        }

        const newEducation = new Education({
            school,
            location,
            degree,
            minor: minor || null,
            year,
            gpa: gpa || null,
            logo: logoKey,
            status: status || 'Current',
            courses: parsedCourses || [],
            publicId: uuidv4(),
        });

        await newEducation.save();
        
        // Return with full image URL
        const savedEducation = {
            ...newEducation.toObject(),
            logo: logoKey ? `${req.protocol}://${req.get('host')}/api/education/image/${encodeURIComponent(logoKey)}` : null
        };
        
        res.status(201).json(savedEducation);
    } catch (error) {
        console.error("Error adding education:", error);
        res.status(500).json({ error: "Failed to add education" });
    }
};

// Update education entry
const updateEducation = async (req, res) => {
    try {
        const { publicId } = req.params;
        const { school, location, degree, minor, year, gpa, status, courses } = req.body;

        const education = await Education.findOne({ publicId });
        if (!education) {
            return res.status(404).json({ error: "Education not found" });
        }

        // Handle logo update
        if (req.file) {
            if (education.logo) {
                await deleteFileFromS3(education.logo);
            }
            const s3Response = await uploadFileToS3(req.file, 'education');
            education.logo = s3Response.key;
        }

        // Parse courses if it's a string
        let parsedCourses = courses;
        if (typeof courses === 'string') {
            parsedCourses = courses.split(',').map(c => c.trim()).filter(c => c);
        }

        education.school = school || education.school;
        education.location = location || education.location;
        education.degree = degree || education.degree;
        education.minor = minor !== undefined ? minor : education.minor;
        education.year = year || education.year;
        education.gpa = gpa !== undefined ? gpa : education.gpa;
        education.status = status || education.status;
        education.courses = parsedCourses || education.courses;

        await education.save();
        
        // Return with full image URL
        const updatedEducation = {
            ...education.toObject(),
            logo: education.logo ? `${req.protocol}://${req.get('host')}/api/education/image/${encodeURIComponent(education.logo)}` : null
        };
        
        res.status(200).json(updatedEducation);
    } catch (error) {
        console.error("Error updating education:", error);
        res.status(500).json({ error: "Failed to update education" });
    }
};

// Delete education entry
const deleteEducation = async (req, res) => {
    try {
        const { publicId } = req.params;

        const deletedEducation = await Education.findOneAndDelete({ publicId });

        if (deletedEducation) {
            if (deletedEducation.logo) {
                await deleteFileFromS3(deletedEducation.logo);
            }
            res.status(200).json({ message: "Education deleted successfully" });
        } else {
            res.status(404).json({ error: "Education not found" });
        }
    } catch (error) {
        console.error("Error deleting education:", error);
        res.status(500).json({ error: "Failed to delete education" });
    }
};

export { getEducation, getEducationImage, addEducation, updateEducation, deleteEducation };
