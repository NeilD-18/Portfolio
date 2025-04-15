import axios from "axios";


// **Fetch all projects from the database**
export const handleFetchProjects = async (setProjects) => {
    try {
      const response = await axios.get("/api/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };