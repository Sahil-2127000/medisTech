import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-8 md:px-16 py-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 overflow-hidden">
      
      {/* Left Image Group */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 relative flex justify-center lg:justify-start"
      >
        {/* Soft Background Blobs for depth */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

        {/* Main Image */}
        <div className="relative z-10 w-[90%] sm:w-[80%] lg:w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
          <img 
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80" 
            alt="Dr. Portrait" 
            className="w-full h-auto object-cover object-center aspect-4/5 group-hover:scale-110 transition-transform duration-1000 ease-in-out"
          />
        </div>

        {/* Floating Trust Card (Floating Animation) */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 right-0 lg:-right-8 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 z-20 min-w-max border border-slate-100/50"
        >
          <div className="w-14 h-14 bg-linear-to-br from-blue-50 to-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-inner">
             🩺
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg">Dr. Anand Kumar</div>
            <div className="text-sm text-slate-500 font-medium">General Physician</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Content Section */}
      <motion.div 
        className="w-full lg:w-1/2 space-y-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.div variants={itemVariants} className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-2">
          About The Doctor
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
          Compassionate Care, <br/> Exceptional Medicine.
        </motion.h2>
        
        <motion.p variants={itemVariants} className="text-slate-600 leading-relaxed text-lg font-medium border-l-4 border-blue-500 pl-4 py-1">
          Welcome to our clinic. Core to our practice is the belief that healthcare should be highly personal and deeply trustworthy.
        </motion.p>

        <div className="space-y-5 text-slate-600 pt-4">
          <motion.div variants={itemVariants} className="flex gap-4 items-start hover:translate-x-2 transition-transform">
            <div className="mt-1 bg-blue-600 text-white rounded-full p-1.5 shadow-md shadow-blue-600/20 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-1 text-base">Education & Expertise</h4>
              <p className="text-sm leading-relaxed">Dr. Anand Kumar earned their medical degree from a prestigious university and completed rigorous residency training, specializing in comprehensive primary care and holistic health.</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-4 items-start hover:translate-x-2 transition-transform">
            <div className="mt-1 bg-blue-600 text-white rounded-full p-1.5 shadow-md shadow-blue-600/20 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-1 text-base">Trusted Local Clinic</h4>
              <p className="text-sm leading-relaxed">Established with a vision to serve the community, our clinic has proudly been a cornerstone of health for over a decade, treating generations of local families.</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4 items-start hover:translate-x-2 transition-transform">
            <div className="mt-1 bg-blue-600 text-white rounded-full p-1.5 shadow-md shadow-blue-600/20 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <div>
              <h4 className="text-slate-900 font-bold mb-1 text-base">Our Philosophy</h4>
              <p className="text-sm leading-relaxed">We believe in treating the patient, not just the symptoms. Our approach combines evidence-based medicine with genuine empathy and continuous support.</p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="pt-6">
          <a href="#contact" className="inline-block bg-slate-900 hover:scale-105 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-lg shadow-slate-900/20">
            Learn More
          </a>
        </motion.div>
      </motion.div>

    </section>
  );
};

export default AboutSection;
