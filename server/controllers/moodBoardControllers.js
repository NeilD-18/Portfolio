import MoodBoard from "../models/moodBoardModel.js";
import { s3Client, uploadFileToS3, deleteFileFromS3 } from "../utils/s3FileUpload.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// Get all mood board items (optionally filter by category)
const getMoodBoard = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const items = await MoodBoard.find(filter).sort({ order: 1, createdAt: -1 });
        
        // Map through items to generate correct image URLs
        const itemsWithImageUrls = items.map(item => {
            return {
                ...item.toObject(),
                imageUrl: item.imageUrl ? `${req.protocol}://${req.get('host')}/api/moodboard/image/${encodeURIComponent(item.imageUrl)}` : null
            };
        });
        
        res.status(200).json(itemsWithImageUrls);
    } catch (error) {
        console.error("Error fetching mood board:", error);
        res.status(500).json({ error: "Failed to fetch mood board" });
    }
};

// Get mood board image from S3
const getMoodBoardImage = async (req, res) => {
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

// Add new mood board item (or update if slot already exists)
const addMoodBoardItem = async (req, res) => {
    try {
        const { category, label, slot, gridTemplate } = req.body;

        if (!category || !label) {
            return res.status(400).json({ error: "Category and label are required" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        // Calculate aspect ratio from image
        const metadata = await sharp(req.file.buffer).metadata();
        const aspectRatio = metadata.width / metadata.height;

        // If slot is specified, check if it already exists and update it
        if (slot) {
            const existingItem = await MoodBoard.findOne({ slot, gridTemplate: gridTemplate || 'bento-6' });
            if (existingItem) {
                // Delete old image from S3
                if (existingItem.imageUrl) {
                    await deleteFileFromS3(existingItem.imageUrl);
                }
                // Upload new image
                const s3Response = await uploadFileToS3(req.file, 'moodboard');
                existingItem.imageUrl = s3Response.key;
                existingItem.category = category;
                existingItem.label = label;
                existingItem.aspectRatio = aspectRatio;
                await existingItem.save();
                
                const updatedItem = {
                    ...existingItem.toObject(),
                    imageUrl: `${req.protocol}://${req.get('host')}/api/moodboard/image/${encodeURIComponent(existingItem.imageUrl)}`
                };
                return res.status(200).json(updatedItem);
            }
        }

        const s3Response = await uploadFileToS3(req.file, 'moodboard');
        const imageKey = s3Response.key;

        const newItem = new MoodBoard({
            imageUrl: imageKey,
            category,
            label,
            slot: slot || null,
            gridTemplate: gridTemplate || 'bento-6',
            aspectRatio,
            publicId: uuidv4(),
        });

        await newItem.save();
        
        const savedItem = {
            ...newItem.toObject(),
            imageUrl: `${req.protocol}://${req.get('host')}/api/moodboard/image/${encodeURIComponent(imageKey)}`
        };
        
        res.status(201).json(savedItem);
    } catch (error) {
        console.error("Error adding mood board item:", error);
        res.status(500).json({ error: "Failed to add mood board item" });
    }
};

// Update mood board item
const updateMoodBoardItem = async (req, res) => {
    try {
        const { publicId } = req.params;
        const { category, label, slot } = req.body;

        const item = await MoodBoard.findOne({ publicId });
        if (!item) {
            return res.status(404).json({ error: "Mood board item not found" });
        }

        // Handle image update
        if (req.file) {
            if (item.imageUrl) {
                await deleteFileFromS3(item.imageUrl);
            }
            const s3Response = await uploadFileToS3(req.file, 'moodboard');
            item.imageUrl = s3Response.key;
            
            // Calculate new aspect ratio
            const metadata = await sharp(req.file.buffer).metadata();
            item.aspectRatio = metadata.width / metadata.height;
        }

        item.category = category || item.category;
        item.label = label || item.label;
        if (slot !== undefined) {
            item.slot = slot || null;
        }

        await item.save();
        
        const updatedItem = {
            ...item.toObject(),
            imageUrl: `${req.protocol}://${req.get('host')}/api/moodboard/image/${encodeURIComponent(item.imageUrl)}`
        };
        
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error("Error updating mood board item:", error);
        res.status(500).json({ error: "Failed to update mood board item" });
    }
};

// Delete mood board item
const deleteMoodBoardItem = async (req, res) => {
    try {
        const { publicId } = req.params;

        const deletedItem = await MoodBoard.findOneAndDelete({ publicId });

        if (deletedItem) {
            if (deletedItem.imageUrl) {
                await deleteFileFromS3(deletedItem.imageUrl);
            }
            res.status(200).json({ message: "Mood board item deleted successfully" });
        } else {
            res.status(404).json({ error: "Mood board item not found" });
        }
    } catch (error) {
        console.error("Error deleting mood board item:", error);
        res.status(500).json({ error: "Failed to delete mood board item" });
    }
};

// Clear a specific slot
const clearSlot = async (req, res) => {
    try {
        const { slot } = req.params;
        const { gridTemplate } = req.query;

        const item = await MoodBoard.findOneAndDelete({ slot, gridTemplate: gridTemplate || 'bento-6' });

        if (item) {
            if (item.imageUrl) {
                await deleteFileFromS3(item.imageUrl);
            }
            res.status(200).json({ message: "Slot cleared successfully" });
        } else {
            res.status(200).json({ message: "Slot was already empty" });
        }
    } catch (error) {
        console.error("Error clearing slot:", error);
        res.status(500).json({ error: "Failed to clear slot" });
    }
};

export { getMoodBoard, getMoodBoardImage, addMoodBoardItem, updateMoodBoardItem, deleteMoodBoardItem, clearSlot };
