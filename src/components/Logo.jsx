import React from 'react';
import { neil_logo } from '../assets'; // Ensure proper import

const Logo = () => {
  return (
    <div className='flex items-center gap-2'>
      <img src={neil_logo} alt="logo" className='w-9 h-9 object-contain' />
      <p className='text-white text-[18px] font-bold cursor-pointer flex '>
        Neil &nbsp;
        <span className="sm:block hidden">Daterao</span>
      </p>
    </div>
  );
};

export default Logo;
