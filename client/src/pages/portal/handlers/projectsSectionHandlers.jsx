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
export const handleProjectSubmit = async (newProject, setProjects) => {
  try {
    const formData = new FormData();
    formData.append("title", newProject.title);
    formData.append("description", newProject.description);
    formData.append("githubLink", newProject.githubLink);
    formData.append("techStack", newProject.techStack);
    if (newProject.projectImage) {
      formData.append("projectImage", newProject.projectImage);
    }

    const response = await axios.post("/projects/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setProjects((prevProjects) => [...prevProjects, response.data]);
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
export const handleUpdateProjectSubmit = async (updatedProject, setProjects) => {
  try {
    const formData = new FormData();
    formData.append("title", updatedProject.title);
    formData.append("description", updatedProject.description);
    formData.append("githubLink", updatedProject.githubLink);
    formData.append("techStack", updatedProject.techStack);
    if (updatedProject.projectImage instanceof File) {
      formData.append("projectImage", updatedProject.projectImage);
    }

    await axios.put(`/projects/edit/${updatedProject.publicId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.publicId === updatedProject.publicId ? updatedProject : project
      )
    );
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
