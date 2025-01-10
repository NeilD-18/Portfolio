import React from 'react'
import { motion } from 'framer-motion'
import { Tilt } from 'react-tilt'


import { useState, useEffect } from 'react'
import axios from 'axios'
import { styles } from '../../styles'
import { fadeIn,textVariant } from '../../utils/motion'
import { SectionWrapper } from '../../hoc'

const services = [
  {
    image: '/linkedin_headshot.jpg', // Replace with actual image path
  },
  {
    image: '/Neil_Logo.svg', // Replace with actual image path
  },
  {
    image: '/Neil_Logo.svg', // Replace with actual image path
  },
  {
    image: '/Neil_Logo.svg', // Replace with actual image path
  },
];



const ServiceCard = ({ index, image }) => (
  <Tilt className="xs:w-[250px] w-full">
    <motion.div
      variants={fadeIn('right', 'spring', index * 0.5, 0.75)}
      className="w-full h-[280px] green-pink-gradient p-[1px] rounded-[20px] shadow-card overflow-hidden"
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary rounded-[20px] w-full h-full overflow-hidden"
      >
        <img
          src={image}
          alt={`service-${index}`}
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  </Tilt>
);





















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
      <motion.div variants={textVariant()} className="flex flex-col items-center">
        <p className={styles.sectionSubText}>A little bit</p>
        <h2 className={styles.sectionHeadText}>About Me.</h2>

        <motion.p
      variants={fadeIn("", "", 0.1, 1)}
      className="mt-4 text-secondary text-[17px] text-center max-w-3xl leading-[30px]"
    >
      {bio} {/* Dynamically render the fetched bio */}
    </motion.p>
      </motion.div>

      
      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>

    </>
  );
};


export default SectionWrapper(About, 'about')