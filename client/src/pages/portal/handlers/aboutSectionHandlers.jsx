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