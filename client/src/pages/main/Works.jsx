import React from "react";
import { Tilt } from 'react-tilt'
import { motion } from "framer-motion";

import { styles } from '../../styles';
import { github } from "../../assets";
import { SectionWrapper } from '../../hoc';
import { fadeIn, textVariant } from '../../utils/motion';
import { handleFetchProjects } from "./handlers/projectSectionHandlers";
import { useState, useEffect } from "react";
import { techColors } from "../../constants";






const ProjectCard = ({ index, project }) => {

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[230px]">
          <img src={project.projectImage} alt={project.title} className="w-full h-full object-cover rounded-2xl" />

          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <div
              onClick={() => window.open(project.githubURL, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img src={github} alt="source code" className="w-1/2 h-1/2 object-contain" />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{project.title}</h3>
          <p className="mt-2 text-secondary text-[14px]">{project.description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.split(", ").map((tech) => (
            <p key={`${project.title}-${tech}`} className={`text-[14px] 
      ${techColors[tech] || techColors.Default}`}>
              #{tech}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  
  const [projects, setProjects] = useState([])

  useEffect(() => { 
    handleFetchProjects(setProjects)
  }, []);
  
  
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>My work</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Projects.</h2>
      </motion.div>

      <div className="w-full flex justify-center">
        <motion.p variants={fadeIn("", "", 0.1, 1)} className="mt-3 text-secondary text-center text-[17px] max-w-3xl leading-[30px]">
          Following projects showcase my skills and experience through real-world examples of my work. Each project is
          briefly described with links to code repositories and live demos in it. It reflects my ability to solve
          complex problems, work with different technologies, and manage projects effectively.
        </motion.p>
      </div>

      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} project={project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "works");
