import React from 'react';

const RightPanel = ({ patientData }) => {
  return (
    <div className="w-full flex flex-col p-6 pb-2">


      {/* Profile Circle Avatar */}
      <div className="flex flex-col items-center mb-4 mt-14">
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
