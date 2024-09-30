import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { handleAboutTextUpdate, handleFetchAboutText } from "../handlers/aboutSectionHandlers";

const AboutSection = ({ }) => {
  const [aboutText, setAboutText] = useState('');
  const [newAboutText, setNewAboutText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    handleFetchAboutText(setAboutText)
}, []);

  const handleEditClick = () => {
    setIsEditing(true);
    setNewAboutText(aboutText); // Initialize the textarea with the current about text
  };

  const handleSaveClick = () => {
    handleAboutTextUpdate(newAboutText, setAboutText);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewAboutText(''); // Clear the textarea when cancelling
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-white">About Section</h2>
        {!isEditing && (
          <button onClick={handleEditClick} className="text-gray-400 hover:text-white transition duration-300">
            <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={newAboutText}
            onChange={(e) => setNewAboutText(e.target.value)}
            className="w-full p-4 bg-gray-800 text-white border border-gray-600 rounded-lg mb-4"
            placeholder="Update About text..."
            rows="5"
          ></textarea>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveClick}
              className="bg-violet-700 text-white px-6 py-3 rounded-lg hover:bg-violet-800 transition duration-300"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-300 mb-6">{aboutText}</p>
      )}
    </div>
  );
};

export default AboutSection;
