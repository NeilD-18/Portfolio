import React from "react"


const AboutSection = ({aboutText, newAboutText, setNewAboutText, handleAboutTextUpdate}) => { 
    
  
  return (
    
    <div className="p-4">
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">About Section</h2>
            <p className="text-gray-400 mb-4">{aboutText}</p>
            <textarea
              value={newAboutText}
              onChange={(e) => setNewAboutText(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-xl mb-2"
              placeholder="Update About text..."
            ></textarea>
            <button
              onClick={handleAboutTextUpdate}
              className="bg-violet-700 text-white px-4 py-2 rounded-xl hover:bg-violet-800 transition-colors duration-300"
            >
              Update About Text
            </button>
          </div>
    )
}

export default AboutSection