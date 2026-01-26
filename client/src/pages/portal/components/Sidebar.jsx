import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faBriefcase, 
  faCode, 
  faContactCard,
  faGraduationCap,
  faCamera,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ sections, currentSection, setCurrentSection }) => {
  const [collapsed, setCollapsed] = useState(false);

  const sectionIcons = {
    About: faUser,
    Experiences: faBriefcase,
    Projects: faCode,
    Contact: faContactCard,
    Education: faGraduationCap,
    MoodBoard: faCamera,
  };

  const sectionColors = {
    About: 'from-blue-500 to-cyan-500',
    Experiences: 'from-purple-500 to-pink-500',
    Projects: 'from-green-500 to-emerald-500',
    Contact: 'from-orange-500 to-yellow-500',
    Education: 'from-indigo-500 to-purple-500',
    MoodBoard: 'from-pink-500 to-rose-500',
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} h-screen bg-[#0a0a0f] border-r border-white/10 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-white">Portal</h2>
              <p className="text-xs text-secondary mt-1">Manage your content</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-secondary hover:text-white transition-all"
          >
            <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="text-xs" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sections.map((section) => {
          const isActive = currentSection === section;
          return (
            <button
              key={section}
              onClick={() => setCurrentSection(section)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#915EFF]/20 to-transparent border-l-4 border-[#915EFF] text-white'
                  : 'text-secondary hover:bg-white/5 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                isActive 
                  ? `bg-gradient-to-br ${sectionColors[section]} text-white shadow-lg`
                  : 'bg-white/5 text-secondary group-hover:bg-white/10 group-hover:text-white'
              }`}>
                <FontAwesomeIcon icon={sectionIcons[section]} className="text-sm" />
              </div>
              {!collapsed && (
                <span className="font-medium text-sm">{section}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-[#915EFF]/10 to-transparent rounded-xl p-4 border border-[#915EFF]/20">
            <p className="text-xs text-secondary">
              <span className="text-[#915EFF] font-semibold">Pro tip:</span> Changes sync to your live portfolio instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
