import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaLinkedin, FaGithub, FaInstagram, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { textVariant, fadeIn } from '../../utils/motion';
import { handleFetchSocialLinks, handleFetchResumeUrl } from "./handlers/contactSectionHandlers";
import { socialPlatformsHover } from "../../constants";

const EMAIL = "ndaterao2@gmail.com";

// Animated gradient border component
const GradientBorder = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#915EFF] via-[#00CEA8] to-[#BF61FF] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#915EFF] via-[#00CEA8] to-[#BF61FF] rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
    {children}
  </div>
);

const Contact = () => {
  const [socialLinks, setSocialLinks] = useState({});
  const [resumeUrl, setResumeUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    handleFetchSocialLinks(setSocialLinks, socialPlatformsHover);
    handleFetchResumeUrl(setResumeUrl);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      toast("Email copied!", {
        icon: '✅',
        style: { borderRadius: '12px', background: '#0a0a0f', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast("Couldn't copy", { icon: '❌' });
    }
  };

  const linkedinUrl = socialLinks.linkedin || "https://linkedin.com/in/neildaterao";
  const githubUrl = socialLinks.github;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div variants={textVariant()} className="text-center mb-16">
        <p className={`${styles.sectionSubText}`}>What's next?</p>
        <h2 className={`${styles.sectionHeadText}`}>
          Let's <span className="gradient-text-animated">Connect</span>
        </h2>
        <motion.p 
          variants={fadeIn("up", "spring", 0.2, 1)}
          className="mt-4 text-secondary text-[16px] max-w-xl mx-auto leading-relaxed"
        >
          I'm always open to new opportunities, collaborations, or just a good conversation about tech.
        </motion.p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* LinkedIn - Primary CTA (Large) */}
        <GradientBorder className="md:col-span-2">
          <motion.a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeIn("up", "spring", 0.3, 0.8)}
            whileHover={{ y: -4 }}
            className="relative block bg-[#0a0a0f] rounded-2xl p-8 border border-white/5 overflow-hidden"
          >
            {/* Background gradient blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0077B5]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#0077B5] flex items-center justify-center shadow-lg shadow-[#0077B5]/30">
                  <FaLinkedin className="text-white text-3xl" />
                </div>
                <div>
                  <p className="text-white/50 text-sm font-medium uppercase tracking-wider">Preferred</p>
                  <h3 className="text-white text-2xl font-bold mt-1">Connect on LinkedIn</h3>
                  <p className="text-secondary text-sm mt-1">I respond within 24 hours</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-white/50 group-hover:text-white transition-colors">
                <span className="text-sm font-medium">Let's chat</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.a>
        </GradientBorder>

        {/* Email Card */}
        <GradientBorder>
          <motion.div
            variants={fadeIn("right", "spring", 0.4, 0.8)}
            className="relative bg-[#0a0a0f] rounded-2xl p-6 border border-white/5 h-full"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#915EFF] to-[#BF61FF] flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Email</p>
                <p className="text-white font-mono text-sm mt-2 truncate">{EMAIL}</p>
              </div>
            </div>
            
            <div className="mt-5 flex gap-2">
              <motion.button
                onClick={handleCopyEmail}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                  copied 
                    ? 'bg-[#00CEA8]/20 text-[#00CEA8] border border-[#00CEA8]/30' 
                    : 'bg-white/5 text-white border border-white/10 hover:border-[#915EFF]/50'
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </motion.button>
              <motion.a
                href={`mailto:${EMAIL}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium bg-white/5 text-white border border-white/10 hover:border-[#915EFF]/50 transition-all text-center"
              >
                Send
              </motion.a>
            </div>
          </motion.div>
        </GradientBorder>

        {/* GitHub Card */}
        {githubUrl && (
          <GradientBorder>
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeIn("left", "spring", 0.5, 0.8)}
              whileHover={{ y: -2 }}
              className="relative block bg-[#0a0a0f] rounded-2xl p-6 border border-white/5 h-full"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#333] flex items-center justify-center flex-shrink-0">
                  <FaGithub className="text-white text-2xl" />
                </div>
                <div className="flex-1">
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Code</p>
                  <h3 className="text-white text-lg font-semibold mt-1">View GitHub</h3>
                  <p className="text-secondary text-sm mt-1">Check out my projects</p>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 text-white/30 group-hover:text-white/60 transition-colors">
                <FaArrowRight />
              </div>
            </motion.a>
          </GradientBorder>
        )}

        {/* Other Socials Row */}
        <motion.div 
          variants={fadeIn("up", "spring", 0.6, 0.8)}
          className="md:col-span-2 flex justify-center gap-3 mt-4"
        >
          {Object.entries(socialPlatformsHover).map(([key, { icon, color }]) => {
            if (key === 'linkedin' || key === 'github') return null; // Already shown above
            if (!socialLinks[key]) return null;
            
            return (
              <motion.a
                key={key}
                href={socialLinks[key]}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-white/20 transition-all"
              >
                {React.createElement(icon, { 
                  size: 20, 
                  className: `text-secondary ${color} transition-colors duration-300` 
                })}
              </motion.a>
            );
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        variants={fadeIn("up", "spring", 0.7, 0.8)}
        className="mt-20 pt-8 border-t border-white/5"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm flex items-center gap-2">
            Built with <span className="text-red-400">♥</span> by Neil Daterao
          </p>
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
