import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AddExperienceModal from '../modals/addExperienceModal';
import { fetchExperiences, handleExperienceSubmit, handleFileChange, handleUpdateExperience, handleDeleteExperience, handleUpdateExperienceSubmit } from '../handlers/experienceSectionHandlers';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newExperience, setNewExperience] = useState({
    companyName: '', 
    role: '',
    responsibilities: '',
    startDate: null,
    endDate: null,
    companyPicture: null,
    publicId: null, 
  });

  useEffect(() => { fetchExperiences(setExperiences); }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6">Experiences</h2>
      
        
          {experiences.map((experience) => (
           
              <div className="p-6 bg-gray-800 text-white border border-gray-700 rounded-xl mb-4 shadow-lg" key={experience.publicId}>
                <div className="flex items-center space-x-4">
                  <img src={experience.companyPicture} alt={experience.role} className="w-16 h-16 object-cover rounded-full" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{experience.role}</h3>
                    <h2 className="text-lg ">{experience.companyName}</h2>
                    <p className="text-gray-400">{experience.responsibilities}</p>
                    <p>{String(new Date(experience.dateRange.startDate).getUTCMonth() + 1).padStart(2, '0')}/{new Date(experience.dateRange.startDate).getUTCFullYear()} - {String(new Date(experience.dateRange.endDate).getUTCMonth() + 1).padStart(2, '0')}/{new Date(experience.dateRange.endDate).getUTCFullYear()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleUpdateExperience(experience.publicId, experiences, setNewExperience, setModalIsOpen)} className="text-blue-500 hover:text-blue-700 transition duration-300">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDeleteExperience(experience.publicId, setExperiences, experiences)} className="text-red-500 hover:text-red-700 transition duration-300">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            
          ))}
       
     

      <button 
        onClick={() => setModalIsOpen(true)} 
        className="fixed bottom-10 right-10 w-16 h-16 bg-violet-700 text-white rounded-full text-3xl font-bold flex items-center justify-center hover:bg-violet-800 transition duration-300"
      >
        +
      </button>

      <AddExperienceModal 
        modalIsOpen = {modalIsOpen}
        setModalIsOpen = {setModalIsOpen}
        handleExperienceSubmit = {handleExperienceSubmit}
        handleUpdateExperienceSubmit={handleUpdateExperienceSubmit}
        experiences = {experiences}
        setExperiences = {setExperiences}
        newExperience = {newExperience}
        setNewExperience = {setNewExperience}
        handleFileChange= {handleFileChange}
    

      />
    </div>
  );
};

export default Experiences;
