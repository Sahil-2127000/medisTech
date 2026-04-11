import React from 'react';

const FeatureSection = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-8 py-24 flex flex-col md:flex-row items-center gap-16">
      
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 relative flex justify-center">
        {/* Yellow abstract background shape */}
        <div className="absolute inset-0 bg-[#f8c12a] rounded-3xl overflow-hidden w-[90%] md:w-[80%] mx-auto shadow-sm">
          {/* Flower vector decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20" style={{ backgroundImage: "radial-gradient(circle, #fff 10%, transparent 11%), radial-gradient(circle, #fff 10%, transparent 11%)", backgroundSize: "30px 30px" }}></div>
        </div>
        
        {/* Doctor Image */}
        <img 
          src="https://placehold.co/400x500/transparent/ffffff?text=Doctor" 
          alt="Dr. Mitchell Stark" 
          className="relative z-10 w-[85%] md:w-[75%] object-cover transform translate-y-8"
        />

        {/* Floating Card */}
        <div className="absolute bottom-12 right-0 md:-right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20 transform hover:-translate-y-2 transition-transform">
          <div className="w-12 h-12 bg-purple-100 rounded-xl overflow-hidden shrink-0">
             <img src="https://placehold.co/100x100/a682ff/ffffff?text=MS" alt="Avatar" className="w-full h-full object-cover"/>
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm">Dr. Mitchell Stark</div>
            <div className="text-xs text-slate-500">Chief Doctor of Nursing</div>
          </div>
        </div>
      </div>

      {/* Right Content Section */}
      <div className="w-full md:w-1/2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
          Proud to be one of the <br/> nation's best
        </h2>
        
        <p className="text-slate-600 leading-relaxed text-sm">
          For 20 years in a row, U.S. News & World Report has recognized us as one of the best public hospitals in the Nation and #1 in Texas.
        </p>
        
        <p className="text-slate-600 leading-relaxed text-sm">
          Our best is something we strive for each day, caring for our patients—not looking back at what we accomplished but towards what we can do tomorrow. Providing the best.
        </p>

        <div className="pt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-blue-500/30">
            Learn more
          </button>
        </div>
      </div>

    </section>
  );
};

export default FeatureSection;
