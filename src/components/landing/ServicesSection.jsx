import React from 'react';

const ServicesSection = () => {
  const services = [
    {
      title: "General Consultations",
      desc: "Comprehensive diagnosis and treatment for common illnesses, infections, and health concerns.",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      hoverBg: "group-hover:bg-blue-600",
      icon: "🩺"
    },
    {
      title: "Preventive Care",
      desc: "Routine check-ups, immunizations, and health screenings to catch issues early and keep you healthy.",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      hoverBg: "group-hover:bg-purple-600",
      icon: "🛡️"
    },
    {
      title: "Disease Management",
      desc: "Ongoing, personalized care and monitoring for conditions such as diabetes, hypertension, and asthma.",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      hoverBg: "group-hover:bg-yellow-600",
      icon: "❤️"
    },
    {
      title: "Wellness Counseling",
      desc: "Expert diet, lifestyle, and wellness advice tailored to improve your day-to-day quality of life.",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600",
      hoverBg: "group-hover:bg-teal-600",
      icon: "🌿"
    }
  ];

  return (
    <section id="services" className="w-full max-w-7xl mx-auto px-8 md:px-16 py-24 bg-slate-50/50 rounded-[3rem]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Complete Medical Services</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          Expert medical care covering all your essential health and wellness needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((svc, idx) => (
          <div key={idx} className="flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-shadow group">
            <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center text-3xl transition-transform duration-500 ease-out group-hover:scale-110 ${svc.bgColor}`}>
              {svc.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{svc.title}</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed grow">
              {svc.desc}
            </p>
            <div className={`w-8 h-8 rounded-full ${svc.bgColor} ${svc.textColor} flex items-center justify-center ${svc.hoverBg} group-hover:text-white transition-colors cursor-pointer mt-auto`}>
              →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
