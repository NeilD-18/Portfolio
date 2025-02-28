import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid'; // UUID for generating unique IDs

const experienceSchema = new mongoose.Schema({
    role: { type: String, required: true },
    companyName: { type: String, required: true}, 
    responsibilities: { type: String, required: true },
    companyPicture: {type: String, required: true },
    dateRange: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    },
    publicId: { type: String, required: true, unique: true, default: uuidv4 }
});

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
