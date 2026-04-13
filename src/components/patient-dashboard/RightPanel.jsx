import React from 'react';

const RightPanel = ({ patientData }) => {
  return (
    <div className="w-full flex flex-col p-8 pb-4">
      
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-xl font-bold">My Profile</h3>
        <div className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
        </div>
      </div>

      {/* Profile Circle Avatar */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative w-28 h-28 mb-4">
           {/* Decorative floating rings */}
           <div className="absolute inset-0 border-[3px] border-blue-100 rounded-full scale-125"></div>
           <div className="absolute inset-0 border-[2px] border-[#5265ec] rounded-full scale-110 border-dashed animate-spin-slow"></div>
           <img src={patientData.avatar} alt="Patient Avatar" className="w-full h-full rounded-full object-cover shadow-lg relative z-10" />
        </div>
        <h2 className="text-2xl font-bold">{patientData.name}</h2>
        <span className="text-gray-400 text-sm font-semibold mt-1">Patient ID: #88902</span>
      </div>

      {/* Upcoming List */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Upcoming Visits</h3>
        <button className="text-[#5265ec] text-xs font-semibold hover:underline">View All</button>
      </div>

      <div className="flex flex-col gap-4 mb-auto">
        {patientData.upcoming.map((doc, i) => (
          <div key={i} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#5265ec]/30 transition-colors cursor-pointer">
            <img src={doc.img} alt={doc.doctor} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex flex-col justify-center">
              <h4 className="font-bold text-sm text-slate-800">{doc.doctor}</h4>
              <p className="text-xs text-gray-400 font-medium">{doc.date} • {doc.time}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RightPanel;
