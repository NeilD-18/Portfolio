import React, { useState, useRef } from 'react'; 
import { Link } from 'react-router-dom'; 
import { styles } from '../../styles'; 
import { navLinks } from '../../constants';
import { menu, close } from '../../assets';
import Logo from "./Logo"; 
import DropdownItem from './DropdownItem';

const Navbar = () => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const menuRef = useRef();

  
  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}>
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to="/"
          className='flex items-center gap-2'
          onClick={() => { 
            setActive("");
            window.scrollTo(0,0);
          }}
        >
          <Logo/>
        </Link>
        <ul className='list-none hidden sm:flex flex-row gap-10'>
          {navLinks.map(link => (  
            <li 
              key={link.id}
              className={`${active === link.title ? "text-white" : "text-secondary"} hover:text-white cursor-pointer text-[15px]`}
              onClick={() => setActive(link.title)}
            >
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>
        <div className='sm:hidden flex flex-1 justify-end items-center'>
          
          <div className='menu-container' ref={menuRef} >
            <div className='menu-trigger flex items-center gap-2' onClick={() => setToggle(!toggle)}>
              <img
              src={toggle ? close : menu}
              alt="menu"
              className='w-[28px] h-[28px] object-contain cursor-pointer'
              />
            </div>
            <div className={`dropdown-menu ${toggle ? 'active' : 'inactive'} dropdown-menu-left`}>
              <ul className='text-secondary'>
                {navLinks.map(link => (
                      <DropdownItem 
                        text={link.title} 
                        onClick={() => {
                          setActive(link.title);
                          setToggle(!toggle)
                        }} 
                        path={`#${link.id}`}
                      />
                    ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
