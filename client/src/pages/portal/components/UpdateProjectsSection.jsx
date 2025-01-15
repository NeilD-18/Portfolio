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
  const [projects, setProjects] = useState([
    {
      title: "Personal Portfolio",
      description: "My personal portfolio",
      githubLink: "https://github.com/NeilD-18/Portfolio",
      techStack: "React, Node.js, Express, MongoDB, AWS",
      projectImage: "/Neil_Logo.svg",
      publicId: null,
    },  {
      title: "Personal Portfolio",
      description: "My personal portfolio",
      githubLink: "https://github.com/NeilD-18/Portfolio",
      techStack: "React, Node.js, Express, MongoDB, AWS",
      projectImage: "/Neil_Logo.svg",
      publicId: null,
    }, {
      title: "Personal Portfolio",
      description: "My personal portfolio",
      githubLink: "https://github.com/NeilD-18/Portfolio",
      techStack: "React, Node.js, Express, MongoDB, AWS",
      projectImage: "/Neil_Logo.svg",
      publicId: null,
    }, {
      title: "Personal Portfolio",
      description: "My personal portfolio",
      githubLink: "https://github.com/NeilD-18/Portfolio",
      techStack: "React, Node.js, Express, MongoDB, AWS",
      projectImage: "/Neil_Logo.svg",
      publicId: null,
    }
  ]);
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
      <h2 className="text-4xl font-bold text-white mb-8 text-center">
        Projects
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length === 0 && (
          <p className="text-white text-center col-span-full">
            No projects added yet. Click "+" to add a new project.
          </p>
        )}

        {projects.map((project) => (
          <div
            className="p-6 bg-gray-800 text-white border border-gray-700 rounded-xl shadow-md flex flex-col"
            key={project.publicId}
          >
            {/* Image Preview */}
            <div className="w-full h-[200px] bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              {project.projectImage ? (
                <img
                  src={project.projectImage || "/default-project.png"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  No image uploaded
                </span>
              )}
            </div>

            {/* Project Details */}
            <h3 className="text-2xl font-semibold mt-4">{project.title}</h3>
            <p className="text-gray-400 mt-2">{project.description}</p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mt-3">
              {project.techStack.split(", ").map((tech, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                    techColors[tech] || techColors.Default
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={faGithub} size="lg" />
                </a>
              )}
              <div className="flex space-x-4">
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
        ))}
      </div>

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
