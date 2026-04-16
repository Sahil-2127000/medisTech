import React, { useState } from 'react';

const DocumentsView = ({ prescriptions = [], labResults = [], reports = [] }) => {
  const [activeTab, setActiveTab] = useState('prescriptions');

  const safeFormatLong = (d) => {
    if (!d) return 'Recently';
    const date = new Date(d);
    return isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const safeFormatShort = (d) => {
    if (!d) return 'Recently';
    const date = new Date(d);
    return isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#021024]">Medical Documents</h1>
        <p className="text-gray-400 font-medium mt-1">Access your prescriptions, lab results, and reports</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-100 pb-2 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('prescriptions')} className={`px-4 py-2 font-semibold whitespace-nowrap transition-colors ${activeTab === 'prescriptions' ? 'text-[#5265ec] border-b-2 border-[#5265ec]' : 'text-gray-400 hover:text-slate-700'}`}>Prescriptions</button>
        <button onClick={() => setActiveTab('lab')} className={`px-4 py-2 font-semibold whitespace-nowrap transition-colors ${activeTab === 'lab' ? 'text-[#5265ec] border-b-2 border-[#5265ec]' : 'text-gray-400 hover:text-slate-700'}`}>Lab Results</button>
        <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 font-semibold whitespace-nowrap transition-colors ${activeTab === 'reports' ? 'text-[#5265ec] border-b-2 border-[#5265ec]' : 'text-gray-400 hover:text-slate-700'}`}>Reports</button>
      </div>

      <div className="flex-1">
        {activeTab === 'prescriptions' && (
          <div className="space-y-6">
            {prescriptions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-10 flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-[#5265ec]/10 text-[#5265ec] rounded-full flex items-center justify-center mb-4">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">No Prescriptions Yet</h3>
                 <p className="text-gray-500 text-center">You don't have any prescriptions assigned by doctors yet.</p>
              </div>
            ) : (
              prescriptions.map((px, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                      <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        Prescription from Dr. {px.doctorId?.fullName || 'Doctor'}
                      </h3>
                      <p className="text-sm text-gray-400 font-medium mt-1 border-l-2 border-[#5265ec] pl-2 ml-1">{safeFormatLong(px.createdAt)}</p>
                    </div>
                    <div className="bg-blue-50 text-[#5265ec] px-4 py-2 rounded-xl text-sm font-bold border border-blue-100 shadow-sm shrink-0">
                      Diagnosis: {px.diagnosis}
                    </div>
                  </div>
                  
                  {px.clinicalNotes && (
                    <div className="mb-6 text-sm text-slate-600 bg-[#fafcff] p-4 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#5265ec]"></div>
                      <strong className="text-slate-800 block mb-1">Clinical Notes</strong> 
                      {px.clinicalNotes}
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs">Rx</span>
                      Medicines & Timing
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {px.medicines && px.medicines.map((med, idx) => (
                        <div key={idx} className="flex flex-col bg-white hover:bg-[#fafcff] transition-colors border border-gray-200 rounded-2xl p-5 shadow-sm group">
                          <div className="font-bold text-slate-800 text-lg mb-3 flex items-start justify-between">
                            {med.name}
                            <svg className="w-5 h-5 text-gray-300 group-hover:text-[#5265ec] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-auto">
                             <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                               <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Dosage</span>
                               <span className="font-semibold text-slate-700 text-sm">{med.dosage}</span>
                             </div>
                             <div className="bg-gray-50 rounded-xl p-2 border border-gray-100">
                               <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Frequency</span>
                               <span className="font-semibold text-slate-700 text-sm">{med.frequency}</span>
                             </div>
                             <div className="col-span-2 bg-[#5265ec]/5 rounded-xl p-2 border border-[#5265ec]/10">
                               <span className="text-[#5265ec]/70 text-[10px] uppercase font-bold tracking-wider block mb-0.5">Duration</span>
                               <span className="font-semibold text-[#5265ec] text-sm">{med.duration}</span>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'lab' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {labResults.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10 font-medium">No lab results available.</div>
            ) : (
              labResults.map((item, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-6 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer group">
                  <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-100 transition-colors">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                    <span className="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{item.status}</span>
                  </div>
                  <p className="text-sm text-gray-400 font-medium mb-4">Added {safeFormatShort(item.createdAt || item.date)}</p>
                  <button onClick={() => window.open(item.fileUrl, '_blank')} className="mt-auto text-pink-500 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Document
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
             {reports.length === 0 ? (
               <div className="col-span-full text-center text-gray-500 py-10 font-medium">No reports available.</div>
             ) : (
               reports.map((item, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-6 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer group">
                  <div className="w-14 h-14 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <h3 className="font-bold text-lg mb-1 text-slate-800">{item.title}</h3>
                  <p className="text-sm text-[#5265ec] font-semibold mb-1">Dr. {item.doctorId?.fullName || 'Doctor'}</p>
                  <p className="text-sm text-gray-400 font-medium mb-4">Added {safeFormatShort(item.createdAt || item.date)}</p>
                  <button onClick={() => window.open(item.fileUrl, '_blank')} className="mt-auto text-teal-500 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Document
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                </div>
              ))
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsView;
