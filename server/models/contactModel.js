import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    linkedinUsername: { type: String, trim: true },
    githubUsername: { type: String, trim: true },
    instagramUsername: { type: String, trim: true },
    snapchatUsername: { type: String, trim: true },
    youtubeUsername: { type: String, trim: true },
    resume: { type: String, required: false } // Stores the S3 object key or full S3 URL
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;


