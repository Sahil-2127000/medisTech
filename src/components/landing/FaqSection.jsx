import React, { useState } from 'react';

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    { question: "01. What is your medical care?", answer: "We provide comprehensive health care covering general medicine, specialities, surgery, and emergency services." },
    { question: "2. What happens if I need to go to a hospital?", answer: "Our smart clinic handles 90% of cases in-house. If hospitalization is required, we have direct integration with top-tier hospitals for a seamless transfer." },
    { question: "03. Can I visit your medical office?", answer: "Yes, we accept walk-in patients during our standard business hours. However, booking an appointment is recommended to avoid waiting." },
    { question: "4. Do you provide urgent care?", answer: "We have an urgent care wing dedicated to immediate non-life-threatening medical conditions, operating 24/7." }
  ];

  return (
    <section id="faq" className="w-full max-w-6xl mx-auto px-8 py-24 flex flex-col md:flex-row items-start gap-16">
      
      {/* Left Doctor Image */}
      <div className="w-full mt-11 md:w-5/12 relative rounded-4xl overflow-hidden bg-[#c5f5f1] pb-0 hidden md:block">
        {/* Soft background shape */}
        <div className="absolute inset-0 opacity-50 bg-linear-to-t from-white/20 to-transparent"></div>
        <img 
          src="https://www.shutterstock.com/image-vector/male-doctor-smiling-happy-face-600nw-2481032615.jpg" 
          alt="Smiling Doctor" 
          className="relative z-10 w-full h-auto object-cover object-bottom"
        />
      </div>

      {/* Right FAQ Content */}
      <div className="w-full md:w-7/12">
        <h2 className="text-4xl font-bold text-slate-900 mb-10 leading-tight">
          Most questions by our <br/> beloved patients
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setActiveIndex(activeIndex === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-5 md:p-6 bg-white hover:bg-slate-50 transition-colors text-left"
              >
                <span className="font-semibold text-slate-800">{faq.question}</span>
                <span className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center shrink-0 text-slate-500 font-medium">
                  {activeIndex === idx ? '-' : '+'}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out bg-slate-50 px-6 ${activeIndex === idx ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
              >
                <p className="text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default FaqSection;
