import React, { useMemo } from 'react';

const PatientHistoryView = ({ historyData, onBack }) => {
 // 1. Group records dynamically by robust Month/Year chronological string boundaries
 const groupedHistory = useMemo(() => {
 if (!historyData || historyData.length === 0) return {};
 return historyData.reduce((acc, appt) => {
 // Standardize date mapping fallback assuming native YYYY-MM-DD or DD-MM-YYYY structures
 let dateObj;
 if (appt.date.includes('-') && appt.date.split('-')[0].length === 4) {
 // YYYY-MM-DD
 dateObj = new Date(appt.date);
 } else if (appt.date.includes('-') && appt.date.split('-')[2].length === 4) {
 // DD-MM-YYYY (Convert securely)
 const [d, m, y] = appt.date.split('-');
 dateObj = new Date(`${y}-${m}-${d}`);
 } else {
 dateObj = new Date(appt.date);
 }
 const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 const monthYearStr = isNaN(dateObj.getTime()) ? "Unknown Date" : `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
 if (!acc[monthYearStr]) acc[monthYearStr] = [];
 acc[monthYearStr].push(appt);
 return acc;
 }, {});
 }, [historyData]);

 const groupKeys = Object.keys(groupedHistory);

  const [uploadModal, setUploadModal] = React.useState(null);
  const [docTitle, setDocTitle] = React.useState('');
  const [docType, setDocType] = React.useState('lab');
  const [docFileBase64, setDocFileBase64] = React.useState('');
  const [docFilename, setDocFilename] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => setDocFileBase64(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!docFileBase64 || !docTitle || !uploadModal) return;
    setIsUploading(true);
    try {
      await fetch('http://localhost:5001/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: docTitle,
          type: docType,
          patientId: uploadModal.patientId,
          fileBase64: docFileBase64,
          filename: docFilename
        })
      });
      setUploadModal(null);
    } catch {
      alert("Failed to upload document.");
    } finally {
      setIsUploading(false);
      setDocTitle('');
      setDocFileBase64('');
      setDocFilename('');
    }
  };

  return (
  <div className="flex-1 overflow-y-auto no-scrollbar py-8 w-full transition-colors duration-300 relative z-10 animate-fade-in">
  {/* Header Array Banner */}
  <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-transparent/90 backdrop-blur-md z-20 p-4 -mt-4 rounded-3xl border border-gray-100/50 shadow-sm">
  <div>
  <h2 className="text-3xl font-extrabold text-[#021024] transition-colors">Historical Registry</h2>
  <p className="text-sm font-semibold text-clinic-600 mt-1 transition-colors">Total Encounters: {historyData.length}</p>
  </div>
  <button onClick={onBack}
  className="bg-white text-slate-800 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm border border-gray-100 hover:bg-gray-50 flex items-center gap-2 hover:-translate-x-1"
  >
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
  Back to Dashboard
  </button>
  </div>

  {groupKeys.length === 0 ? (
  <div className="flex flex-col items-center justify-center p-20 opacity-60">
  <svg className="w-24 h-24 text-gray-300 mt-10 mb-6" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
  <p className="text-gray-400 font-bold text-lg">No internal chronological history found.</p>
  </div>
  ) : (
  groupKeys.map(monthLayer => (
  <div key={monthLayer} className="mb-10 block w-full px-2">
  {/* Chronological Sticky Header Node */}
  <div className="sticky top-[85px] z-10 w-full mb-6">
  <div className="inline-block bg-slate-50 border border-gray-200 text-clinic-600 font-black tracking-widest uppercase text-xs px-5 py-2 rounded-full shadow-sm">
  {monthLayer} — {groupedHistory[monthLayer].length} records
  </div>
  </div>

  {/* Grid Expansion Core */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-max w-full">
  {groupedHistory[monthLayer].map((app, appIdx) => {
  // Robust native mapping bindings
  const displayName = app.name || "Walk-In Entity";
  const displayChar = displayName.charAt(0).toUpperCase();
  return (
  <div key={app.id || 'hist_' + appIdx} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_15px_40px_rgba(82,101,236,0.08)] flex justify-between items-center group">
  <div className="flex items-center gap-4">
  <div className="w-14 h-14 rounded-[1.25rem] bg-linear-to-tr from-blue-100 to-indigo-50 flex items-center justify-center font-black text-xl text-clinic-600 shadow-inner overflow-hidden relative">
  {displayChar}
  </div>
  <div>
  <h3 className="text-lg font-bold text-slate-800 ">{displayName}</h3>
  <div className="text-xs font-semibold text-gray-400 flex items-center gap-2 mt-0.5">
  <span className="bg-gray-100 px-2 rounded-md">{app.age || '--'} yrs</span>
  <span className="bg-gray-100 px-2 rounded-md">{app.gender || 'Unknown'}</span>
  </div>
  </div>
  </div>
  <div className="flex flex-col items-end justify-between h-full gap-2">
  <div className="text-right">
    <div className="font-bold text-clinic-600 mb-1">{app.date} • {app.time}</div>
    {app.status === 'completed' && <span className="inline-block bg-gray-100 text-gray-500 font-bold text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg">Completed</span>}
    {app.status === 'approved' && <span className="inline-block bg-green-100 text-green-600 font-bold text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg">Approved</span>}
    {app.status === 'pending' && <span className="inline-block bg-yellow-100 text-yellow-600 font-bold text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg shadow-sm">Pending</span>}
    {app.status === 'rejected' && <span className="inline-block bg-red-100 text-red-500 font-bold text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg">Rejected</span>}
  </div>
  <button onClick={() => setUploadModal(app)} className="text-xs bg-blue-50 text-[#5265ec] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 group-hover:-translate-x-1 duration-200">
     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
     Upload Doc
  </button>
  </div>
  </div>
  );
  })}
  </div>
  </div>
  ))
  )}

  {uploadModal && (
  <div className="fixed inset-0 bg-transparent/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-fade-in border border-blue-50">
      <button onClick={() => setUploadModal(null)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
      <h3 className="text-2xl font-black text-slate-800 mb-2">Upload File</h3>
      <p className="text-sm font-medium text-gray-400 mb-6">Attach a record to <span className="text-clinic-600">{uploadModal.name}</span></p>
      
      <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Document Title</label>
          <input required type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="e.g. Comprehensive Blood Test" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-clinic-600 shadow-sm" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Document Type</label>
          <select required value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-clinic-600 shadow-sm appearance-none bg-white">
             <option value="lab">Lab Result</option>
             <option value="report">Medical Report</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">PDF File</label>
          <input required type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg" className="w-full border border-gray-200 rounded-xl p-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-clinic-600 hover:file:bg-blue-100 shadow-sm cursor-pointer" />
        </div>
        <button type="submit" disabled={isUploading} className="mt-4 bg-clinic-600 hover:bg-clinic-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95">
          {isUploading ? 'Uploading...' : 'Store Document Securely'}
        </button>
      </form>
    </div>
  </div>
  )}

  </div>
  );
};

export default PatientHistoryView;
