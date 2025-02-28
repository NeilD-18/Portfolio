import { s3Client, uploadFileToS3, deleteFileFromS3 } from "../utils/s3FileUpload.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import Contact from "../models/contactModel.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"


const updateContact = async (req, res) => {
    try {
        const updates = req.body;
        let resumeKey = null;

        console.log("Received updates:", updates);
        console.log("Received file:", req.file ? req.file.originalname : "No file uploaded");

        let contact = await Contact.findOne();
        if (!contact) {
            contact = new Contact({ ...updates, resume: resumeKey });
            await contact.save();
        }

        // Preserve the existing resume if no new file is uploaded
        resumeKey = contact.resume; 

        // Handle Resume Upload
        if (req.file) {
            console.log("Uploading new resume...");
            const newFile = req.file;

            // Delete old resume if it exists
            if (contact.resume) {
                console.log("Deleting old resume...");
                await deleteFileFromS3(contact.resume);
            }

            // Upload new resume to S3
            const s3Response = await uploadFileToS3(newFile, "contact");
            console.log("S3 Upload Response:", s3Response);
            resumeKey = s3Response.key; // Store S3 object key
        }

        // Ensure the update includes the existing resume
        const updatedContact = await Contact.findOneAndUpdate(
            {},
            { 
                $set: { ...updates, resume: resumeKey }  // Always include resume
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, updatedContact });
    } catch (error) {
        console.error("Error updating contact info:", error);
        res.status(500).json({ error: "Failed to update contact info" });
    }
};


const getContact = async(req,res) => { 
    try { 
        const contact = await Contact.findOne()
        if (!contact) { 
            return res.status(404).json({ message: "Contact info not found" });
        }
        let resumeUrl = null;
        if (contact.resume) {
            const params = { Bucket: process.env.S3_BUCKET_NAME, Key: contact.resume };
            const command = new GetObjectCommand(params);
            resumeUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1-hour expiration
        }

        res.status(200).json({ ...contact.toObject(), resumeUrl });
    } catch (error) { 
        console.log(error)
        return res.status(500).json( { message: "Could not fetch contact"})
    }
}

export default { updateContact, getContact }