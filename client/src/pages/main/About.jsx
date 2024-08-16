import React from 'react'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'

import { styles } from '../../styles'
import { services } from '../../constants'
import { fadeIn,textVariant } from '../../utils/motion'

const About = () => {
  return (
    <>  
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>A little bit</p>
        <h2 className={styles.sectionHeadText}>About Me</h2>
      </motion.div>
      <motion.div variants></motion.div>
      <motion.p 
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          This is a place holder text lepsum potrenum lepsum potrenum lepsum potrenum lepsum potrenum lepsum potrenum lepsum potrenum lepsum potrenum lepsum potrenum lepsum potrenum 
        </motion.p>

        <div></div>
    </>
  )
}

export default About