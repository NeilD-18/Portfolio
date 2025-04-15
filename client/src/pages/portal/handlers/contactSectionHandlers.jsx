import axios from "axios";


export const handleFetchContactData = async (setSocialLinks, setResumeUrl, setResumeName, socialPlatforms) => {
    try {
      const { data } = await axios.get("/api/contact");
      if (data) {
        const formattedLinks = {};
        Object.keys(socialPlatforms).forEach((key) => {
          formattedLinks[key] = socialPlatforms[key].baseUrl + (data[`${key}Username`] || "");
        });
        setSocialLinks(formattedLinks);
        setResumeUrl(data.resumeUrl || null);
        setResumeName(data.resumeName || ""); // Store filename for display
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
    }
};

export const handleSave = async (platform, setSocialLinks, setEditing, socialPlatforms, tempUsername) => {
    const usernameKey = `${platform}Username`;
    const updatedLinks = { [usernameKey]: tempUsername };

    try {
      const { data } = await axios.put("/api/update-contact", updatedLinks);

      if (data.success) {
        setSocialLinks((prev) => ({
          ...prev,
          [platform]: socialPlatforms[platform].baseUrl + tempUsername,
        }));
        setEditing(null);
      }
    } catch (error) {
      console.error("Error updating social link:", error);
    }
};

// Handle Resume Upload
export const handleResumeUpload = async (selectedFile, setLoading, setResumeUrl, setResumeName, setSelectedFile) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("resume", selectedFile);

    setLoading(true);
    try {
      const { data } = await axios.put("/api/update-contact", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setResumeUrl(data.updatedContact.resumeUrl);
        setResumeName(selectedFile.name); // Update the filename display
        setSelectedFile(null); // Clear selected file after successful upload
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
    } finally {
      setLoading(false);
    }
  };


export const handleCancel =  (setEditing) => { 
    setEditing(null);
}

export const handleEditClick = (platform, setEditing, setTempUsername, extractUsername, socialLinks) => {
    setEditing(platform);
    setTempUsername(extractUsername(socialLinks[platform], platform));
  };