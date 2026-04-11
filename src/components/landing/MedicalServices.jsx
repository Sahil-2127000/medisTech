import React from 'react';

const MedicalServices = () => {
  const services = [
    { title: "Cancer Care", desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic." },
    { title: "Labor & Delivery", desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic." },
    { title: "Heart & Vascular", desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic." },
    { title: "Mental Health", desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic." },
    { title: "Neurology", desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic." },
    { title: "Burn Treatment", desc: "World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic." },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-8 py-24">
      <div className="text-center max-w-xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our medical services</h2>
        <p className="text-slate-500 text-sm">
          World-class care for everyone. Our health System offers unmatched, expert health care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc, idx) => (
          <div key={idx} className="bg-white border border-slate-100 p-8 rounded-3xl hover:shadow-xl transition-shadow group">
            <h3 className="text-lg font-bold text-slate-900 mb-3">{svc.title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed group-hover:text-slate-600 transition-colors">
              {svc.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MedicalServices;
