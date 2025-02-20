import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { Tilt } from "react-tilt";
import { styles } from "../../styles";
import { github } from "../../assets";
import { SectionWrapper } from "../../hoc";
import { fadeIn, textVariant } from "../../utils/motion";
import { handleFetchProjects } from "./handlers/projectSectionHandlers";
import { techColors } from "../../constants";

/* -------------------------- PROJECT CARD COMPONENT -------------------------- */
const ProjectCard = ({ index, project }) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={project.projectImage}
            alt={project.title}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <div
              onClick={() => window.open(project.githubURL, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt="source code"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{project.title}</h3>
          <p className="mt-2 text-secondary text-[14px]">
            {project.description}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.split(", ").map((tech) => (
            <p
              key={`${project.title}-${tech}`}
              className={`text-[14px] ${
                techColors[tech] || techColors.Default
              }`}
            >
              #{tech}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

/* --------------------------- MAIN WORKS COMPONENT --------------------------- */
const Works = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    handleFetchProjects(setProjects);
  }, []);

  // Filter by category
  const filteredProjects = projects.filter((project) =>
    selectedCategory === "all" ? true : project.category === selectedCategory
  );

  // Limit to 6
  const limitedProjects = filteredProjects.slice(0, 6);

  // Base classes for filter buttons
  const baseButtonClasses =
    "px-5 py-2 rounded-full font-semibold text-sm transition-colors duration-300";

  // Function to apply dynamic styling for each button
  const getButtonClasses = (category) => {
    const isActive = selectedCategory === category;
    if (isActive) {
      // ACTIVE button: gradient from darkPurple to obsidian, shadow, white text
      return `${baseButtonClasses} bg-gradient-to-r from-darkPurple to-obsidian text-white shadow-md hover:brightness-110`;
    } else {
      // INACTIVE button: darkBlue background, secondary text, hover shade
      return `${baseButtonClasses} bg-darkBlue text-secondary hover:bg-darkBlue/80`;
    }
  };

  return (
    <>
      {/* Heading */}
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>My work</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Projects.</h2>

      </motion.div>

      <motion.div variants={textVariant()}>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-4 mt-8">
          <button
            className={getButtonClasses("all")}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </button>
          <button
            className={getButtonClasses("quant")}
            onClick={() => setSelectedCategory("quant")}
          >
            Quant
          </button>
          <button
            className={getButtonClasses("swe")}
            onClick={() => setSelectedCategory("swe")}
          >
            SWE
          </button>
          {/* Add more categories if needed */}
        </div>  


      </motion.div>
     

      {/* Description */}
      <div className="w-full flex justify-center">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-center text-[17px] max-w-3xl leading-[30px]"
        >
          Following projects showcase my skills and experience through real-world
          examples of my work...
        </motion.p>
      </div>

      {/* Projects Grid */}
      <div className="mt-20 flex flex-wrap gap-7 justify-center">
        {limitedProjects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} project={project} />
        ))}
      </div>

      {/* Link to Full Archive */}
      <div className="mt-10 text-center">
        <Link
          to="/projects-archive"
          className="inline-block px-6 py-3 bg-gradient-to-r from-darkPurple to-obsidian text-white rounded-full font-semibold hover:brightness-110 transition-colors duration-300"
        >
          View Full Project Archive
        </Link>
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
