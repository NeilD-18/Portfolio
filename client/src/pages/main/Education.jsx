import React from 'react';
import { motion } from 'framer-motion';
import { styles } from '../../styles';
import { SectionWrapper } from '../../hoc';
import { fadeIn, textVariant } from '../../utils/motion';

const Education = () => {
  const educationHistory = [
    {
      school: "Union College",
      location: "Schenectady, NY",
      degree: "B.S. Computer Science & Mathematics",
      minor: "Statistics",
      year: "2022 — 2026",
      gpa: "3.8",
      logo: "/amazon_logo.jpg", // Replace with Union logo
      status: "Current",
      courses: ["Data Structures", "Algorithms", "Machine Learning", "Statistical Modeling"]
    },
    {
      school: "Graduate Studies",
      location: "Targeting T10",
      degree: "M.S. Computer Science",
      year: "2026 — Future",
      gpa: "The Next Level",
      logo: "/Neil_Logo.svg", 
      status: "Future",
      isFuture: true,
      courses: ["AI", "Advanced Robotics", "Cloud Architecture"]
    }
  ];

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>The Academic Journey</p>
        <h2 className={`${styles.sectionHeadText} text-center`}>Education.</h2>
      </motion.div>

      <div className="mt-16 flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto items-stretch">
        {educationHistory.map((edu, index) => (
          <motion.div
            key={index}
            variants={fadeIn(index === 0 ? 'right' : 'left', 'spring', index * 0.3, 1)}
            className={`flex-1 relative p-10 rounded-[32px] border transition-all duration-500 group ${
              edu.isFuture 
              ? "bg-white/5 border-dashed border-white/20 hover:border-[#915EFF]/50" 
              : "bg-gradient-to-br from-[#1d1836] to-[#0c0c14] border-white/10 shadow-2xl hover:shadow-[#915EFF]/10"
            }`}
          >
            {/* Future/Current Glow Badge */}
            <div className={`absolute top-6 right-8 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold z-10 ${
              edu.isFuture ? "bg-white/10 text-secondary animate-pulse" : "bg-[#915EFF] text-white shadow-glow"
            }`}>
              {edu.status}
            </div>

            <div className="flex flex-col h-full gap-8">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-2xl p-4 flex items-center justify-center shrink-0 ${
                  edu.isFuture ? "bg-white/5 grayscale opacity-40" : "bg-white shadow-lg"
                }`}>
                  <img 
                    src={edu.logo} 
                    alt={edu.school} 
                    className="w-full h-full object-contain" 
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight">{edu.school}</h3>
                  <p className="text-secondary text-sm mt-1">{edu.location}</p>
                </div>
              </div>

              <div className="flex-1">
                <p className={`text-xl font-semibold ${edu.isFuture ? "text-secondary" : "text-[#915EFF]"}`}>
                  {edu.degree}
                </p>
                {edu.minor && (
                  <p className="text-secondary/80 text-sm mt-1 font-medium">
                    Minor in <span className="text-white">{edu.minor}</span>
                  </p>
                )}
                <div className="mt-2 flex items-center gap-4 text-sm text-secondary/60">
                   <span>{edu.year}</span>
                   <span className="w-1 h-1 rounded-full bg-[#915EFF]/50" />
                   <span className="font-mono">{edu.gpa}</span>
                </div>

                {/* Coursework Tags */}
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-4 font-bold">Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {edu.courses.map((course) => (
                      <span key={course} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-secondary group-hover:border-[#915EFF]/30 transition-colors">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Education, 'education');
