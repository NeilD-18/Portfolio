import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const AddProjectModal = ({
  modalIsOpen,
  setModalIsOpen,
  handleProjectSubmit,
  handleUpdateProjectSubmit,
  projects,
  setProjects,
  newProject,
  setNewProject,
  handleFileChange,
}) => {
  const isEditing = Boolean(newProject.publicId); // Determine if it's edit mode

  // Function to reset the form fields
  const resetFormFields = () => {
    setNewProject({
      title: '',
      description: '',
      githubURL: "",
      techStack: '',
      projectImage: null,
      category: '', // Default category
      createdAt: null,
      publicId: null,
    });
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => {
        setModalIsOpen(false);
        resetFormFields(); // Reset fields on modal close
      }}
      className="bg-gray-800 p-6 rounded-lg max-w-lg mx-auto my-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <h3 className="text-2xl font-bold text-white mb-4">
        {isEditing ? 'Edit Project' : 'Add New Project'}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          isEditing
            ? handleUpdateProjectSubmit(e, newProject, setProjects)
            : handleProjectSubmit(e, newProject, setProjects);
          setModalIsOpen(false);
          resetFormFields();
        }}
        className="space-y-4"
      >
        {/* Project Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={newProject.title || ""}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
            required
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            name="description"
            placeholder="Project Description"
            value={newProject.description || ""}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
            rows="4"
            required
          />
        </div>

        {/* GitHub Link */}
        <div>
          <label className="block text-sm font-medium text-gray-300">GitHub Link</label>
          <input
            type="url"
            name="githubURL"
            placeholder="GitHub Repository URL"
            value={newProject.githubURL || ""}
            onChange={(e) => setNewProject({ ...newProject, githubURL: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Tech Stack</label>
          <input
            type="text"
            name="techStack"
            placeholder="e.g., React, Node.js, AWS"
            value={newProject.techStack || ""}
            onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
            required
          />
        </div>

        {/* Project Category Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Category</label>
          <select
            name="category"
            value={newProject.category}
            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
          >
            <option value="SWE">SWE</option>
            <option value="Quant">Quant</option>
            <option value="AI">AI</option>

          </select>
        </div>

        {/* Created At Date Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Project Date</label>
          <DatePicker
            selected={newProject.createdAt ? new Date(newProject.createdAt) : null}
            onChange={(date) => setNewProject({ ...newProject, createdAt: date })}
            dateFormat="MM/yyyy"  // Display only Month & Year
            showMonthYearPicker  // Enable Month-Year picker mode
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
          />
        </div>


        {/* Existing Project Image (for editing mode) */}
        {isEditing && newProject.projectImage && (
          <div>
            <label className="block text-sm font-medium text-gray-300">Current Project Image</label>
            <img
              src={typeof newProject.projectImage === 'string' ? newProject.projectImage : URL.createObjectURL(newProject.projectImage)}
              alt="Current Project"
              className="w-32 h-32 object-cover rounded-lg mb-4"
            />
          </div>
        )}

        {/* Project Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300">
            {isEditing ? 'Change Project Image' : 'Project Image'}
          </label>
          <input
            type="file"
            name="projectImage"
            onChange={(e) => handleFileChange(e, setNewProject)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
            required={!isEditing} // Required only in add mode
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-violet-700 text-white px-4 py-2 rounded-lg hover:bg-violet-800 transition duration-300"
        >
          {isEditing ? 'Update Project' : 'Add Project'}
        </button>
      </form>
    </Modal>
  );
};

export default AddProjectModal;
