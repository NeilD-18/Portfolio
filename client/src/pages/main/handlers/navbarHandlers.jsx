import axios from 'axios';


export const getResume = async (setResumeUrl) => { 
    try {
      const { data } = await axios.get("/api/contact");
      if (data.resumeUrl) {
        setResumeUrl(data.resumeUrl);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };