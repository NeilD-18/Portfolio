import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
    about: {type: String, required: true},
    images: [{ type: String }] 
})

const About = mongoose.model("About",aboutSchema)

export default About


