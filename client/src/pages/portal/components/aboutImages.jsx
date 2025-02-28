import React, { useState, useEffect } from "react";
import axios from "axios";
import { handleFetchAboutImages, handleSquareClick } from "../handlers/aboutSectionHandlers";


const AboutImagesComponent = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch
 
  useEffect(() => {
    handleFetchAboutImages(setImages); 
  }, [refresh]); 


  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">About Images</h2>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleSquareClick(index, setRefresh)}
            className={`w-64 h-64 flex items-center justify-center rounded-lg transition duration-300 cursor-pointer ${
              image ? "bg-gray-800" : "bg-gray-800 border-2 border-dashed border-gray-600 hover:bg-gray-700"
            }`}
          >
            {image ? (
              <img
                src={image}
                alt={`Uploaded ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-400 text-2xl font-bold">+</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutImagesComponent;
