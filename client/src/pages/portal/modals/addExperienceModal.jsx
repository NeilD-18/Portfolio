import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AddExperienceModal = ({ 
    modalIsOpen, 
    setModalIsOpen, 
    handleExperienceSubmit, 
    handleUpdateExperienceSubmit,
    experiences, 
    setExperiences, 
    newExperience, 
    setNewExperience, 
    handleFileChange 
}) => {

    const isEditing = Boolean(newExperience.publicId); // Determine if it's edit mode

    // Function to reset the form fields
    const resetFormFields = () => {
        setNewExperience({
            companyName: '', 
            role: '',
            responsibilities: '',
            startDate: null,
            endDate: null,
            companyPicture: null,
            publicId: null
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
                {isEditing ? "Edit Experience" : "Add New Experience"}
            </h3>
            <form 
                onSubmit={(e) => {
                    e.preventDefault(); 
                    
                
                    isEditing
                        ? handleUpdateExperienceSubmit(e, newExperience.publicId, newExperience, setExperiences, experiences, setModalIsOpen)
                        : handleExperienceSubmit(e, newExperience, setExperiences, experiences, setModalIsOpen);
                    
                    resetFormFields();
                }}
                className="space-y-4"
            >
                
                <div>
                    <label className="block text-sm font-medium text-gray-300">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        value={newExperience.companyName}
                        onChange={(e) => setNewExperience({ ...newExperience, companyName: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                        required
                    />
                </div>
                
                
                    
                <div>
                    <label className="block text-sm font-medium text-gray-300">Role</label>
                    <input
                        type="text"
                        name="role"
                        placeholder="Role"
                        value={newExperience.role}
                        onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Responsibilities</label>
                    <textarea
                        name="responsibilities"
                        placeholder="Responsibilities"
                        value={newExperience.responsibilities}
                        onChange={(e) => setNewExperience({ ...newExperience, responsibilities: e.target.value })}
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Start Date</label>
                    <DatePicker
                        selected={newExperience.startDate}
                        onChange={(date) => setNewExperience({ ...newExperience, startDate: date })}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">End Date</label>
                    <DatePicker
                        selected={newExperience.endDate}
                        onChange={(date) => setNewExperience({ ...newExperience, endDate: date })}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                        required
                    />
                </div>

                {isEditing && newExperience.companyPicture && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Current Company Picture</label>
                        <img 
                            src={newExperience.companyPicture} 
                            alt="Current Company" 
                            className="w-32 h-32 object-cover rounded-lg mb-4" 
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        {isEditing ? "Change Company Picture" : "Company Picture"}
                    </label>
                    <input
                        type="file"
                        name="companyPicture"
                        onChange={(e) => handleFileChange(e, newExperience, setNewExperience)}
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                        required={!isEditing} // Make file required only when adding a new experience
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-violet-700 text-white px-4 py-2 rounded-lg hover:bg-violet-800 transition duration-300"
                >
                    {isEditing ? "Update Experience" : "Add Experience"}
                </button>
            </form>
        </Modal>
    );
}

export default AddExperienceModal;
