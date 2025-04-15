import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();



export const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },      
    region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (file, folder) => {
    // Determine the folder path based on the input
    let uniqueFileName;

    if (folder === 'experience') {
        uniqueFileName = `experienceImages/${Date.now()}-${file.originalname}`;
    } else if (folder === 'about') {
        uniqueFileName = `aboutImages/${Date.now()}-${file.originalname}`;
    } else if (folder === 'project') { 
        uniqueFileName = `projectImages/${Date.now()}-${file.originalname}`;
    }  else if (folder === 'contact') {
        uniqueFileName = `contactFiles/${Date.now()}-${file.originalname}`;
    } else {
        throw new Error("Invalid folder specified");
    }
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: uniqueFileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        // Upload the file to S3
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return { key: uniqueFileName }; // Return the S3 key
    } catch (error) {
        throw new Error(`File upload failed: ${error.message}`);
    }
};


export const deleteFileFromS3 = async (s3Key) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME, // Ensure S3_BUCKET_NAME is set in your environment variables
        Key: s3Key
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command); // Send the delete request to S3
        console.log(`File ${s3Key} deleted from S3.`);
    } catch (error) {
        console.error(`Failed to delete file from S3: ${error.message}`);
        throw new Error('Failed to delete file from S3');
    }
};