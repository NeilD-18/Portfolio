import React, { useState, useEffect, useRef } from 'react';
import { neil_logo, user } from '../../assets';
import { Link } from 'react-router-dom';
import DropdownItem from './DropdownItem';

const Logo = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();


    useEffect(() => {
        const handler = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => {
            document.removeEventListener("mousedown", handler);
        };
    }, []);

    return (
        <div className='menu-container' ref={menuRef}>
            <div className='menu-trigger flex items-center gap-2' onClick={() => setOpen(!open)}>
                <img
                    src={neil_logo}
                    alt="logo"
                    className='w-9 h-9 object-contain'
                />
                <p className='text-white text-[18px] font-bold cursor-pointer flex'>
                    Neil &nbsp;<span className="sm:block hidden">Daterao</span>
                </p>
            </div>
            <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
                <ul className='text-secondary'>
                    <DropdownItem img={user} text="Portal" onClick={setOpen} path="/login" />
                </ul>
            </div>
        </div>
    );
};


export default Logo