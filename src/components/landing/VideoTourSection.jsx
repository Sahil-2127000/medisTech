import React from 'react';

const VideoTourSection = () => {
  return (
    <section className="w-full max-w-5xl px-8 mt-32 mb-16 text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Take A Virtual Tour</h2>
      <p className="text-clinic-400 text-lg mb-12 max-w-2xl mx-auto">See the clinic facilities inside out through our exclusive video tour and understand how our patient flow system operates firsthand.</p>

      <div className="relative w-full aspect-video bg-gradient-to-br from-clinic-800 to-clinic-900 rounded-[2rem] overflow-hidden flex items-center justify-center group cursor-pointer border border-clinic-600/30 shadow-2xl">
        {/* Overlay gradient / placeholder texture */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 z-10 w-full h-full flex items-center justify-center">
          <div className="w-full h-full opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%235483b3\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        </div>

        {/* Play Button */}
        <div className="w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full flex items-center justify-center z-20 group-hover:scale-110 group-hover:bg-white group-hover:text-clinic-900 transition-all duration-300">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 ml-2">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        <div className="absolute bottom-6 left-8 z-20 text-left">
          <h3 className="text-2xl font-bold text-white">Clinic Overview</h3>
          <p className="text-clinic-200 text-sm mt-1">2:45 Mins</p>
        </div>
      </div>
    </section>
  );
};

export default VideoTourSection;
