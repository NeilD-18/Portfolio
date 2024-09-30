import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faBriefcase, faCog } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ sections, setCurrentSection }) => {
  const sectionIcons = {
    About: faUser,
    Experiences: faBriefcase,
    Contact: faEnvelope
  };

  return (
    <div className="bg-gray-900 text-white w-64 h-screen p-6 shadow-lg border-r border-gray-800 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-8 text-purple-500">Admin Portal</h2>
        <ul className="space-y-4">
          {sections.map((section) => (
            <li key={section}>
              <button
                onClick={() => setCurrentSection(section)}
                className="flex items-center text-lg w-full text-left p-3 rounded-lg hover:bg-purple-700 hover:text-white transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <FontAwesomeIcon icon={sectionIcons[section]} className="mr-3" />
                {section}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
