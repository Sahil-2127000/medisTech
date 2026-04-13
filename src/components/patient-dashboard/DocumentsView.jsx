import React from 'react';

const DocumentsView = () => {
  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#021024]">Medical Documents</h1>
        <p className="text-gray-400 font-medium mt-1">Access your prescriptions, lab results, and reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-6 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer group">
            <div className="w-14 h-14 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <h3 className="font-bold text-lg mb-1 text-slate-800">Blood Test Results</h3>
            <p className="text-sm text-gray-400 font-medium mb-4">Added Jan 15, 2026</p>
            <div className="mt-auto text-[#5265ec] font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Document
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsView;
