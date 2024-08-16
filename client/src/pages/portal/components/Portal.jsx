import React, { useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../../context/authContext';
import { UserContext } from '../../../../context/userContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';
import AboutSection from './UpdateAboutSection';
import Experiences from './UpdateExperiencesSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { handleLogout } from '../handlers/portalHandlers';

const sections = ['About', 'Experiences', 'Contact'];

const Portal = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [currentSection, setCurrentSection] = useState(sections[0]);



  
  const handleAboutTextUpdate = async () => {
    try {
      await mockUpdateAboutText(newAboutText);
      setAboutText(newAboutText);
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


 

  const renderSection = () => {
    switch (currentSection) {
      case 'About':
        return (
          <AboutSection 
           
          /> 
        );
      case 'Experiences':
        return (
          <Experiences
            
          />
        );
      case 'Contact':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Contact Section</h2>
            {/* Add form or content to update contact info here */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar sections={sections} setCurrentSection={setCurrentSection} />
      <div className="flex-1 text-white p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={user?.profilePicture || 'https://via.placeholder.com/40'}
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
