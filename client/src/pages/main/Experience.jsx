import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import { styles } from "../../styles";
import { SectionWrapper } from "../../hoc";
import { textVariant } from "../../utils/motion";
import { useState, useEffect } from "react";
import { handleFetchExperiences } from "./handlers/experienceSectionHandlers";
import { format } from 'date-fns'


const ExperienceCard = ({ experience, index }) => {
  // Adjust dates to fix the month issue
  const adjustedStartDate = new Date(
    new Date(experience.dateRange.startDate).getFullYear(),
    new Date(experience.dateRange.startDate).getMonth() + 1, 
    1 // Set the day to 1 to avoid overflow
  );

  const adjustedEndDate = new Date(
    new Date(experience.dateRange.endDate).getFullYear(),
    new Date(experience.dateRange.endDate).getMonth() + 1, 
    1 // Set the day to 1 to avoid overflow
  );

  const formattedDate = `${format(adjustedStartDate, 'MMM yyyy')} - ${format(adjustedEndDate, 'MMM yyyy')}`;

  return (
    <VerticalTimelineElement
      contentStyle={{
        background: "#1d1836",
        color: "#fff",
      }}
      contentArrowStyle={{ borderRight: "7px solid  #232631" }}
      date={formattedDate}
      iconStyle={{
        background: index % 2 === 0 ? "#E6DEDD" : "#383E56",
      }}
      icon={
        <div className='flex justify-center items-center w-full h-full overflow-hidden rounded-full'>
          <img
            src={experience.companyPicture}
            alt={experience.companyName}
            className='w-full h-full object-cover'
          />
        </div>
      }
    >
      <div>
        <h3 className='text-white text-[24px] font-bold'>{experience.role}</h3>
        <p
          className='text-secondary text-[16px] font-semibold'
          style={{ margin: 0 }}
        >
          {experience.companyName}
        </p>
      </div>

      <ul className='mt-5 list-disc ml-5 space-y-2'>
        {experience.responsibilities.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className='text-white-100 text-[14px] pl-1 tracking-wider'
          >
            {point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};

const Experience = () => {
  
  const [experiences, setExperiences] = useState([])
  
  useEffect(() => { 
    handleFetchExperiences(setExperiences)
  }, []); 

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          What I have done so far
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          Work Experience
        </h2>
      </motion.div>

      <div className='mt-20 flex flex-col'>
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={`experience-${index}`}
              experience={experience}
              index = {index}
            />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");