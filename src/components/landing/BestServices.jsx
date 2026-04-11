import React from 'react';

const BestServices = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Providing the best <br/> medical services</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          World-class care for everyone. Our health System offers unmatched, expert health care.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Card 1 */}
        <div className="flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-shadow group">
          <div className="w-32 h-32 mb-6 relative">
             <div className="absolute inset-0 bg-blue-50 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
             {/* Using placeholder svgs to represent the illustrations */}
             <img src="https://placehold.co/150x150/transparent/0f172a?text=Icon" alt="Find Location" className="relative z-10 w-full h-full object-contain p-4"/>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Facility Info</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.
          </p>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors cursor-pointer">
            →
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-shadow group">
          <div className="w-32 h-32 mb-6 relative">
             <div className="absolute inset-0 bg-purple-50 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
             <img src="https://placehold.co/150x150/transparent/0f172a?text=Icon" alt="Find Location" className="relative z-10 w-full h-full object-contain p-4"/>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Find a Location</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.
          </p>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors cursor-pointer">
            →
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-shadow group">
          <div className="w-32 h-32 mb-6 relative">
             <div className="absolute inset-0 bg-yellow-50 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
             <img src="https://placehold.co/150x150/transparent/0f172a?text=Icon" alt="Book Appointment" className="relative z-10 w-full h-full object-contain p-4"/>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Book Appointment</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            World-class care for everyone. Our health System offers unmatched, expert health care. From the lab to the clinic.
          </p>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors cursor-pointer">
            →
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestServices;
