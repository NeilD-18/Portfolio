import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { socialPlatformsHover } from "../../constants";
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { slideIn } from '../../utils/motion';
import { handleFetchSocialLinks } from "./handlers/contactSectionHandlers";
import { handleContactFormSubmit } from "./handlers/contactSectionHandlers";

// Confetti celebration function
const triggerConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#915EFF', '#00CEA8', '#BF61FF'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#915EFF', '#00CEA8', '#BF61FF'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#915EFF', '#00CEA8', '#BF61FF'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#915EFF', '#00CEA8', '#BF61FF'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#915EFF', '#00CEA8', '#BF61FF'],
  });
};

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState({});

  // Fetch contact info from backend
  useEffect(() => {
    handleFetchSocialLinks(setSocialLinks, socialPlatformsHover)
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Custom submit handler with confetti
  const handleSubmit = (e) => {
    handleContactFormSubmit(e, setLoading, setForm, form);
    // Trigger confetti after a small delay (assuming success)
    setTimeout(() => {
      if (!loading) {
        triggerConfetti();
      }
    }, 1000);
  };

  
  return (
    <div className="xl:mt-12 flex flex-col items-center gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl border border-[#915EFF]/20 hover:border-[#915EFF]/40 transition-colors duration-300"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={`${styles.sectionHeadText} gradient-text-animated`}>Contact Me</h3>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <label className="flex flex-col group">
            <span className="text-white font-medium mb-2 group-focus-within:text-[#915EFF] transition-colors">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="bg-tertiary py-3 px-4 text-white rounded-lg outline-none border border-transparent focus:border-[#915EFF] font-medium transition-all duration-300"
              required
            />
          </label>

          <label className="flex flex-col group">
            <span className="text-white font-medium mb-2 group-focus-within:text-[#915EFF] transition-colors">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-tertiary py-3 px-4 text-white rounded-lg outline-none border border-transparent focus:border-[#915EFF] font-medium transition-all duration-300"
              required
            />
          </label>

          <label className="flex flex-col group">
            <span className="text-white font-medium mb-2 group-focus-within:text-[#915EFF] transition-colors">Your Message</span>
            <textarea
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Type your message..."
              className="bg-tertiary py-3 px-4 text-white rounded-lg outline-none border border-transparent focus:border-[#915EFF] font-medium resize-none transition-all duration-300"
              required
            />
          </label>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-[#915EFF] to-[#00CEA8] py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-lg hover:shadow-glow transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Sending...
              </span>
            ) : "Send Message"}
          </motion.button>
        </form>
      </motion.div>

      {/* Social Media Links with Dynamic Usernames */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 flex justify-center gap-8 w-full max-w-lg"
      >
        {Object.entries(socialPlatformsHover).map(([key, { icon, color }]) => (
          socialLinks[key] && (
            <motion.a 
              key={key} 
              href={socialLinks[key]} 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              {React.createElement(icon, { size: 36, className: `text-gray-400 ${color} transition-all duration-300` })}
            </motion.a>
          )
        ))}
      </motion.div>

      {/* FOOTER */}
      <div className="mt-12 pb-6">
        <p className="text-gray-500 text-sm text-center flex items-center justify-center gap-2">
          Made with <span className="text-red-500 animate-pulse">❤️</span> by Neil Daterao
        </p>
        <p className="text-gray-600 text-xs text-center mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
