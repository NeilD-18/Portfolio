import React, { useState, useRef, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { motion, useScroll, useTransform } from 'framer-motion';
import { styles } from '../../styles'; 
import { navLinks } from '../../constants';
import { menu, close } from '../../assets';
import Logo from "./Logo"; 
import DropdownItem from './DropdownItem';
import { getResume } from './handlers/navbarHandlers';

const Navbar = () => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef();

  // Fetch resume URL from backend
  useEffect(() => {
    getResume(setResumeUrl);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden sm:block">
        {/* Full width navbar - fades out */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ 
            y: 0,
            opacity: scrolled ? 0 : 1,
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ pointerEvents: scrolled ? 'none' : 'auto' }}
          className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 left-0 right-0 z-50`}
        >
          <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
            <Link
              to="/"
              className='flex items-center gap-2'
              onClick={() => { 
                setActive("");
                window.scrollTo(0,0);
              }}
            >
              <Logo />
            </Link>
            
            <ul className='list-none flex flex-row gap-10'>
              {navLinks.map(link => (  
                <li 
                  key={link.id}
                  className={`${active === link.title ? "text-white" : "text-secondary"} hover:text-white cursor-pointer text-[15px] transition-colors duration-200`}
                  onClick={() => setActive(link.title)}
                >
                  <a href={`#${link.id}`}>{link.title}</a>
                </li>
              ))}
              {resumeUrl && (
                <li className="text-secondary hover:text-white cursor-pointer text-[15px] transition-colors duration-200">
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    Resume
                  </a>
                </li>
              )}
            </ul>
          </div>
        </motion.nav>

        {/* Floating pill navbar - fades in */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: scrolled ? 0 : -20,
            opacity: scrolled ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ pointerEvents: scrolled ? 'auto' : 'none' }}
          className="fixed top-4 left-0 right-0 flex justify-center px-4 z-50"
        >
          <nav className="flex items-center gap-1 px-3 py-2 bg-[#1a1a2e]/95 backdrop-blur-lg rounded-full border border-white/10 shadow-2xl shadow-black/50">
            {/* Logo */}
            <Link
              to="/"
              className='flex items-center px-3 py-2 rounded-full hover:bg-white/5 transition-colors duration-200'
              onClick={() => { 
                setActive("");
                window.scrollTo(0,0);
              }}
            >
              <Logo />
            </Link>

            {/* Nav Links */}
            {navLinks.map(link => (  
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setActive(link.title)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-200 ${
                  active === link.title 
                    ? "bg-[#2a2a3e] text-white" 
                    : "text-secondary hover:text-white hover:bg-white/5"
                }`}
              >
                {link.title}
              </a>
            ))}

            {/* Resume CTA */}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-[14px] font-medium bg-white text-black hover:bg-gray-200 transition-all duration-200 ml-1"
              >
                Resume
              </a>
            )}
          </nav>
        </motion.div>
      </div>

      {/* Mobile Navbar */}
      <div className="sm:hidden">
        {/* Regular mobile navbar */}
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ 
            y: 0,
            opacity: scrolled ? 0 : 1,
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ pointerEvents: scrolled ? 'none' : 'auto' }}
          className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 left-0 right-0 z-50`}
        >
          <div className='w-full flex justify-between items-center'>
            <Link
              to="/"
              onClick={() => { 
                setActive("");
                window.scrollTo(0,0);
              }}
            >
              <Logo />
            </Link>
            
            <div className='menu-container' ref={menuRef}>
              <div className='menu-trigger' onClick={() => setToggle(!toggle)}>
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
                      key={link.id}
                      text={link.title} 
                      onClick={() => {
                        setActive(link.title);
                        setToggle(false);
                      }} 
                      path={`#${link.id}`}
                    />
                  ))}
                  {resumeUrl && (
                    <DropdownItem 
                      text="Resume" 
                      path={resumeUrl} 
                      target="_blank" 
                      onClick={() => setToggle(false)} 
                    />
                  )}
                </ul>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Floating mobile navbar */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: scrolled ? 0 : -20,
            opacity: scrolled ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ pointerEvents: scrolled ? 'auto' : 'none' }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <nav className="flex items-center justify-between px-4 py-3 bg-[#1a1a2e]/95 backdrop-blur-lg rounded-full border border-white/10 shadow-2xl shadow-black/50">
            <Link
              to="/"
              onClick={() => { 
                setActive("");
                window.scrollTo(0,0);
              }}
            >
              <Logo />
            </Link>
            
            <div className='menu-container'>
              <div className='menu-trigger' onClick={() => setToggle(!toggle)}>
                <img
                  src={toggle ? close : menu}
                  alt="menu"
                  className='w-[24px] h-[24px] object-contain cursor-pointer'
                />
              </div>
              <div className={`dropdown-menu ${toggle ? 'active' : 'inactive'} dropdown-menu-left`}>
                <ul className='text-secondary'>
                  {navLinks.map(link => (
                    <DropdownItem 
                      key={link.id}
                      text={link.title} 
                      onClick={() => {
                        setActive(link.title);
                        setToggle(false);
                      }} 
                      path={`#${link.id}`}
                    />
                  ))}
                  {resumeUrl && (
                    <DropdownItem 
                      text="Resume" 
                      path={resumeUrl} 
                      target="_blank" 
                      onClick={() => setToggle(false)} 
                    />
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
