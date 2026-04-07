import React from 'react';

const ReviewsSection = () => {
  return (
    <section className="w-full max-w-7xl px-4 md:px-8 mt-32">
      <div className="bg-clinic-800 rounded-[3rem] p-8 md:p-16 relative overflow-hidden border border-clinic-600/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-clinic-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Patient Stories</h2>
            <p className="text-clinic-400 text-lg">Hear what our patients have to say about our seamless queue management.</p>
          </div>
          <button className="text-white font-medium hover:text-clinic-200 transition-colors flex items-center gap-2">
            View all reviews
            <span className="text-xl">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Review 1 */}
          <div className="bg-clinic-900/50 p-8 rounded-3xl border border-clinic-600/10 backdrop-blur-md">
            <div className="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
            <p className="text-clinic-200 mb-6 text-sm leading-relaxed">"The digital token system completely changed my visit. I knew exactly when it was my turn, avoiding hours of waiting in the lobby."</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-clinic-600 flex items-center justify-center font-bold">SM</div>
              <div>
                <div className="font-bold text-white text-sm">Sarah Mitchell</div>
                <div className="text-xs text-clinic-400">Regular Patient</div>
              </div>
            </div>
          </div>
          {/* Review 2 */}
          <div className="bg-clinic-900/50 p-8 rounded-3xl border border-clinic-600/10 backdrop-blur-md">
            <div className="flex text-yellow-400 mb-4 text-sm">★★★★★</div>
            <p className="text-clinic-200 mb-6 text-sm leading-relaxed">"Having all my prescriptions stored in one dashboard is fantastic. I don't have to carry old paper files anymore."</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-clinic-400 flex items-center justify-center font-bold text-clinic-900">JD</div>
              <div>
                <div className="font-bold text-white text-sm">James Peterson</div>
                <div className="text-xs text-clinic-400">Consultation</div>
              </div>
            </div>
          </div>
          {/* Review 3 */}
          <div className="bg-clinic-900/50 p-8 rounded-3xl border border-clinic-600/10 backdrop-blur-md">
            <div className="flex text-yellow-400 mb-4 text-sm">★★★★☆</div>
            <p className="text-clinic-200 mb-6 text-sm leading-relaxed">"Very smooth app interface! Booking an appointment was seamless, and the web portal is highly responsive and fast."</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-clinic-200 flex items-center justify-center font-bold text-clinic-900">EK</div>
              <div>
                <div className="font-bold text-white text-sm">Emily K.</div>
                <div className="text-xs text-clinic-400">Dental Patient</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
