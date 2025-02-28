import axios from 'axios';
import toast from 'react-hot-toast'; // Assuming you're using react-hot-toast for notifications

export const handleAboutTextUpdate = async (newAboutText, setAboutText) => {
    try {
        
        const response = await axios.put('/about', {
            about: newAboutText
        });

        
        setAboutText(response.data.about);

        // Show success toast notification
        toast('About text updated successfully', {
            icon: '✅',
            style: {
                borderRadius: '10px',
                background: '#1c1c1e',
                color: '#fff',
            },
        });
    } catch (error) {
        console.error('Failed to update About text', error);

        // Show error toast notification
        toast('Update Failed. Try Again', {
            icon: '❌',
            style: {
                borderRadius: '10px',
                background: '#1c1c1e',
                color: '#fff',
            },
        });
    }
};

export const handleFetchAboutText = async (setAboutText) => {
    try {
        // Perform the GET request to fetch the current about text
        const response = await axios.get('/about');
        setAboutText(response.data.about);
    } catch (error) {
        console.error('Failed to fetch About text', error);
    }
};


export const handleFetchAboutImages = async (setImages) => {
    try {
      const response = await axios.get("/about/images"); 
      setImages(response.data.images || [null, null, null, null]); 
    } catch (error) {
      console.error("Error fetching images:", error);
    }
};

export const handleImageUpload = async (event, index, setRefresh) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("index", index); // Specify the slot index

      try {
        const response = await axios.post("/about/update-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Image updated successfully:", response.data);
        setRefresh((prev) => !prev); // Toggle refresh to re-trigger useEffect
      } catch (error) {
        console.error("Error updating image:", error);
      }
    }
  };

  export const handleSquareClick = (index, setRefresh) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => handleImageUpload(e, index, setRefresh);
    input.click();
  };



