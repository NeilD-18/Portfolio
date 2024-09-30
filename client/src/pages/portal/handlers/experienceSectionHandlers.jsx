// experienceSectionHandlers.js
import { arrayMove } from "@dnd-kit/sortable";
import axios from "axios";




  
export const handleExperienceSubmit = async (e, newExperience, setExperiences, experiences, setModalIsOpen) => {
  e.preventDefault();

  // Determine the order for the new experience
  const maxOrder = experiences.reduce((max, exp) => (exp.order > max ? exp.order : max), 0);
  const order = maxOrder + 1;
  
  const form = new FormData();
  form.append('role', newExperience.role);
  form.append('responsibilities', newExperience.responsibilities);
  form.append('startDate', newExperience.startDate.toISOString().slice(0, 7)); // Only keep the year and month
  form.append('endDate', newExperience.endDate.toISOString().slice(0, 7)); // Only keep the year and month
  form.append('companyPicture', newExperience.companyPicture);
  form.append('order', order);


  try {
      const response = await axios.post('/experiences', form, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      setExperiences([...experiences, response.data]);
      setModalIsOpen(false);
  } catch (error) {
      console.error(error);
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
      // Parse the YYYY-MM string to a Date object, setting the first day of the month
      startDate: experienceToUpdate.startDate ? new Date(`${experienceToUpdate.startDate}-01T00:00:00Z`) : null,
      endDate: experienceToUpdate.endDate ? new Date(`${experienceToUpdate.endDate}-01T00:00:00Z`) : null,
    });
    setModalIsOpen(true);
  }
};
  
export const handleDeleteExperience = async (publicId, setExperiences, prevExperiences) => {
  try {
      const response = await axios.delete(`/experiences/${publicId}`);
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
    const response = await axios.get('/experiences');
    console.log(response.data);
    setExperiences(response.data); 
  } catch (error) {
    console.error('Error fetching experiences:', error);
  }
};
  