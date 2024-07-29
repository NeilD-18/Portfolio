import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    order: { type: Number, required: true, unique: true },
    companyPicture: { type: String, required: true },
    role: { type: String, required: true },
    responsibilities: { type: String, required: true },
    dateRange: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true }
    }
});

const Experience = mongoose.model("Experience", experienceSchema);

export default Experience;
