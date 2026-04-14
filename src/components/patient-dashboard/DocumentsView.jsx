import React from 'react';

const DocumentsView = ({ prescriptions = [] }) => {
  const safeFormatLong = (d) => {
    if (!d) return 'Recently';
    const date = d && d.includes('-') && d.split('-')[0].length === 4 ? new Date(d) : new Date(d);
    // If it's a standard Date string or ISO
    const parsedDate = new Date(d);
    return isNaN(parsedDate.getTime()) ? 'Recently' : parsedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const downloadPDF = (base64, filename) => {
    if (!base64) return;
    const link = document.createElement('a');
    link.href = base64;
    link.download = filename || 'prescription.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar bg-transparent">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-[#021024]">My Prescriptions</h1>
        <p className="text-gray-400 font-medium mt-1">Access and download your digital prescriptions</p>
      </div>

      <div className="flex-1">
        <div className="space-y-6">
          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.04)] p-16 flex flex-col items-center justify-center animate-fade-in shadow-inner">
               <div className="w-20 h-20 bg-[#5265ec]/10 text-[#5265ec] rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-8 ring-[#5265ec]/5 animate-pulse">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-800 mb-3">No Prescriptions Found</h3>
               <p className="text-gray-400 text-center max-w-xs font-medium">Your medical history is currently empty. Once a doctor issues a prescription, it will appear here instantly.</p>
            </div>
          ) : (
            prescriptions.map((px, i) => (
              <div key={px._id || i} className="bg-white rounded-[2rem] border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8 transition-all hover:shadow-[0_20px_60px_rgba(82,101,236,0.08)] group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-3xl transition-colors group-hover:bg-blue-100/50"></div>
                
                <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8 gap-6 relative z-10">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#5265ec]/10 text-[#5265ec] flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 font-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-2xl text-slate-800 tracking-tight">
                        Prescription from <span className="text-[#5265ec]">Dr. {px.doctorId?.fullName || 'Specialist'}</span>
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 font-bold">
                        <span className="text-xs uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{safeFormatLong(px.createdAt)}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-sm text-[#5265ec]/80">ID: {px._id?.toString().slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {px.pdfBase64 && (
                      <button 
                        onClick={() => downloadPDF(px.pdfBase64, `Prescription_${px._id}.pdf`)}
                        className="bg-slate-900 hover:bg-[#5265ec] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-slate-900/10 transition-all flex items-center gap-2.5 active:scale-95 group/btn"
                      >
                        <svg className="w-5 h-5 transition-transform group-hover/btn:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        Download PDF Copy
                      </button>
                    )}
                    <div className="bg-blue-50 text-[#5265ec] px-5 py-3 rounded-2xl text-sm font-extrabold border border-blue-100 shadow-sm whitespace-nowrap">
                      Diagnosis: {px.diagnosis}
                    </div>
                  </div>
                </div>
                
                {px.clinicalNotes && (
                  <div className="mb-8 p-6 rounded-3xl bg-slate-50/50 border border-gray-100 relative group-hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                       <svg className="w-4 h-4 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                       <span className="text-[10px] uppercase tracking-widest font-black text-[#5265ec]">Clinical Observations</span>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">{px.clinicalNotes}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {px.medicines && px.medicines.map((med, idx) => (
                    <div key={idx} className="flex flex-col bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:border-[#5265ec]/30 hover:shadow-md transition-all group/med">
                      <div className="font-extrabold text-slate-800 text-lg mb-4 flex items-center justify-between">
                        {med.name}
                        <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover/med:bg-green-600 group-hover/med:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center bg-slate-50 rounded-2xl px-4 py-2.5">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Dosage</span>
                            <span className="font-bold text-slate-700">{med.dosage}</span>
                         </div>
                         <div className="flex justify-between items-center bg-slate-50 rounded-2xl px-4 py-2.5">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Frequency</span>
                            <span className="font-bold text-slate-700">{med.frequency}</span>
                         </div>
                         <div className="flex justify-between items-center bg-blue-50/50 rounded-2xl px-4 py-2.5 ring-1 ring-blue-100">
                            <span className="text-[10px] uppercase font-bold text-[#5265ec]/70">Duration</span>
                            <span className="font-bold text-[#5265ec]">{med.duration}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsView;
