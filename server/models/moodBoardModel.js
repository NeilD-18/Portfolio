import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const moodBoardSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    category: { type: String, enum: ['Athletics', 'Aesthetic', 'Life'], required: true },
    label: { type: String, required: true },
    slot: { type: String, default: null }, // Grid slot position (e.g., "hero", "slot-1", "slot-2")
    gridTemplate: { type: String, default: 'bento-6' }, // Which template this belongs to
    order: { type: Number, default: 0 },
    aspectRatio: { type: Number, default: 1 }, // width / height (e.g., 1.5 for 3:2, 0.8 for 4:5)
    publicId: { type: String, required: true, unique: true, default: uuidv4 }
}, { timestamps: true });

const MoodBoard = mongoose.model("MoodBoard", moodBoardSchema);

export default MoodBoard;
