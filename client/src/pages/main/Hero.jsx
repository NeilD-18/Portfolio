import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; 

import { styles } from '../../styles';
import { SpaceManCanvas } from '../../canvas';

// Typewriter hook
const useTypewriter = (words, typingSpeed = 80, deletingSpeed = 50, pauseDuration = 2000) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentWord.length) {
          setText(currentWord.slice(0, text.length + 1));
        } else {
          setIsPaused(true);
        }
      } else {
        if (text.length > 0) {
          setText(currentWord.slice(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [text, wordIndex, isDeleting, isPaused, words, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
};

// Konami Code Easter Egg hook
const useKonamiCode = (onActivate) => {
  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    let index = 0;

    const handleKeyDown = (e) => {
      // Use e.code for more reliable key detection
      if (e.code === konamiCode[index]) {
        index++;
        if (index === konamiCode.length) {
          onActivate();
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onActivate]);
};

const Hero = () => {
  const [easterEggActive, setEasterEggActive] = useState(false);
  
  const roles = [
    "Developer",
    "Student-Athlete", 
    "Problem Solver",
    "Tech Enthusiast"
  ];
  
  const typedText = useTypewriter(roles, 100, 50, 2000);

  // Memoized easter egg callback
  const activateEasterEgg = useCallback(() => {
    setEasterEggActive(true);
    setTimeout(() => setEasterEggActive(false), 5000);
  }, []);

  // Easter egg
  useKonamiCode(activateEasterEgg);

  return (
    <section className='relative w-full h-screen mx-auto overflow-hidden'>
      {/* Animated gradient blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob" />
      <div className="absolute top-40 -right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />

      {/* Easter egg overlay */}
      {easterEggActive && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setEasterEggActive(false)}
        >
          <motion.div 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="text-9xl mb-8"
            >
              🎮
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-white mb-4"
            >
              You found the secret!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-secondary text-xl"
            >
              You're clearly a person of culture 🚀
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-500 text-sm mt-6"
            >
              Click anywhere to close
            </motion.p>
          </motion.div>
        </motion.div>
      )}

      <div className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}>
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF] shadow-[0_0_20px_5px_rgba(145,94,255,0.5)]'/>
          <div className='w-1 sm:h-80 h-40 violet-gradient'/>
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className='text-[#915EFF] gradient-text-animated'>Neil</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I'm a <span className='text-[#915EFF] font-semibold'>{typedText}</span>
            <span className='animate-blink text-[#915EFF]'>|</span>
          </p>
          <p className={`mt-4 text-secondary text-[16px] max-w-lg leading-[26px]`}>
            Passionate about solving interesting problems.
            <br className='sm:block hidden'/>
            Scroll and learn more about me!
          </p>
        </div>
      </div>

      <SpaceManCanvas />

      {/* Scroll indicator */}
      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href="#about">
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2 hover:border-[#915EFF] transition-colors duration-300'>
            <motion.div
              animate={{
                y: [0, 24, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop'
              }}  
              className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_4px_rgba(255,255,255,0.3)]"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
