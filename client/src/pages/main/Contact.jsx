import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { socialPlatformsHover } from "../../constants";
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { slideIn } from '../../utils/motion';
import { handleFetchSocialLinks } from "./handlers/contactSectionHandlers";
import { handleContactFormSubmit } from "./handlers/contactSectionHandlers";


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

  

  return (
    <div className="xl:mt-12 flex flex-col items-center gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact Me</h3>

        <form ref={formRef} onSubmit={(e) => handleContactFormSubmit(e, setLoading, setForm, form)}  className="mt-8 flex flex-col gap-6">
          <label className="flex flex-col">
            <span className="text-white font-medium mb-2">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="bg-tertiary py-3 px-4 text-white rounded-lg outline-none border-none font-medium"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-white font-medium mb-2">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="bg-tertiary py-3 px-4 text-white rounded-lg outline-none border-none font-medium"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-white font-medium mb-2">Your Message</span>
            <textarea
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Type your message..."
              className="bg-tertiary py-3 px-4 text-white rounded-lg outline-none border-none font-medium"
              required
            />
          </label>

          <button
            type="submit"
            className="bg-tertiary py-3 px-6 rounded-lg outline-none w-fit text-white font-bold shadow-md hover:bg-opacity-80 transition"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      {/* Social Media Links with Dynamic Usernames */}
      <div className="mt-6 flex justify-between w-full max-w-lg">
        {Object.entries(socialPlatformsHover).map(([key, { icon, color }]) => (
          socialLinks[key] && (
            <a key={key} href={socialLinks[key]} target="_blank" rel="noopener noreferrer">
              {React.createElement(icon, { size: 40, className: `text-gray-400 ${color} transition-all duration-300` })}
            </a>
          )
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-12 pb-6">
        <p className="text-gray-500 text-sm text-center flex items-center gap-2">
          Made with <span className="text-red-500 animate-pulse">❤️</span> by Neil Daterao
        </p>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
