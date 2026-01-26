import React, { useContext, useState } from 'react';
import { useAuth } from '../../../../context/authContext';
import { UserContext } from '../../../../context/userContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import AboutSection from './UpdateAboutSection';
import Experiences from './UpdateExperiencesSection';
import Projects from './UpdateProjectsSection';
import ContactSection from './UpdateContactSection';
import EducationSection from './UpdateEducationSection';
import MoodBoardSection from './UpdateMoodBoardSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faHome, faBell } from '@fortawesome/free-solid-svg-icons';
import { handleLogout } from '../handlers/portalHandlers';
import { portalSections } from '../../../constants';

const Portal = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);  
  const [currentSection, setCurrentSection] = useState(portalSections[0]);

  const renderSection = () => {
    switch (currentSection) {
      case 'About':
        return <AboutSection />;
      case 'Experiences':
        return <Experiences />;
      case 'Projects':
        return <Projects />;
      case 'Contact':
        return <ContactSection />;
      case 'Education':
        return <EducationSection />;
      case 'MoodBoard':
        return <MoodBoardSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <Sidebar 
        sections={portalSections} 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection} 
      />
      
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-[#0a0a0f] border-b border-white/10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-white">{currentSection}</h1>
            <span className="text-xs text-secondary px-3 py-1 rounded-full bg-white/5 border border-white/10">
              Live editing
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Site */}
            <button
              onClick={() => window.open('/', '_blank')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-secondary hover:text-white transition-all"
            >
              <FontAwesomeIcon icon={faHome} className="text-sm" />
              <span className="text-sm">View Site</span>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#915EFF] to-[#00CEA8] flex items-center justify-center overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'N'}
                  </span>
                )}
              </div>
              {user && (
                <span className="text-sm font-medium text-white hidden md:block">
                  {user.username}
                </span>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={() => handleLogout(logout, navigate)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-all"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
              <span className="text-sm hidden md:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Portal;
