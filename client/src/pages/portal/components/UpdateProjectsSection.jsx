import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import AddProjectModal from "../modals/addProjectModal";
import {
  fetchProjects,
  handleProjectSubmit,
  handleDeleteProject,
  handleUpdateProject,
  handleFileChange,
  handleUpdateProjectSubmit,
} from "../handlers/projectsSectionHandlers";

const techColors = {
  React: "bg-blue-600",
  "Node.js": "bg-green-600",
  Express: "bg-gray-600",
  MongoDB: "bg-emerald-600",
  AWS: "bg-yellow-600",
  PostgreSQL: "bg-teal-600",
  TailwindCSS: "bg-sky-600",
  Python: "bg-indigo-600",
  Default: "bg-purple-700",
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    githubURL: "",
    techStack: "",
    projectImage: null,
    publicId: null,
  });

  // Fetch existing projects on mount
  useEffect(() => {
    fetchProjects(setProjects);
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6">Projects</h2>

      {/* Grid Layout with Minimal Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.length === 0 ? (
          <p className="text-white text-center col-span-full">
            No projects added yet. Click "+" to add a new project.
          </p>
        ) : (
          projects.map((project) => (
            <div
              className="p-6 bg-gray-800 text-white border border-gray-700 rounded-2xl shadow-md flex flex-col w-full"
              key={project.publicId}
            >
              {/* Image Preview with Updated Dimensions */}
              <div className="relative w-full h-[230px] bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
                {project.projectImage ? (
                  <img src={project.projectImage} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm text-gray-400">No image uploaded</span>
                )}
              </div>

              {/* Project Details */}
              <h3 className="text-2xl font-semibold mt-4">{project.title}</h3>
              <p className="text-gray-400 mt-2">{project.description}</p>

              {/* Tech Stack Bubbles */}
              <div className="flex flex-wrap gap-1 mt-3">
                {project.techStack.split(", ").map((tech, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                      techColors[tech] || techColors.Default
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mt-4">
                {project.githubURL && (
                  <a
                    href={project.githubURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faGithub} size="lg" />
                  </a>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      handleUpdateProject(
                        project.publicId,
                        projects,
                        setNewProject,
                        setModalIsOpen
                      )
                    }
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteProject(project.publicId, setProjects, projects)
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Project Button */}
      <button
        onClick={() => setModalIsOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-violet-700 text-white rounded-full text-3xl font-bold flex items-center justify-center hover:bg-violet-800 transition duration-300"
      >
        +
      </button>

      {/* Add/Edit Project Modal */}
      <AddProjectModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        handleProjectSubmit={handleProjectSubmit}
        handleUpdateProjectSubmit={handleUpdateProjectSubmit}
        projects={projects}
        setProjects={setProjects}
        newProject={newProject}
        setNewProject={setNewProject}
        handleFileChange={handleFileChange}
      />
    </div>
  );
};

export default Projects;
