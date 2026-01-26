import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { textVariant } from '../../utils/motion';

const CATEGORIES = ['Athletics', 'Aesthetic', 'Life'];

// Preload a single image and return a promise
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
};

const categoryConfig = {
  All: {
    label: 'Curated',
    description: "A visual story of who I am — the grind, the style, and everything in between."
  },
  Athletics: {
    label: 'Athletics',
    description: "The discipline, the grind, and the love for the game. D3 Basketball at Union College."
  },
  Aesthetic: {
    label: 'Aesthetic',
    description: "Minimalism meets streetwear. Fashion as a form of creative expression."
  },
  Life: {
    label: 'Life',
    description: "Travel, experiences, and the little moments that fuel my creativity."
  }
};

// Shuffle array helper
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const BeyondCode = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchMoodBoard = async () => {
      try {
        const response = await axios.get('/api/moodboard');
        const fetchedItems = response.data;
        setItems(fetchedItems);
        
        // Preload all images in background (non-blocking)
        // This ensures instant switching between tabs
        fetchedItems.forEach(item => {
          if (item.imageUrl) {
            preloadImage(item.imageUrl);
          }
        });
          
      } catch (error) {
        console.error('Error fetching mood board:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodBoard();
  }, []);

  // Shuffle and filter items based on active tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'All') {
      // Curate 2-3 random items from each category
      const curated = [];
      CATEGORIES.forEach(cat => {
        const categoryItems = items.filter(item => item.category === cat);
        const shuffled = shuffleArray(categoryItems);
        const count = Math.min(shuffled.length, Math.floor(Math.random() * 2) + 2);
        curated.push(...shuffled.slice(0, count));
      });
      return shuffleArray(curated);
    }
    // For specific categories, shuffle all items in that category
    const categoryItems = items.filter(item => item.category === activeTab);
    return shuffleArray(categoryItems);
  }, [items, activeTab]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-[#915EFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const ImageCard = ({ item, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    if (!item) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -4 }}
        className="relative rounded-2xl overflow-hidden group bg-[#0a0a0f] w-full mb-4 border border-white/5 hover:border-white/10 transition-all duration-300"
        style={{ breakInside: 'avoid' }}
      >
        {/* Skeleton placeholder */}
        {!imageLoaded && (
          <div className="w-full aspect-[4/5] bg-white/5 animate-pulse" />
        )}
        
        <img 
          src={item.imageUrl} 
          alt={item.label}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-auto block transition-all duration-500 ease-out group-hover:scale-[1.02] ${
            imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
          }`}
        />
        
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Label on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <p className="text-white font-medium text-sm tracking-wide">{item.label}</p>
          <span className="text-[11px] text-white/50 uppercase tracking-widest font-medium mt-1 block">
            {item.category}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>Beyond The Code</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Mood Board</h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-secondary text-center text-[15px] max-w-2xl mx-auto mt-4 leading-relaxed"
      >
        Life isn't just about code. Here's a glimpse into what makes me, <span className="text-white font-medium">me</span>.
      </motion.p>

      <div className="mt-10 max-w-6xl mx-auto px-4">
        {/* Category Tabs - Sleek pill design */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'All'
                  ? 'bg-gradient-to-r from-[#915EFF] to-[#7a4ee6] text-white shadow-lg'
                  : 'text-secondary hover:text-white'
              }`}
            >
              Curated
            </button>
            {CATEGORIES.map((tab) => {
              const config = categoryConfig[tab];
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#915EFF] to-[#7a4ee6] text-white shadow-lg'
                      : 'text-secondary hover:text-white'
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description */}
        <motion.p
          key={`desc-${activeTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-secondary text-center text-[15px] max-w-xl mx-auto mb-10 leading-relaxed"
        >
          {categoryConfig[activeTab]?.description}
        </motion.p>

        {/* Pinterest-style Masonry Grid */}
        {filteredItems.length > 0 ? (
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="columns-1 sm:columns-2 lg:columns-3"
            style={{ columnGap: '16px' }}
          >
            {filteredItems.map((item, index) => (
              <ImageCard 
                key={item.publicId || `${item.imageUrl}-${index}`} 
                item={item} 
                index={index} 
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-secondary py-16">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-white/5 border border-white/10">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#915EFF] to-[#7a4ee6]" />
            </div>
            <p className="text-white/80 font-medium">No moments yet</p>
            <p className="text-sm mt-2 text-secondary/50">Check back soon</p>
          </div>
        )}
      </div>
    </>
  );
};

export default SectionWrapper(BeyondCode, 'moodboard');
