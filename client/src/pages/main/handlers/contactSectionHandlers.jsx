import axios from "axios";

export const handleFetchSocialLinks = async (setSocialLinks, socialPlatformsHover) => {
    try {
      const { data } = await axios.get("/api/contact");
      const updatedLinks = {};

      Object.keys(socialPlatformsHover).forEach((key) => {
        if (data[`${key}Username`]) {
          updatedLinks[key] = socialPlatformsHover[key].baseUrl + data[`${key}Username`];
        }
      });

      setSocialLinks(updatedLinks);
    } catch (error) {
      console.error("Error fetching social media links:", error);
    }
};

export const handleFetchResumeUrl = async (setResumeUrl) => {
    try {
      const { data } = await axios.get("/api/contact");
      if (data.resumeUrl) {
        setResumeUrl(data.resumeUrl);
      }
    } catch (error) {
      console.error("Error fetching resume URL:", error);
    }
};
