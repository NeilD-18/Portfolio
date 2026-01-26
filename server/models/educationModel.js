import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const educationSchema = new mongoose.Schema({
    school: { type: String, required: true },
    location: { type: String, required: true },
    degree: { type: String, required: true },
    minor: { type: String },
    year: { type: String, required: true },
    gpa: { type: String },
    logo: { type: String },
    status: { type: String, enum: ['Current', 'Completed', 'Future'], default: 'Current' },
    courses: [{ type: String }],
    order: { type: Number, default: 0 },
    publicId: { type: String, required: true, unique: true, default: uuidv4 }
}, { timestamps: true });

const Education = mongoose.model("Education", educationSchema);

export default Education;
