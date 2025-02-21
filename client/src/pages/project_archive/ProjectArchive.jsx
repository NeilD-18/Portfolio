import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";
import { handleFetchProjects } from "../main/handlers/projectSectionHandlers";
import { ProjectCard } from "../main/Works";
import { Link } from "react-router-dom";

const PAGE_SIZE = 9;

const ProjectArchive = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    handleFetchProjects(setProjects);
  }, []);

  // ✅ Pagination Logic
  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6 flex flex-col items-center">
      {/* Navigation Back to Home */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-6xl flex justify-between items-center mb-6"
      >
        <h2 className="text-4xl font-bold text-white tracking-wide bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Project Archive
        </h2>
        <Link
          to="/"
          className="text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2 rounded-lg font-medium shadow-md hover:scale-105 transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-3 text-gray-400 text-center text-lg max-w-3xl mx-auto leading-[28px]"
      >
        A complete archive of all the projects I've worked on, showcasing my expertise in software engineering, quantitative finance, and AI development.
      </motion.p>

      {/* Projects Grid */}
      <motion.div
        variants={fadeIn("", "", 0.2, 1)}
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
      >
        {paginatedProjects.length > 0 ? (
          paginatedProjects.map((project, index) => (
            <motion.div
              key={`archive-project-${index}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard index={index} project={project} />
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-4">No projects found.</p>
        )}
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10 flex justify-center items-center space-x-2"
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2 rounded-full font-medium text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50 transition duration-300"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${
                currentPage === index + 1
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md hover:scale-110"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-5 py-2 rounded-full font-medium text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50 transition duration-300"
          >
            Next
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectArchive;
