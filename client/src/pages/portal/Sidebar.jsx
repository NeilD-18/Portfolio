import React from 'react';

const Sidebar = ({ sections, setCurrentSection }) => {
  return (
    <div className="bg-gray-900 text-white w-64 h-screen p-4 shadow-lg border border-gray-700">
      <h2 className="text-3xl font-bold mb-6">Admin Portal</h2>
      <ul className="space-y-4">
        {sections.map((section) => (
          <li key={section}>
            <button
              onClick={() => setCurrentSection(section)}
              className="text-lg w-full text-left p-2 rounded-xl hover:bg-gray-800 transition-colors duration-300"
            >
              {section}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
