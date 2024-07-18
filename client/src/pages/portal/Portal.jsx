import React, { useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../context/authContext';
import { UserContext } from '../../../context/userContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';

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

  const renderSection = () => {
    switch (currentSection) {
      case 'About':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">About Section</h2>
            <p className="text-gray-400 mb-4">{aboutText}</p>
            <textarea
              value={newAboutText}
              onChange={(e) => setNewAboutText(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-xl mb-2"
              placeholder="Update About text..."
            ></textarea>
            <button
              onClick={handleAboutTextUpdate}
              className="bg-violet-700 text-white px-4 py-2 rounded-xl hover:bg-violet-800 transition-colors duration-300"
            >
              Update About Text
            </button>
          </div>
        );
      case 'Experiences':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Experiences Section</h2>
            {/* Add form or content to update experiences here */}
          </div>
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
