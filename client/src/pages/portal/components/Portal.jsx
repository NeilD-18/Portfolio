import React, { useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../../context/authContext';
import { UserContext } from '../../../../context/userContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AboutSection from './UpdateAboutSection';
import Experiences from './UpdateExperiencesSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { handleLogout } from '../handlers/portalHandlers';
import Projects from './UpdateProjectsSection';
import ContactSection from './UpdateContactSection';
import { portalSections } from '../../../constants';



const Portal = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);  
  const [currentSection, setCurrentSection] = useState(portalSections[0]);


  const renderSection = () => {
    switch (currentSection) {
      case 'About':
        return (
          <AboutSection /> 
        );
      case 'Experiences':
        return (
          <Experiences />
        );


      case 'Projects':
        return (
            <Projects/>      
        );
      case 'Contact':
        return (
          <ContactSection/>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar sections={portalSections} setCurrentSection={setCurrentSection} />
      <div className="flex-1 text-white p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.profilePicture || '/Neil_Logo.svg'}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            {!!user && <p className="text-lg font-semibold">{user.username}</p>}
          </div>
          <button
            onClick={() => handleLogout(logout, navigate)}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors duration-300 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
        <div className="bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-700">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Portal;
