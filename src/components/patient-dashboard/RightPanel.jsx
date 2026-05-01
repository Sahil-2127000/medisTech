import React from 'react';

const RightPanel = ({ patientData }) => {
  return (
    <div className="w-full flex flex-col p-6 pb-2">

      <div className="flex justify-end items-center mb-4">
        <div className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>
      </div>

      {/* Profile Circle Avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-24 h-24 mb-3">
          {/* Decorative floating rings */}
          <div className="absolute inset-0 border-[3px] border-blue-100 dark:border-slate-800 rounded-full scale-125"></div>
          <div className="absolute inset-0 border-2 border-[#5265ec] rounded-full scale-110 border-dashed animate-spin-slow"></div>
          <img src={patientData.avatar} alt="Patient Avatar" className="w-full h-full rounded-full object-cover shadow-lg relative z-10" />
        </div>
        <h2 className="text-xl font-bold sm-text-center dark:text-white">{patientData.name}</h2>
        <span className="text-gray-400 dark:text-blue-400 text-xs font-bold mt-1 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/20">ID: {patientData.patientUid || '----'}</span>
      </div>

    </div>
  );
};

export default RightPanel;
