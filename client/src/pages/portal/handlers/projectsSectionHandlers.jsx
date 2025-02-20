import axios from "axios";

// **Fetch all projects from the database**
export const fetchProjects = async (setProjects) => {
  try {
    const response = await axios.get("/projects");
    setProjects(response.data);
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
};

// **Handle file change for image upload**
export const handleFileChange = (e, setNewProject) => {
  const file = e.target.files[0];
  setNewProject((prev) => ({ ...prev, projectImage: file }));
};

// **Submit a new project**
export const handleProjectSubmit = async (e, newProject, setProjects) => {
  
 
  e.preventDefault()
  const formData = new FormData();
  formData.append("title", newProject.title);
  formData.append("description", newProject.description);
  formData.append("githubURL", newProject.githubURL);
  formData.append("techStack", newProject.techStack);
  formData.append("category", newProject.category)
  formData.append("createdAt", newProject.createdAt.toISOString().slice(0, 7))
  if (newProject.projectImage) {
    formData.append("projectImage", newProject.projectImage);
  }

  try {
    const response = await axios.post("/add-project", formData, {
      headers: { 
        "Content-Type": "multipart/form-data" 
      },
    });
    setProjects((prevProjects) => [...prevProjects, response.data]);
    fetchProjects(setProjects)
  } catch (error) {
    console.error("Error submitting new project:", error);
  }
};

// **Handle edit project (prefill data)**
export const handleUpdateProject = (publicId, projects, setNewProject, setModalIsOpen) => {
  const projectToEdit = projects.find((project) => project.publicId === publicId);
  if (projectToEdit) {
    setNewProject(projectToEdit);
    setModalIsOpen(true);
  }
};

// **Submit updated project**
export const handleUpdateProjectSubmit = async (e, updatedProject, setProjects) => {
  
  e.preventDefault()
  console.log(updatedProject.createdAt)

  const formData = new FormData();
  formData.append("title", updatedProject.title);
  formData.append("description", updatedProject.description);
  formData.append("githubURL", updatedProject.githubURL);
  formData.append("techStack", updatedProject.techStack);
  formData.append("category", updatedProject.category)
  formData.append("createdAt", new Date(updatedProject.createdAt).toISOString().slice(0, 7))
  if (updatedProject.projectImage instanceof File) {
    formData.append("projectImage", updatedProject.projectImage);
  }
  
  try {

    await axios.put(`/projects/update/${updatedProject.publicId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.publicId === updatedProject.publicId ? updatedProject : project
      )
    );
    fetchProjects(setProjects)
  } catch (error) {
    console.error("Error updating project:", error);
  }
};

// **Delete project**
export const handleDeleteProject = async (publicId, setProjects, projects) => {
  try {
    await axios.delete(`/projects/delete/${publicId}`);
    setProjects(projects.filter((project) => project.publicId !== publicId));
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};
