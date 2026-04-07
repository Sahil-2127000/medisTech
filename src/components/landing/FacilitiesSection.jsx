import React from 'react';

const FacilitiesSection = () => {
  return (
    <section className="w-full max-w-7xl px-8 mt-32 relative z-10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Clinic Facilities</h2>
        <p className="text-clinic-400 text-lg">We provide state-of-the-art medical equipment and comfortable seating areas to ensure you have the best possible visit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Facility 1 */}
        <div className="bg-clinic-800 p-8 rounded-[2rem] border border-clinic-600/20 hover:border-clinic-400/50 transition-all hover:-translate-y-2 group">
          <div className="w-14 h-14 bg-clinic-900 rounded-full flex items-center justify-center text-clinic-400 mb-6 group-hover:bg-clinic-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Modern Pharmacy</h3>
          <p className="text-clinic-200 text-sm leading-relaxed">Fully stocked pharmacy integrated directly with your digital prescriptions for instant medicine pickup.</p>
        </div>
        {/* Facility 2 */}
        <div className="bg-clinic-800 p-8 rounded-[2rem] border border-clinic-600/20 hover:border-clinic-400/50 transition-all hover:-translate-y-2 group">
          <div className="w-14 h-14 bg-clinic-900 rounded-full flex items-center justify-center text-clinic-400 mb-6 group-hover:bg-clinic-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">General Checkup</h3>
          <p className="text-clinic-200 text-sm leading-relaxed">Routine consultations from top-rated professionals to keep you healthy and informed throughout the year.</p>
        </div>
        {/* Facility 3 */}
        <div className="bg-clinic-800 p-8 rounded-[2rem] border border-clinic-600/20 hover:border-clinic-400/50 transition-all hover:-translate-y-2 group">
          <div className="w-14 h-14 bg-clinic-900 rounded-full flex items-center justify-center text-clinic-400 mb-6 group-hover:bg-clinic-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Pathology Lab</h3>
          <p className="text-clinic-200 text-sm leading-relaxed">In-house laboratory that syncs your test reports straight into your personal patient dashboard account.</p>
        </div>
        {/* Facility 4 */}
        <div className="bg-clinic-800 p-8 rounded-[2rem] border border-clinic-600/20 hover:border-clinic-400/50 transition-all hover:-translate-y-2 group">
          <div className="w-14 h-14 bg-clinic-900 rounded-full flex items-center justify-center text-clinic-400 mb-6 group-hover:bg-clinic-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Emergency & X-Ray</h3>
          <p className="text-clinic-200 text-sm leading-relaxed">24/7 priority emergency services with digital X-Ray integration visible via your online dashboard.</p>
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
