import express from 'express';
import { getMoodBoard, getMoodBoardImage, addMoodBoardItem, updateMoodBoardItem, deleteMoodBoardItem, clearSlot } from '../controllers/moodBoardControllers.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// MoodBoard Routes
router.get('/moodboard', getMoodBoard);
router.get('/moodboard/image/:key', getMoodBoardImage);
router.post('/moodboard', upload.single('image'), addMoodBoardItem);
router.put('/moodboard/:publicId', upload.single('image'), updateMoodBoardItem);
router.delete('/moodboard/:publicId', deleteMoodBoardItem);
router.delete('/moodboard/slot/:slot', clearSlot);

export default router;
