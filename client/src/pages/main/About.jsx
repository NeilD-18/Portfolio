import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import axios from 'axios';
import { styles } from '../../styles';
import { fadeIn, textVariant } from '../../utils/motion';
import { SectionWrapper } from '../../hoc';

const aboutImageDescriptions = [
  "Neil Daterao - Professional photo",
  "Neil Daterao - At work",
  "Neil Daterao - Personal interests",
  "Neil Daterao - Activities and hobbies"
];

const ServiceCard = ({ index, image }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <Tilt className="xs:w-[250px] w-full">
      <motion.div
        variants={fadeIn('right', 'spring', index * 0.5, 0.75)}
        className="w-full h-[280px] p-[1px] rounded-[20px] shadow-card overflow-hidden"
      >
        <div
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className="bg-tertiary rounded-[20px] w-full h-full overflow-hidden relative"
        >
          {/* Skeleton placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-white/5 animate-pulse rounded-[20px]" />
          )}
          
          <img
            src={image}
            alt={aboutImageDescriptions[index] || `About Neil Daterao - Image ${index + 1}`}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </motion.div>
    </Tilt>
  );
};

const About = () => {
  // State to hold the bio content and service images
  const [bio, setBio] = useState('');
  const [images, setImages] = useState([null, null, null, null]); 


  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // Fetch bio
        const bioResponse = await axios.get('/api/about');
        setBio(bioResponse.data.about);

        // Fetch images
        const imageResponse = await axios.get('/api/about/images');
        const fetchedImages = imageResponse.data.images || [null, null, null, null];
        
        // Preload images in background for faster rendering
        fetchedImages.forEach((src) => {
          if (src) {
            const img = new Image();
            img.src = src;
          }
        });
        
        setImages(fetchedImages); 
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData(); 
  }, []);

  return (
    <>
      <motion.div variants={textVariant()} className="flex flex-col items-center">
        <p className={styles.sectionSubText}>A little bit</p>
        <h2 className={styles.sectionHeadText}>About Me</h2>

        <motion.p
          variants={fadeIn('', '', 0.1, 1)}
          className="mt-4 text-secondary text-[17px] text-center max-w-3xl leading-[30px]"
        >
          {bio} {/* Dynamically render the fetched bio */}
        </motion.p>
      </motion.div>

      <div className="mt-20 flex flex-wrap gap-10 justify-center">
        {images.map((image, index) => (
          image ? (
            <ServiceCard key={`service-${index}`} index={index} image={image} />
          ) : (
            <div
              key={`empty-${index}`}
              className="w-[250px] h-[280px] bg-gray-800 border-2 border-dashed border-gray-600 flex justify-center items-center rounded-[20px]"
            >
              <span className="text-gray-400 text-xl">No Image</span>
            </div>
          )
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, 'about');
