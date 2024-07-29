import React, { useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../../context/authContext';
import { UserContext } from '../../../../context/userContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';
import AboutSection from './UpdateAboutSection';
import Experiences from './UpdateExperiencesSection';

const sections = ['About', 'Experiences', 'Contact'];

const Portal = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [aboutText, setAboutText] = useState('');
  const [newAboutText, setNewAboutText] = useState('');
  const [currentSection, setCurrentSection] = useState(sections[0]);

  useEffect(() => {
    const fetchAboutText = async () => {
      const currentAboutText = await mockFetchAboutText();
      setAboutText(currentAboutText);
    };
    fetchAboutText();
  }, []);

  const mockFetchAboutText = async () => {
    return 'This is the current About text.';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast('Logout Successful', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Failed to logout', error);
      toast('Logout Failed. Try Again', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const handleAboutTextUpdate = async () => {
    try {
      await mockUpdateAboutText(newAboutText);
      setAboutText(newAboutText);
      toast('About text updated successfully', {
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Failed to update About text', error);
      toast('Update Failed. Try Again', {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const mockUpdateAboutText = async (text) => {
    console.log('Updating About text to:', text);
  };


  const [experiences, setExperiences] = useState([
    { id: '1', name: 'Experience 1', description: 'Description 1', image: 'https://via.placeholder.com/150', order: 1 },
    { id: '2', name: 'Experience 2', description: 'Description 2', image: 'https://via.placeholder.com/150', order: 2 },
  ]);

  const [newExperience, setNewExperience] = useState({ name: '', description: '', image: '' });

  const handleAddExperience = () => {
    const newExp = { ...newExperience, id: String(experiences.length + 1), order: experiences.length + 1 };
    setExperiences([...experiences, newExp]);
    setNewExperience({ name: '', description: '', image: '' });
  };

  const handleUpdateExperience = (id) => {
    // Logic to update experience
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };





  const renderSection = () => {
    switch (currentSection) {
      case 'About':
        return (
            <AboutSection 
              aboutText={aboutText} 
              newAboutText={newAboutText} 
              setNewAboutText={setNewAboutText}
              handleAboutTextUpdate={handleAboutTextUpdate}
            /> 
        );
      case 'Experiences':
        return (
          
            
            <Experiences
              experiences={experiences}
              setExperiences={setExperiences}
              newExperience={newExperience}
              setNewExperience={setNewExperience}
              handleAddExperience={handleAddExperience}
              handleUpdateExperience={handleUpdateExperience}
              handleDeleteExperience={handleDeleteExperience}
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
          {!!user && <p>{user.username}</p>}
          
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
        <div className="bg-gray-900 rounded-3xl shadow-lg p-6 border border-gray-700">
          
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Portal;
