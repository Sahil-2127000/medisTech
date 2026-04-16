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
              className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#5265ec]/10 transition-all cursor-pointer group flex flex-col items-center text-center relative overflow-hidden"
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
          <div className="bg-white/40 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center p-10 hover:border-[#5265ec]/20 hover:bg-blue-50/20 transition-all cursor-pointer group opacity-60 hover:opacity-100">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-300 group-hover:text-[#5265ec] transition-colors mb-4">
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
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar bg-transparent relative">
      
      {/* Header with Back Button (if Multiple) */}
      <div className="mb-10 animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            {isFamilyAccount && (
              <button 
                onClick={() => setSelectedMember(null)}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-[#5265ec] transition-all hover:shadow-md active:scale-90"
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
            <div className="bg-white rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6">
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
                className="group bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-[#5265ec]/5 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6">
                  {/* Date Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:bg-[#5265ec]/5 group-hover:text-[#5265ec] transition-colors shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(px.createdAt).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-2xl font-black leading-none">{new Date(px.createdAt).getDate()}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-[#5265ec] transition-colors line-clamp-1">{currentMember.name}</h3>
                    <div className="flex items-center gap-4 mt-1.5 font-bold">
                       <span className="text-xs uppercase text-[#5265ec] tracking-widest">Dr. {px.doctorId?.fullName || 'Specialist'}</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-100"></span>
                       <span className="text-xs uppercase text-gray-400 tracking-widest">{px.diagnosis || 'General Checkup'}</span>
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-100"></span>
                       <span className="text-xs text-gray-400">{px.medicines?.length || 0} Medicines</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 align-self-end lg:align-self-center">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Digital Prescription</div>
                    <div className="text-xs font-mono font-bold text-slate-400">#{(px._id || 'RX').toString().slice(-6).toUpperCase()}</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#5265ec] group-hover:text-white transition-all shadow-inner">
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setActivePrescription(null)}
        >
          {/* Frosted Glass Background */}
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl transition-all"></div>

          {/* Prescription Card (Glassmorphism Content) */}
          <div 
            className="relative w-full max-w-[850px] bg-white/70 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden animate-slide-up border border-white/40 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Elegant Header X Button */}
            <button 
              onClick={() => setActivePrescription(null)}
              className="absolute top-10 right-10 w-14 h-14 rounded-2xl bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all z-20 group"
            >
              <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="p-10 md:p-16 flex-1 overflow-y-auto no-scrollbar">
              
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
              <div className="flex items-center gap-8 mb-16">
                <div className="w-24 h-24 rounded-[2.5rem] bg-linear-to-tr from-[#5265ec] to-blue-400 flex items-center justify-center text-white shadow-2xl relative">
                   <div className="absolute inset-0 rounded-[2.5rem] bg-white opacity-20 animate-pulse"></div>
                   <svg className="w-12 h-12 relative z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-800 leading-none">Prescription from</h2>
                  <h3 className="text-4xl font-black text-[#5265ec] tracking-tighter mt-1">Dr. {activePrescription.doctorId?.fullName}</h3>
                  <div className="flex items-center gap-3 mt-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <span>{new Date(activePrescription.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Medicine Table Flow */}
              <div className="space-y-6">
                {activePrescription.medicines.map((med, i) => {
                  const freq = med.frequency || '';
                  const isM = freq.includes('Morning');
                  const isA = freq.includes('Afternoon');
                  const isN = freq.includes('Night');
                  const pattern = `(${isM ? '1' : '0'}-${isA ? '1' : '0'}-${isN ? '1' : '0'})`;
                  const food = freq.includes('(') ? freq.split('(')[1].replace(')', '') : 'After Food';
                  
                  return (
                    <div key={i} className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-3 mb-1 flex-wrap justify-center md:justify-start">
                           <span className="text-2xl font-black text-slate-800">{med.name} {med.dosage}</span>
                           <span className="text-lg font-black text-[#5265ec] bg-blue-50 px-3 py-1 rounded-xl tracking-tighter">{pattern}</span>
                        </div>
                        <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.3em] font-mono">For {med.duration || '5 Days'}</span>
                      </div>

                      {/* 3-Column Layout Indicators */}
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center gap-2">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${isM ? 'bg-[#5265ec] text-white shadow-lg shadow-[#5265ec]/20' : 'bg-slate-100 text-slate-300'}`}>
                              {isM ? '1' : '0'}
                           </div>
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Morning</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${isA ? 'bg-[#5265ec] text-white shadow-lg shadow-[#5265ec]/20' : 'bg-slate-100 text-slate-300'}`}>
                              {isA ? '1' : '0'}
                           </div>
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Afternoon</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${isN ? 'bg-[#5265ec] text-white shadow-lg shadow-[#5265ec]/20' : 'bg-slate-100 text-slate-300'}`}>
                              {isN ? '1' : '0'}
                           </div>
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Night</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Instructions */}
              <div className="mt-12 p-10 rounded-[3rem] bg-[#5265ec] text-white flex items-center justify-between shadow-2xl shadow-[#5265ec]/40 overflow-hidden relative">
                 <div className="absolute inset-0 bg-linear-to-r from-white/0 to-white/10"></div>
                 <div className="relative z-10">
                    <h4 className="font-black text-xl mb-1">Medicinal Guidance</h4>
                    <p className="text-white/70 text-sm font-medium">Follow prescriptions strictly. If a dose is missed, contact your doctor.</p>
                 </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF Template for Generation */}
      {activePrescription && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div id="pdf-template" style={{ width: '800px', minHeight: '1130px', backgroundColor: 'white', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
                   <div style={{ fontSize: '10px', fontWeight: '900', color: '#ffffff', backgroundColor: '#0d9488', padding: '2px 12px', borderRadius: '20px' }}>
                      Duration: {activePrescription.medicines?.[0]?.duration || 'Course'}
                   </div>
                </div>
                <div style={{ display: 'flex', gap: '30px', paddingRight: '20px' }}>
                   <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#999', width: '30px', textAlign: 'center' }}>Morn</div>
                   <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#999', width: '30px', textAlign: 'center' }}>Aftn</div>
                   <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#999', width: '30px', textAlign: 'center' }}>Nite</div>
                </div>
             </div>

             {/* Medicines List Row-Style */}
             <div style={{ padding: '10px 60px', flex: 1, position: 'relative' }}>
                {activePrescription.medicines.map((med, i) => {
                   const freq = med.frequency || '';
                   const isM = freq.includes('Morning');
                   const isA = freq.includes('Afternoon');
                   const isN = freq.includes('Night');
                   
                   return (
                      <div key={i} style={{ padding: '15px 0', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center' }}>
                         <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '16px', fontWeight: '900', color: '#1a1a1a' }}>{i+1}. {med.name}</div>
                            <div style={{ fontSize: '10px', fontWeight: '800', color: '#0d9488', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{med.dosage} • {med.food || 'After Food'}</div>
                         </div>
                         
                         <div style={{ display: 'flex', gap: '30px', paddingRight: '20px' }}>
                            <div style={{ width: '30px', textAlign: 'center', fontSize: '18px', fontWeight: '900', color: isM ? '#0d9488' : '#eee' }}>{isM ? '1' : '0'}</div>
                            <div style={{ width: '30px', textAlign: 'center', fontSize: '18px', fontWeight: '900', color: isA ? '#0d9488' : '#eee' }}>{isA ? '1' : '0'}</div>
                            <div style={{ width: '30px', textAlign: 'center', fontSize: '18px', fontWeight: '900', color: isN ? '#0d9488' : '#eee' }}>{isN ? '1' : '0'}</div>
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
                   <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '120px', borderBottom: '1px solid rgba(255,255,255,0.4)', marginBottom: '5px' }}></div>
                      <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>Signature</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Global Transition Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(100px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default DocumentsView;
