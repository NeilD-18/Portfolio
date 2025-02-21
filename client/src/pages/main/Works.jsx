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
  // Temporarily render without motion and Tilt for debugging
  return (
    <div className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full">
      <div className="relative w-full h-[230px]">
        <img
          src={project.projectImage}
          alt={project.title}
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute inset-0 flex justify-end m-3">
          <div
            onClick={() => window.open(project.githubURL, "_blank")}
            className="w-10 h-10 rounded-full flex justify-center items-center cursor-pointer bg-black bg-opacity-50"
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
            className={`text-[14px] ${techColors[tech] || techColors.Default}`}
          >
            #{tech}
          </p>
        ))}
      </div>
    </div>
  );
};

/* --------------------------- MAIN WORKS COMPONENT --------------------------- */
const Works = () => {
  const [projects, setProjects] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState("featured");
  const [filteredProjects, setFilteredProjects] = useState([]); 

  useEffect(() => {
    handleFetchProjects(setProjects);
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    let updatedProjects = projects.filter((project) =>
      selectedCategory === "featured"
        ? project.pinned === true
        : project.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
    
    // For non-featured categories, sort by createdAt date (newest first)
  if (selectedCategory !== "featured") {
    updatedProjects = updatedProjects.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
    setFilteredProjects(updatedProjects);
  }, [selectedCategory, projects]);

  const limitedProjects = filteredProjects.slice(0, 6);

  const baseButtonClasses =
    "px-5 py-2 rounded-full font-semibold text-sm transition-colors duration-300";

  const getButtonClasses = (category) => {
    const isActive = selectedCategory === category.toLowerCase();
    return isActive
      ? `${baseButtonClasses} bg-gradient-to-r from-darkPurple to-obsidian text-white shadow-md hover:brightness-110`
      : `${baseButtonClasses} bg-darkBlue text-secondary hover:bg-darkBlue/80`;
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
            className={getButtonClasses("featured")}
            onClick={() => setSelectedCategory("featured")}
          >
            Featured
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
          <button
            className={getButtonClasses("ai")}
            onClick={() => setSelectedCategory("ai")}
          >
            AI
          </button>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        key={selectedCategory} // Force re-mount on category change
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="mt-20 flex flex-wrap gap-7 justify-center"
      >
        {limitedProjects.length > 0 ? (
          limitedProjects.map((project, index) => (
            <ProjectCard
              key={`${selectedCategory}-project-${index}`}
              index={index}
              project={project}
            />
          ))
        ) : (
          <p className="text-secondary text-center mt-4">
            No projects available in this category.
          </p>
        )}
      </motion.div>

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
