import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { fadeIn, textVariant } from '../../utils/motion';

const moodBoardData = {
  All: {
    description: "A collection of moments that define my journey—from the court to the creative process.",
    items: [
      { src: "/amazon_logo.jpg", size: "row-span-2 col-span-1", label: "Athlete" },
      { src: "/amazon_logo.jpg", size: "row-span-1 col-span-1", label: "Style" },
      { src: "/amazon_logo.jpg", size: "row-span-2 col-span-2", label: "Moments" },
      { src: "/amazon_logo.jpg", size: "row-span-1 col-span-1", label: "Vibe" },
      { src: "/amazon_logo.jpg", size: "row-span-1 col-span-1", label: "Court" },
      { src: "/amazon_logo.jpg", size: "row-span-2 col-span-1", label: "Aesthetic" },
    ]
  },
  Athlete: {
    description: "The discipline, the grind, and the love for the game. D3 Basketball at Union College.",
    items: [
      { src: "/amazon_logo.jpg", size: "row-span-2 col-span-2", label: "D3 Journey" },
      { src: "/amazon_logo.jpg", size: "row-span-1 col-span-1", label: "The Grind" },
      { src: "/amazon_logo.jpg", size: "row-span-1 col-span-1", label: "Game Day" },
    ]
  },
  Fashion: {
    description: "Exploring minimalism and streetwear as a form of creative expression.",
    items: [
      { src: "/amazon_logo.jpg", size: "row-span-2 col-span-1", label: "Minimalist" },
      { src: "/amazon_logo.jpg", size: "row-span-2 col-span-1", label: "Aesthetic" },
      { src: "/amazon_logo.jpg", size: "row-span-1 col-span-2", label: "Streetwear" },
    ]
  },
  Life: {
    description: "Travel, experiences, and the little moments in between that fuel my creativity.",
    items: [
      { src: "/amazon_logo.jpg", size: "row-span-1 col-span-1", label: "Travel" },
      { src: "/amazon_logo.jpg", size: "row-span-1 col-span-1", label: "Moments" },
      { src: "/amazon_logo.jpg", size: "row-span-2 col-span-2", label: "Lifestyle" },
    ]
  }
};

const BeyondCode = () => {
  const [activeTab, setActiveTab] = useState('All');

  const baseButtonClasses = "px-5 py-2 rounded-full font-semibold text-sm transition-colors duration-300";
  
  const getButtonClasses = (tab) => {
    const isActive = activeTab === tab;
    return isActive
      ? `${baseButtonClasses} bg-gradient-to-r from-darkPurple to-obsidian text-white shadow-md hover:brightness-110`
      : `${baseButtonClasses} bg-darkBlue text-secondary hover:bg-darkBlue/80`;
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>Curated Aesthetics</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Mood Board.</h2>
      </motion.div>

      <div className="mt-12 max-w-6xl mx-auto px-4">
        {/* Aesthetic Toggles */}
        <div className="flex justify-center flex-wrap gap-4 mb-6">
          {Object.keys(moodBoardData).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={getButtonClasses(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <motion.p
          key={`desc-${activeTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-secondary text-center text-[16px] max-w-2xl mx-auto mb-12 leading-[26px]"
        >
          {moodBoardData[activeTab].description}
        </motion.p>

        {/* Masonry Grid with Animation */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px]"
        >
          <AnimatePresence mode='popLayout'>
            {moodBoardData[activeTab].items.map((item, index) => (
              <motion.div
                key={`${activeTab}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -5 }}
                className={`${item.size} relative rounded-3xl overflow-hidden group shadow-xl`}
              >
                <img 
                  src={item.src} 
                  alt={item.label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-bold tracking-widest uppercase border border-white/20">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(BeyondCode, 'moodboard');
