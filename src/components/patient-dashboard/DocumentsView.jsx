import React, { useState } from 'react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';


const DocumentsView = ({ prescriptions = [], patientData }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [activePrescription, setActivePrescription] = useState(null);

  // Mock Family Members for "Condition B"
  // In a real app, this would come from an API endpoint like /api/family/members
  // Real-time Logic: Use only authenticated user data
  const familyMembers = patientData.familyMembers || [
    { id: 'self', name: patientData.name || 'User', avatar: `https://placehold.co/100x100/5265ec/ffffff.png?text=${(patientData.name || 'U').charAt(0)}` }
  ];

  // Map prescriptions to real members
  const allRecords = {
    self: prescriptions
  };

  // 1. SMART ROUTING LOGIC (Conditional Display)
  const isFamilyAccount = familyMembers.length > 1;
  const initialMember = isFamilyAccount ? null : familyMembers[0];
  const currentMember = selectedMember || initialMember;

  // Render the selection screen if Condition B is met and no one is selected
  if (isFamilyAccount && !selectedMember) {
    return (
      <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar bg-transparent animate-fade-in">
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold text-[#021024] tracking-tight">Family Selection</h1>
          <p className="text-gray-400 font-medium mt-1">Select a family member to view their medical prescriptions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {familyMembers.map(member => (
            <div 
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-white rounded-[3rem] p-10 border border-[#5265ec]/30 shadow-sm hover:shadow-2xl hover:shadow-[#5265ec]/10 transition-all cursor-pointer group flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-100 transition-colors"></div>
              
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden mb-6 shadow-lg ring-4 ring-blue-50 group-hover:scale-110 transition-transform relative z-10">
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-1 relative z-10">{member.name}</h3>
              <p className="text-xs font-bold text-[#5265ec] uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full relative z-10">View {allRecords[member.id]?.length || 0} Records</p>
              
              <div className="mt-8 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#5265ec] group-hover:text-white transition-all shadow-inner relative z-10">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}

          {/* Add member button */}
          <div className="bg-white/40 rounded-[3rem] border-4 border-dashed border-[#5265ec]/20 flex flex-col items-center justify-center p-10 hover:border-[#5265ec]/40 hover:bg-blue-50/20 transition-all cursor-pointer group opacity-60 hover:opacity-100">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#5265ec]/30 group-hover:text-[#5265ec] transition-colors mb-4">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            </div>
            <span className="font-extrabold text-gray-400 group-hover:text-[#5265ec]">Add Member</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. TIMELINE VIEW (Condition A or B After Selection)
  const currentPrescriptions = allRecords[currentMember.id] || [];

  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar bg-slate-50/50 relative">
      
      {/* Header with Back Button (if Multiple) */}
      <div className="mb-10 animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            {isFamilyAccount && (
              <button 
                onClick={() => setSelectedMember(null)}
                className="w-10 h-10 rounded-xl bg-white border border-[#5265ec]/30 shadow-sm flex items-center justify-center text-slate-400 hover:text-[#5265ec] transition-all hover:shadow-md active:scale-90"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}
            <h1 className="text-4xl font-extrabold text-[#021024] tracking-tight">Prescription Records</h1>
          </div>

        </div>

        <div className="flex items-center gap-3">
           <img src={currentMember.avatar} alt="avatar" className="w-12 h-12 rounded-2xl border-4 border-white shadow-md" />
           <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{currentPrescriptions.length} Records</div>
        </div>
      </div>

      {/* The Prescription Timeline */}
      <div className="flex-1">
        <div className="space-y-6">
          {currentPrescriptions.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 flex flex-col items-center justify-center text-center border border-[#5265ec]/10">
              <div className="w-20 h-20 bg-blue-50 text-[#5265ec]/20 rounded-3xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Prescriptions Issued</h3>
              <p className="text-gray-400 text-sm mt-2">Any records issued by the doctor will appear here chronologically.</p>
            </div>
          ) : (
            currentPrescriptions.map((px, i) => (
              <div 
                key={px._id || i} 
                onClick={() => setActivePrescription(px)}
                className="group relative bg-white rounded-[2.5rem] p-7 border border-[#5265ec]/40 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] transition-all duration-500 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden active:scale-[0.98] ring-1 ring-[#5265ec]/20 hover:ring-[#5265ec]/40"
              >
                {/* Visual Accent Gradient (hidden by default, revealed on hover) */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5265ec] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-7 relative z-10">
                  {/* High-Contrast Date Badge */}
                  <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-white shadow-xl group-hover:from-[#5265ec] group-hover:to-[#3963F9] transition-all duration-500 shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-60 mb-0.5">{new Date(px.createdAt).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-3xl font-black">{new Date(px.createdAt).getDate()}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-[#021024] tracking-tight group-hover:text-[#5265ec] transition-colors leading-tight mb-2 uppercase">{currentMember.name}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                       <div className="flex items-center gap-1.5 bg-[#5265ec]/10 px-3.5 py-1.5 rounded-full border border-[#5265ec]/10">
                          <svg className="w-3.5 h-3.5 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                          <span className="text-[10px] font-black text-[#5265ec] uppercase tracking-wider">Dr. {px.doctorId?.fullName || 'Specialist'}</span>
                       </div>
                       
                       <div className="flex items-center gap-1.5 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
                          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{px.diagnosis || 'Evaluation'}</span>
                       </div>

                       <div className="flex items-center gap-1.5 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100">
                          <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.638.319a4 4 0 01-1.833.446H8.442a1 1 0 01-1-1V6.26c0-.287.12-.56.333-.756L10 3.333m-1.583 6.167L3.417 9.5M3.417 9.5L1 12l2.417 2.5m0-10l-2.417 2.5L2.417 7.5"/></svg>
                          <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider">{px.medicines?.length || 0} Meds</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 relative z-10 lg:ml-auto">
                  <div className="text-right hidden sm:block">
                    <div className="text-[9px] font-black text-[#5265ec] uppercase tracking-[0.2em] mb-1 opacity-50">Auth Node Signature</div>
                    <div className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-[#5265ec]/10 shadow-inner">#{(px._id || 'RX').toString().slice(-6).toUpperCase()}</div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-[0_4px_10px_rgb(0,0,0,0.05)] border border-[#5265ec]/10 flex items-center justify-center text-slate-400 group-hover:bg-[#5265ec] group-hover:text-white group-hover:shadow-[0_10px_20px_rgb(82,101,236,0.3)] group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. INTERACTION & VISUAL DESIGN (Glass Overlay) */}
      {activePrescription && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in bg-slate-950/40"
          style={{ backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }}
          onClick={() => setActivePrescription(null)}
        >
          {/* Transparent click catcher */}
          <div className="absolute inset-0"></div>

          {/* Prescription Card (Glassmorphism Content) */}
          <div 
            className="relative w-full max-w-[850px] max-h-[90vh] bg-white/70 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden animate-slide-up border border-[#5265ec]/50 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Elegant Header X Button */}
            <button 
              onClick={() => setActivePrescription(null)}
              className="absolute top-10 right-10 w-14 h-14 rounded-2xl bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all z-20 group"
            >
              <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="p-10 md:p-16 flex-1 flex flex-col overflow-hidden">
              
              {/* Action Buttons */}
              <div className="absolute top-10 right-28 flex gap-3 z-20">
                 <button 
                   onClick={async () => {
                     const element = document.getElementById('pdf-template');
                     if (!element) return;
                     try {
                        const imgData = await htmlToImage.toPng(element, { pixelRatio: 2, backgroundColor: '#ffffff' });
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        pdf.save(`Prescription_${activePrescription._id || 'Record'}.pdf`);
                     } catch (err) { console.error(err); }
                   }}
                   className="px-6 py-3 rounded-2xl bg-[#0d9488] text-white font-black flex items-center gap-2 hover:bg-[#0b7a6d] transition-all shadow-lg shadow-[#0d9488]/20"
                 >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12"/></svg>
                    Download PDF
                 </button>
              </div>
              {/* Header: Dr. Name */}
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-[#5265ec] to-blue-400 flex items-center justify-center text-white shadow-xl relative">
                   <div className="absolute inset-0 rounded-2xl bg-white opacity-20 animate-pulse"></div>
                   <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 leading-none">Prescription from</h2>
                  <h3 className="text-3xl font-black text-[#5265ec] tracking-tighter mt-1">Dr. {activePrescription.doctorId?.fullName}</h3>
                  <div className="flex items-center gap-3 mt-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <span>{new Date(activePrescription.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Medicine Table Flow */}
              <div className="flex-1 overflow-y-auto pr-4 space-y-6 medicine-scroll">
                {activePrescription.medicines.map((med, i) => {
                  const freq = med.frequency || '';
                  const isM = freq.includes('Morning');
                  const isA = freq.includes('Afternoon');
                  const isN = freq.includes('Night');
                  const pattern = `(${isM ? '1' : '0'}-${isA ? '1' : '0'}-${isN ? '1' : '0'})`;
                  
                  return (
                    <div key={i} className="bg-white/40 backdrop-blur-md rounded-[1.5rem] border border-[#5265ec]/30 p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap justify-center md:justify-start">
                           <span className="text-xl font-black text-slate-800">{med.name} {med.dosage}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50/50 w-fit px-3 py-1 rounded-full border border-blue-100/30">
                           <svg className="w-3.5 h-3.5 text-[#5265ec]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           <span className="text-[11px] font-bold text-slate-600">
                             For <span className="text-[#5265ec] font-black">{med.duration?.toLowerCase().includes('day') ? med.duration : `${med.duration} Days`}</span>
                           </span>
                        </div>
                      </div>

                      {/* 3-Column Layout Indicators */}
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1.5">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${isM ? 'bg-[#5265ec] text-white shadow-lg shadow-[#5265ec]/20' : 'bg-slate-100 text-slate-300'}`}>
                               {isM ? '1' : '0'}
                           </div>
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Morning</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${isA ? 'bg-[#5265ec] text-white shadow-lg shadow-[#5265ec]/20' : 'bg-slate-100 text-slate-300'}`}>
                               {isA ? '1' : '0'}
                           </div>
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Afternoon</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${isN ? 'bg-[#5265ec] text-white shadow-lg shadow-[#5265ec]/20' : 'bg-slate-100 text-slate-300'}`}>
                               {isN ? '1' : '0'}
                           </div>
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Night</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Instructions */}
              <div className="mt-8 p-6 rounded-[2rem] bg-[#5265ec] text-white flex items-center justify-between shadow-2xl shadow-[#5265ec]/40 overflow-hidden relative">
                 <div className="absolute inset-0 bg-linear-to-r from-white/0 to-white/10"></div>
                 <div className="relative z-10">
                    <h4 className="font-black text-lg mb-1">Medicinal Guidance</h4>
                    <p className="text-white/70 text-xs font-medium">Follow prescriptions strictly. If a dose is missed, contact your doctor.</p>
                 </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF Template for Generation */}
      {activePrescription && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div id="pdf-template" style={{ width: '800px', minHeight: '1130px', backgroundColor: 'white', position: 'relative', display: 'flex', flexDirection: 'column' }}>
             {/* Header Wave */}
             <div style={{ height: '180px', backgroundColor: '#0d9488', position: 'relative' }}>
                <div style={{ padding: '40px 60px', color: 'white' }}>
                   <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0 }}>Dr. {activePrescription.doctorId?.fullName || 'Specialist'}</h1>
                   <p style={{ fontSize: '14px', fontWeight: '700', opacity: 0.9 }}>M.B.B.S, M.D. (Internal Medicine)</p>
                </div>
                <svg style={{ position: 'absolute', bottom: 0, width: '100%', height: '80px' }} viewBox="0 0 1440 320" preserveAspectRatio="none">
                  <path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
             </div>

             {/* Graphic Horizontal Watermark */}
             <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', zIndex: 0, opacity: 0.04 }}>
                <div style={{ fontSize: '100px', fontWeight: '900', color: '#0d9488', letterSpacing: '-5px', position: 'relative' }}>
                   MedicsTech
                   <div style={{ position: 'absolute', bottom: '-10px', left: 0, width: '100%', height: '8px', background: 'linear-gradient(90deg, transparent, #0d9488, transparent)' }}></div>
                </div>
                {/* Visual Tech Graphics */}
                <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
                   {[1,2,3,4,5].map(v => (
                      <div key={v} style={{ width: '40px', height: '40px', border: '2px solid #0d9488', borderRadius: '10px', transform: 'rotate(45deg)' }}></div>
                   ))}
                </div>
             </div>

             {/* Patient Info */}
             <div style={{ padding: '60px 60px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', fontSize: '14px', position: 'relative' }}>
                <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                   <span style={{ color: '#aaa', fontWeight: 'bold' }}>Patient :</span>
                   <span style={{ fontWeight: '900', color: '#1a1a1a', marginLeft: '10px' }}>{currentMember.name}</span>
                </div>
                <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                   <span style={{ color: '#aaa', fontWeight: 'bold' }}>Date :</span>
                   <span style={{ fontWeight: '900', color: '#1a1a1a', marginLeft: '10px' }}>{new Date(activePrescription.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                   <span style={{ color: '#aaa', fontWeight: 'bold' }}>Age/Gender :</span>
                   <span style={{ fontWeight: '900', color: '#1a1a1a', marginLeft: '10px' }}>{patientData.age || '--'} Yrs • {patientData.gender || '---'}</span>
                </div>
                <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                   <span style={{ color: '#aaa', fontWeight: 'bold' }}>Diagnosis :</span>
                   <span style={{ fontWeight: '900', color: '#1a1a1a', marginLeft: '10px' }}>{activePrescription.diagnosis || 'General evaluation'}</span>
                </div>
             </div>

             {/* Medicines Header Row */}
             <div style={{ padding: '40px 60px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0d9488', paddingBottom: '10px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <div style={{ fontSize: '14px', fontWeight: '900', color: '#0d9488', textTransform: 'uppercase', letterSpacing: '2px' }}>Clinical Prescription</div>

                </div>
                <div style={{ display: 'flex', gap: '20px', paddingRight: '10px' }}>
                </div>
              </div>              {/* Medicines List Row-Style */}
              <div style={{ padding: '30px 60px', flex: 1, position: 'relative' }}>
                 {activePrescription.medicines.map((med, i) => {
                    const freq = med.frequency || '';
                    const isM = freq.includes('Morning');
                    const isA = freq.includes('Afternoon');
                    const isN = freq.includes('Night');
                    
                    return (
                       <div key={i} style={{ padding: '20px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1 }}>
                             <div style={{ fontSize: '18px', fontWeight: '900', color: '#111827' }}>{i+1}. {med.name} {med.dosage}</div>
                             <div style={{ display: 'flex', marginTop: '10px' }}>
                                <div style={{ backgroundColor: '#ecfdf5', padding: '4px 12px', borderRadius: '12px', fontSize: '10px', fontWeight: '900', color: '#0d9488', border: '1px solid #d1fae5', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                   For {med.duration?.toLowerCase().includes('day') ? med.duration : `${med.duration} Days`}
                                </div>
                             </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '20px', paddingRight: '10px' }}>
                             {/* Morning */}
                             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isM ? '#0d9488' : '#f9fafb', color: isM ? 'white' : '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900' }}>
                                   {isM ? '1' : '0'}
                                </div>
                                <span style={{ fontSize: '7px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase' }}>Morn</span>
                             </div>
                             {/* Afternoon */}
                             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isA ? '#0d9488' : '#f9fafb', color: isA ? 'white' : '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900' }}>
                                   {isA ? '1' : '0'}
                                </div>
                                <span style={{ fontSize: '7px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase' }}>Aftn</span>
                             </div>
                             {/* Night */}
                             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: isN ? '#0d9488' : '#f9fafb', color: isN ? 'white' : '#d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '900' }}>
                                   {isN ? '1' : '0'}
                                </div>
                                <span style={{ fontSize: '7px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase' }}>Night</span>
                             </div>
                          </div>
                       </div>
                    );
                 })}
              </div>

             {/* Footer Wave */}
             <div style={{ marginTop: 'auto', minHeight: '130px', backgroundColor: '#0d9488', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '30px 60px' }}>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '80px', transform: 'rotate(180deg)' }} viewBox="0 0 1440 320" preserveAspectRatio="none">
                  <path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: 'white', position: 'relative', zIndex: 10 }}>
                   <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '900', margin: 0 }}>Pulse Health Clinic</h4>
                      <p style={{ fontSize: '10px', fontWeight: 'bold', opacity: 0.8, margin: '2px 0 0' }}>123 Clinical Way, Medica Sector • 000-000-0000</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Global Transition Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .medicine-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .medicine-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .medicine-scroll::-webkit-scrollbar-thumb {
          background: #5265ec;
          border-radius: 10px;
        }
        .medicine-scroll::-webkit-scrollbar-thumb:hover {
          background: #4254d3;
        }
        .medicine-scroll {
          scrollbar-width: thin;
          scrollbar-color: #5265ec rgba(0, 0, 0, 0.05);
        }
      `}} />
    </div>
  );
};

export default DocumentsView;
