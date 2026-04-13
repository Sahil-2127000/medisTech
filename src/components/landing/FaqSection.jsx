import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    { question: "1. What is your medical care?", answer: "We provide comprehensive health care covering general medicine, specialities, surgery, and emergency services." },
    { question: "2. What happens if I need to go to a hospital?", answer: "Our smart clinic handles 90% of cases in-house. If hospitalization is required, we have direct integration with top-tier hospitals for a seamless transfer." },
    { question: "3. Can I visit your medical office?", answer: "Yes, we accept walk-in patients during our standard business hours. However, booking an appointment is recommended to avoid waiting." },
    { question: "4. Do you provide urgent care?", answer: "We have an urgent care wing dedicated to immediate non-life-threatening medical conditions, operating 24/7." }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="faq" className="w-full max-w-6xl mx-auto px-8 py-24 flex flex-col md:flex-row items-start gap-16 overflow-hidden">
      
      {/* Left Doctor Image */}
      <motion.div 
        variants={imageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="w-full mt-11 md:w-5/12 relative rounded-4xl overflow-hidden bg-[#c5f5f1] pb-0 hidden md:block group"
      >
        {/* Soft background shape */}
        <div className="absolute inset-0 opacity-50 bg-linear-to-t from-white/20 to-transparent"></div>
        <img 
          src="https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg" 
          alt="Smiling Doctor" 
          className="relative z-10 w-full h-auto object-cover object-bottom group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
      </motion.div>

      {/* Right FAQ Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="w-full md:w-7/12"
      >
        <motion.h2 variants={itemVariants} className="text-4xl font-bold text-slate-900 mb-10 leading-tight">
          Most questions by our <br/> beloved patients
        </motion.h2>

        <motion.div variants={containerVariants} className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button 
                onClick={() => setActiveIndex(activeIndex === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-5 md:p-6 bg-white hover:bg-slate-50 transition-colors text-left focus:outline-none"
              >
                <span className={`font-semibold transition-colors duration-300 ${activeIndex === idx ? 'text-blue-600' : 'text-slate-800'}`}>
                  {faq.question}
                </span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-medium transition-all duration-300 ${activeIndex === idx ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-500'}`}>
                  {activeIndex === idx ? '−' : '+'}
                </span>
              </button>
              
              <AnimatePresence initial={false}>
                {activeIndex === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden bg-slate-50"
                  >
                    <div className="px-6 py-4 border-t border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

    </section>
  );
};

export default FaqSection;
