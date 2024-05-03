import React from 'react';

const Dropdown = () => {
  return (
    <div className="bg-white text-black p-4 border border-gray-300 absolute mt-2 rounded shadow-lg transition-all duration-300 ease-in-out">
      <ul>
        <li className="cursor-pointer">Portal Login</li>
        <li className="cursor-pointer">Register</li>
        <li className="cursor-pointer">Help</li>
      </ul>
    </div>
  );
};

export default Dropdown;
