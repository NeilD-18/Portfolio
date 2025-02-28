import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid'; // UUID for generating unique IDs

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    githubURL: { type: String, required: true },
    techStack: { type: String, required: true }, // Fixed array declaration
    category: { type: String, required: false},
    createdAt: {type: Date, required: true}, 
    pinned: {type: Boolean, required: true},  
    projectImage: { type: String, required: true },
    publicId: { type: String, unique: true, default: uuidv4 }, // Correctly set default
  },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
