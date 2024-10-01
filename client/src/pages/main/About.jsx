import React from 'react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { styles } from '../../styles'
import { fadeIn,textVariant } from '../../utils/motion'
import { SectionWrapper } from '../../hoc'

const About = () => {
  
  
  // State to hold the bio content
  const [bio, setBio] = useState('');

  // Fetch the bio from the server when the component mounts
  useEffect(() => {
    const fetchBio = async () => {
      try {
        const response = await axios.get('/about');
        setBio(response.data.about); 
      } catch (error) {
        console.error('Error fetching the bio:', error);
      }
    };

    fetchBio(); // Call the function to fetch the bio
  }, []); // Empty dependency arr
  
  
  
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
         {bio} {/* Dynamically render the fetched bio */}
      </motion.p>

    </>
  );
};


export default SectionWrapper(About, 'about')