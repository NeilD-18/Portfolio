import { s3Client, uploadFileToS3, deleteFileFromS3 } from "../utils/s3FileUpload.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid'
import Project from "../models/projectModel.js";



const addProject = async (req, res) => { 
    try {
        console.log(req.body)
        const { title, description, githubURL, techStack, category, createdAt } = req.body;
        
        console.log(title, description, githubURL, techStack, category, createdAt)

        console.log('Uploaded file:', req.file);

    
        if (!title || !description || !githubURL || !techStack || !category || !createdAt  ) {
            return res.status(400).json({ error: "All fields are required" });
        }
        
        // Initialize the variable to store the S3 key
        let projectPictureKey = null;

        // Upload the file to S3 and get the key
        if (req.file) {
            const s3Response = await uploadFileToS3(req.file, 'project');
            console.log('S3 Upload Response:', s3Response);
            projectPictureKey = s3Response.key; // Save the key to MongoDB
        }

         // Create a new experience document
         const newProject = new Project({
            title: title,
            description: description,
            githubURL: githubURL,
            techStack: techStack,
            category: category, 
            createdAt: createdAt ? new Date(createdAt) : new Date(), 
            pinned: false,
            projectImage: projectPictureKey,
            publicId: uuidv4()
         })

         await newProject.save()
         res.status(201).json(newProject);
    }
    
        catch (error) { 
            console.error("Error adding project:", error.message || error);
            res.status(500).json({ error: "Failed to add project" });
        }
     

}

const updateProject = async (req,res) => { 
    try { 

        const { publicId } = req.params

        const { title,  description, githubURL, techStack, category, createdAt, pinned } = req.body

        console.log("Received update request for Project ID:", publicId);
        console.log("Received request body:", req.body);
        console.log("Received file:", req.file ? req.file.originalname : "No file uploaded");


        if (!title, !description, !githubURL, !techStack, !category, !createdAt, pinned == undefined) { 
            console.log("All Arguements not given")
            return res.status(400).json({error: "All fields are required"})
        }
    
        //Find project by pubID
        let project = await Project.findOne({ publicId  })
        if (!project) {
            return res.status(400).json({error: "Project not found"})
        }

        let projectPictureKey = project.projectImage
        console.log(projectPictureKey)
            // Check if a new file is uploaded
        if (req.file) {
            console.log('file uplaoded!!')
            const newFile = req.file;
    
            // If there's an existing image, delete it from S3
            if (projectPictureKey && projectPictureKey !== newFile.originalname) {
            console.log('deleting')
            const deleteResponse = await deleteFileFromS3(projectPictureKey);
            console.log('S3 Delete Response:', deleteResponse);
            }
    
            // Upload the new image to S3
            const s3Response = await uploadFileToS3(newFile, 'project');
            console.log('S3 Upload Response:', s3Response);
            projectPictureKey = s3Response.key; // Update the S3 key to the new image
        }

        project = await Project.findOneAndUpdate({publicId}, 
            {
                title, 
                description,
                githubURL,
                techStack,
                category, 
                createdAt, 
                pinned,
                projectImage: projectPictureKey

            },
            { new: true}
         )

        res.status(200).json(project)

    } catch (error) { 
        console.error("Error updating project:", error.message || error);
        res.status(500).json({ error: "Failed to update project" });
    }

}

const deleteProject = async (req, res) => {
    try { 
        const { publicId } = req.params

        const deletedProject = await Project.findOneAndDelete({publicId})

        if (deletedProject) { 
            const s3Key = deletedProject.projectImage

            if (s3Key) { 
                await deleteFileFromS3(s3Key)
                console.log("Company picture deleted from S3.");
            }
            res.status(200).json({ message: "Project and corresponding image deleted successfully" });
        }
        else { 
            res.status(404).json({ error: "Project not found" });
        }

    } catch (error) { 
        console.error(error)
        res.status(500).json({ error: "Failed to delete project or image" });
    }
    
}

const getProjectImage = async (req,res) => {
    const { key } = req.params;
    
    try {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
        };

        const command = new GetObjectCommand(params);
        const s3Response = await s3Client.send(command);

        res.setHeader('Content-Type', s3Response.ContentType);
        s3Response.Body.pipe(res);
    } catch (error) {
        console.error('Error fetching image from S3:', error.message);
        res.status(500).json({ error: 'Failed to fetch image' });
    }

}

const getProjects = async (req,res) => { 
    try {
        const projects = await Project.find()

        // Map through experiences to generate correct image URLs
        const projectsWithImageUrls = projects.map(proj => {
            
            console.log(proj.projectImage)
            return {
                ...proj.toObject(),
                projectImage: `${req.protocol}://${req.get('host')}/api/projects/image/${encodeURIComponent(proj.projectImage)}`
            };

            
    });

    res.status(200).json(projectsWithImageUrls);

    }
    
    
    catch (error) {
    console.error("Error retrieving experiences:", error.message || error);
    res.status(500).json({ error: "Failed to retrieve experiences" });
    }
}

export default { addProject, getProjectImage, getProjects, updateProject, deleteProject }