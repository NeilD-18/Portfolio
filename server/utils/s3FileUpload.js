import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

export const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (file) => {
    const uniqueFileName = `experienceImages/${Date.now()}-${file.originalname}`;
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