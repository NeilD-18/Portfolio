import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes, faFilePdf, faUpload } from "@fortawesome/free-solid-svg-icons";
import { socialPlatforms } from "../../../constants";
import { handleFetchContactData, handleSave, handleResumeUpload, handleCancel, handleEditClick } from "../handlers/contactSectionHandlers";


const ContactSection = () => {
  const [socialLinks, setSocialLinks] = useState({});
  const [editing, setEditing] = useState(null);
  const [tempUsername, setTempUsername] = useState("");
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeName, setResumeName] = useState(""); // Stores the current resume filename
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Contact Data
  useEffect(() => {
    handleFetchContactData(setSocialLinks, setResumeUrl, setResumeName, socialPlatforms);
  }, [resumeUrl]); 
  // Extract username from full URL
  const extractUsername = (url, platform) => {
    const base = socialPlatforms[platform].baseUrl;
    return url.startsWith(base) ? url.replace(base, "") : "";
  };

  const handleInputChange = (e) => {
    setTempUsername(e.target.value);
  };

  const handleResumeSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-white mb-6">Contact & Resume</h2>

      {/* Social Media Links Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(socialPlatforms).map(([key, { baseUrl, icon, label, color }]) => (
          <div key={key} className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
            <FontAwesomeIcon icon={icon} size="lg" className={`${color} mr-4`} />
            {editing === key ? (
              <div className="flex w-full items-center">
                <span className="text-gray-400">{baseUrl}</span>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white px-2 py-1 rounded-md outline-none border border-gray-600 w-full ml-1"
                />
              </div>
            ) : (
              <a href={socialLinks[key]} target="_blank" rel="noopener noreferrer" className="text-white truncate hover:underline">
                {socialLinks[key]}
              </a>
            )}
            {editing === key ? (
              <div className="flex ml-3 space-x-2">
                <button onClick={() => handleSave(key, setSocialLinks, setEditing, socialPlatforms, tempUsername)} className="text-green-400 hover:text-green-500">
                  <FontAwesomeIcon icon={faSave} />
                </button>
                <button onClick={() => handleCancel(setEditing)} className="text-red-400 hover:text-red-500">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ) : (
              <button onClick={() => handleEditClick(key, setEditing, setTempUsername, extractUsername, socialLinks)} className="ml-3 text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faEdit} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Resume Upload & Preview */}
      <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
        <h3 className="text-2xl font-semibold text-white mb-4">Resume</h3>

        {resumeUrl ? (
          <div className="flex flex-col space-y-4">
            {/* Display Uploaded Resume */}
            <div className="flex items-center justify-between p-4 bg-gray-700 border border-gray-600 rounded-lg">
              <FontAwesomeIcon icon={faFilePdf} size="lg" className="text-red-500" />
              <span className="text-white truncate">{resumeName}</span>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition "
              >
                View Resume
              </a>
            </div>

            {/* Custom File Input Button */}
            <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition">
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Select New Resume
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeSelection}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <button
                onClick={() => handleResumeUpload(selectedFile, setLoading, setResumeUrl, setResumeName, setSelectedFile)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                {loading ? "Uploading..." : "Update Resume"}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {/* Custom Upload Button for First Time Upload */}
            <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition">
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Upload Resume
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeSelection}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <button
                onClick={() => handleResumeUpload(selectedFile, setLoading, setResumeUrl, setResumeName, setSelectedFile)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                {loading ? "Uploading..." : "Upload Resume"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSection;
