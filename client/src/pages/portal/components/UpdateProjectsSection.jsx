import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddProjectModal from "../modals/addProjectModal";
import { fetchProjects, handleProjectSubmit, handleDeleteProject, handleUpdateProject, handleFileChange, handleUpdateProjectSubmit } from "../handlers/projectsSectionHandlers";

const Projects = () => {
  const [projects, setProjects] = useState([{
    title: "Personal Portfolio",
    description: "My personal portfolio",
    githubLink: "https://github.com/NeilD-18/Portfolio",
    techStack: "React, Node.js, Express, MongoDB, AWS",
    projectImage: "/Neil_Logo.svg",
    publicId: null,
  }]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    githubLink: "",
    techStack: "",
    projectImage: null,
    publicId: null,
  });

  // Fetch existing projects
  useEffect(() => {
    fetchProjects(setProjects);
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-6">Projects</h2>
      {projects.length === 0 && (
        <p className="text-white">No projects added yet. Click "+" to add a new project.</p>
      )}

      {projects.map((project) => (
        <div
          className="p-6 bg-gray-800 text-white border border-gray-700 rounded-xl mb-4 shadow-lg"
          key={project.publicId}
        >
          <div className="flex items-center space-x-4">
            <img
              src={project.projectImage || "/default-project.png"} // Default image fallback
              alt={project.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-gray-400">{project.description}</p>
              <p className="text-sm text-violet-400">
                Tech Stack: {project.techStack || "N/A"}
              </p>
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View GitHub Repo
                </a>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleUpdateProject(project.publicId, projects, setNewProject, setModalIsOpen)}
                className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => handleDeleteProject(project.publicId, setProjects, projects)}
                className="text-red-500 hover:text-red-700 transition duration-300"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => setModalIsOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-violet-700 text-white rounded-full text-3xl font-bold flex items-center justify-center hover:bg-violet-800 transition duration-300"
      >
        +
      </button>

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
