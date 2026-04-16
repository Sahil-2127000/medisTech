import React, { useState } from 'react';

const CurrentPatient = ({ appointments, onFinishConsultation, onStatusChange, renderPatientCard }) => {
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [medicine, setMedicine] = useState('');
  const [timing, setTiming] = useState('');
  const [pdfBase64, setPdfBase64] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setPdfBase64(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const todayRaw = new Date();
  const todayFormatted = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;

  const activePatient = appointments.find(app => app.date === todayFormatted && app.status === 'in_progress');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!medicine || !timing || !activePatient) return;
    onStatusChange(activePatient.id, 'completed');
    onFinishConsultation(activePatient.id, activePatient.patientId, {
      medicine,
      timing,
      date: todayFormatted,
      pdfBase64
    });
    setShowPrescriptionModal(false);
    setMedicine('');
    setTiming('');
    setPdfBase64('');
  };

  return (
    <div className="flex-1 bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-500/5 border border-gray-50 flex flex-col h-full relative">
      <div className="flex justify-between items-center w-full mb-3">
        <h3 className="text-xl font-extrabold text-slate-800">Active Consultation</h3>
        {activePatient && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {activePatient ? (
          <div className="w-full">
            {renderPatientCard(activePatient)}
            <button onClick={() => setShowPrescriptionModal(true)}
              className="w-full bg-clinic-600 hover:bg-clinic-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-base mt-4 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Finish Consultation
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-70 py-12">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <p className="text-gray-400 font-bold text-center text-sm px-6">You have no active patients right now.</p>
          </div>
        )}
      </div>

      {showPrescriptionModal && activePatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 relative shadow-2xl animate-scale-in">
            <button onClick={() => setShowPrescriptionModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-colors">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-3xl font-black text-slate-800 mb-2">Write Prescription</h3>
            <p className="text-slate-500 font-medium mb-8">Discharging <strong className="text-[#5265ec]">{activePatient.name}</strong> securely.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Clinical Medicine</label>
                <input value={medicine} onChange={(e) => setMedicine(e.target.value)} required
                  placeholder="e.g. Paracetamol 500mg" className="w-full bg-slate-50 border-2 border-transparent focus:border-[#5265ec] focus:bg-white text-slate-800 rounded-2xl p-4 transition-all shadow-sm font-bold placeholder:text-slate-300 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Usage Timing</label>
                <input value={timing} onChange={(e) => setTiming(e.target.value)} required
                  placeholder="e.g. 1-0-1 after meals for 5 days" className="w-full bg-slate-50 border-2 border-transparent focus:border-[#5265ec] focus:bg-white text-slate-800 rounded-2xl p-4 transition-all shadow-sm font-bold placeholder:text-slate-300 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Upload Digital Copy (PDF)</label>
                <div className="relative group">
                   <input type="file" accept=".pdf" onChange={handleFileChange}
                    className="w-full opacity-0 absolute inset-0 cursor-pointer z-10"
                  />
                  <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-[#5265ec] group-hover:bg-blue-50/30 rounded-2xl p-4 transition-all flex items-center justify-center gap-3 text-slate-500 font-bold">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    <span>{pdfBase64 ? "PDF Selected" : "Click to select file"}</span>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-green-500/30 flex items-center justify-center gap-3 text-xl mt-4 active:scale-95">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Complete Consultation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentPatient;
