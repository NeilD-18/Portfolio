import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FaLinkedin, FaGithub, FaInstagram, FaSnapchat, FaYoutube } from "react-icons/fa";

import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { slideIn } from '../../utils/motion';

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Your Name",
          from_email: form.email,
          to_email: "your.email@example.com",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you! I'll get back to you soon.");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          alert("Something went wrong. Please try again.");
        }
      );
  };

  return (

    
    <div className="xl:mt-12 flex flex-col items-center gap-10 overflow-hidden">
       
      
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact Me</h3>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
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

      {/* Social Media Links */}
      <div className="mt-6 flex justify-between w-full max-w-lg">
        <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
          <FaLinkedin size={40} className="text-white hover:text-blue-500 transition" />
        </a>
        <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <FaGithub size={40} className="text-white hover:text-gray-400 transition" />
        </a>
        <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={40} className="text-white hover:text-pink-500 transition" />
        </a>
        <a href="https://snapchat.com/add/yourprofile" target="_blank" rel="noopener noreferrer">
          <FaSnapchat size={40} className="text-white hover:text-yellow-500 transition" />
        </a>
        <a href="https://youtube.com/c/yourchannel" target="_blank" rel="noopener noreferrer">
          <FaYoutube size={40} className="text-white hover:text-red-500 transition" />
        </a>

        
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
