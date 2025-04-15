// experienceSectionHandlers.js
import { arrayMove } from "@dnd-kit/sortable";
import axios from "axios";




  
export const handleExperienceSubmit = async (e, newExperience, setExperiences, experiences, setModalIsOpen) => {
  e.preventDefault();

  
  const form = new FormData();
  form.append('companyName', newExperience.companyName)
  form.append('role', newExperience.role);
  form.append('responsibilities', newExperience.responsibilities);
  form.append('startDate', newExperience.startDate.toISOString().slice(0, 7)); // Only keep the year and month
  form.append('endDate', newExperience.endDate.toISOString().slice(0, 7)); // Only keep the year and month
  form.append('companyPicture', newExperience.companyPicture);
  
  


  try {
      const response = await axios.post('/api/experiences', form, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      setExperiences([...experiences, response.data]);
      fetchExperiences(setExperiences)
      setModalIsOpen(false);
  } catch (error) {
      console.error(error);
  }
};

export const handleUpdateExperienceSubmit = async (e, experienceId, newExperience, setExperiences,experiences, setModalIsOpen) => {
  
  e.preventDefault()
  
  const {role, responsibilities, startDate, endDate, companyPicture, companyName } = newExperience;
  console.log(role)
  console.log(responsibilities)
  console.log(startDate)
  console.log(endDate)
  console.log(companyPicture)
  
  const formData = new FormData();

  if (!role || !responsibilities || !startDate || !endDate || !companyName)  {
    return alert("All fields are required");
  }

  formData.append('companyName', companyName)
  formData.append('role', role);
  formData.append('responsibilities', responsibilities);
  formData.append('startDate', startDate.toISOString().slice(0, 7));
  formData.append('endDate', endDate.toISOString().slice(0, 7));

  // If a new file is selected, append it to formData
  if (companyPicture) {
    console.log('file added')
    formData.append('companyPicture', companyPicture); // 'companyPicture' should match the field name in your backend
  }
  
  
  
  try {
    
    // Send the update request to the backend
    const response = await axios.put(`/api/experience/update/${experienceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the correct headers are set for file upload
      },
    });

    // If the request is successful, update the state
    if (response.status === 200) {
      // Update the experiences state
      const updatedExperiences = experiences.map((exp) =>
        exp.publicId === experienceId ? response.data : exp
      );
      setExperiences(updatedExperiences);

      // Close the modal
      setModalIsOpen(false);
      
      fetchExperiences(setExperiences)
    } else {
      alert("Failed to update experience");
    }
  } catch (error) {
    console.error("Error updating experience:", error.message || error);
    alert("Error updating experience");
  }
};



  
export const handleFileChange = (e, newExperience, setNewExperience) => {
  setNewExperience({
    ...newExperience,
    companyPicture: e.target.files[0],
  });
};


export const handleUpdateExperience = (id, experiences, setNewExperience, setModalIsOpen) => {
  const experienceToUpdate = experiences.find(experience => experience.publicId === id);

  if (experienceToUpdate) {
    setNewExperience({
      ...experienceToUpdate, 
      // Directly use the Date objects stored in the database for startDate and endDate
      startDate: experienceToUpdate.dateRange.startDate ? new Date(experienceToUpdate.dateRange.startDate) : null,
      endDate: experienceToUpdate.dateRange.endDate ? new Date(experienceToUpdate.dateRange.endDate) : null,
    });
    setModalIsOpen(true);
  }
};
export const handleDeleteExperience = async (publicId, setExperiences, prevExperiences) => {
  try {
      const response = await axios.delete(`/api/experiences/${publicId}`);
      if (response.status === 200) {
          setExperiences(prevExperiences => prevExperiences.filter(exp => exp.publicId !== publicId));
      } else {
          console.error('Failed to delete experience');
      }
  } catch (error) {
      console.error('Error deleting experience:', error);
  }
};

export const fetchExperiences = async (setExperiences) => {
  try {
    const response = await axios.get('/api/experiences');
    console.log(response.data);
    setExperiences(response.data); 
  } catch (error) {
    console.error('Error fetching experiences:', error);
  }
};
  