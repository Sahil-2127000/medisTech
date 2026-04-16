import React, { useState } from 'react';
import PrescriptionBuilder from './PrescriptionBuilder';


const CurrentPatient = ({ appointments, onFinishConsultation, onStatusChange }) => {
 const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
 const [medicine, setMedicine] = useState('');
 const [timing, setTiming] = useState('');

 const todayRaw = new Date();
 const todayFormatted = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;

 // Find active appointment matching today
 const activePatient = appointments.find(app => app.date === todayFormatted && app.status === 'in_progress');

 // Find next upcoming appointment
 const nextPatient = appointments
 .filter(app => app.date === todayFormatted && app.status === 'approved')
 .sort((a, b) => a.time.localeCompare(b.time))[0];

  const handlePrescriptionSave = (medicinesArray, pdfBase64) => {
    if (!activePatient) return;
    // Explicitly update status to completed to clear it from in_progress
    onStatusChange(activePatient.id, 'completed');

    // Extract the raw MongoDB ObjectId from the populated patient payload securely natively
    const correctPatientId = activePatient.patientId?._id || activePatient.patientId;

    onFinishConsultation(activePatient.id, correctPatientId, {
      medicines: medicinesArray,
      pdfBase64: pdfBase64,
      date: todayFormatted
    });

 setShowPrescriptionModal(false);
 };

 const renderPatientCard = (patient) => {
 if (!patient) return null;
 const displayName = patient.name || (patient.patient && patient.patient.name) || "Walk-In";
 const displayChar = typeof displayName === 'string' && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : "W";

 return (
 <div className=" rounded-3xl p-5 shadow-xl shadow-blue-500/5 flex flex-col items-center text-center border border-gray-50 relative overflow-hidden transition-colors duration-300 w-full mb-4 shrink-0 px-8 ">
 <div className="absolute w-24 h-24 bg-blue-500 rounded-full opacity-10 -right-5 -top-5 blur-xl "></div>
 <h2 className="text-xl font-black text-slate-800 mb-1 transition-colors">{displayName}</h2>
 <div className="text-xs font-bold text-clinic-600 bg-blue-50 px-3 py-1 rounded-full inline-block tracking-wider transition-colors">
 {patient.age || "--"} yrs • {patient.gender || "Unknown"}
 </div>
 <div className="w-full mt-4 bg-slate-50 rounded-2xl p-3 flex justify-between items-center text-left transition-colors">
 <div>
 <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider transition-colors">Scheduled Time</div>
 <div className="font-bold text-slate-700 transition-colors">{patient.time}</div>
 </div>
 <svg className="w-6 h-6 text-clinic-600/40 " fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
 </div>
 </div>
 );
 };

 return (
 <div className="w-full flex flex-col md:flex-row gap-6 bg-transparent transition-colors duration-300">
 {/* Left Part: Next Patient */}
    <div className="flex-1 p-6 bg-white border border-gray-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col relative transition-colors h-[340px] overflow-y-auto no-scrollbar shadow-xl shadow-clinic-600/20 overflow-hidden ">
      
 <h3 className="text-lg font-bold transition-colors mb-4 text-slate-700 shrink-0">Next Upcoming Patient</h3>
 {nextPatient ? (
 <>
 {renderPatientCard(nextPatient)}
 <button onClick={() => onStatusChange(nextPatient.id, 'in_progress')}
 className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl transition-all shadow-md mt-2 flex items-center justify-center gap-2 text-sm active:scale-95"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
 Attend this patient now
 </button>
 </>
 ) : (
 <div className="flex-1 flex flex-col items-center justify-center opacity-60 py-6">
 <p className="text-gray-400 font-medium text-center text-sm px-4 transition-colors">No more upcoming patients in queue.</p>
 </div>
 )}
 </div>

 {/* Right Part: Active Consultation */}
 <div className="flex-1 p-6 bg-white border border-gray-100 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center justify-start relative transition-colors h-[340px] overflow-y-auto no-scrollbar shadow-xl shadow-clinic-600/20 overflow-hidden">
 <div className="flex justify-between items-center w-full mb-4 shrink-0 ">
 <h3 className="text-xl font-bold transition-colors text-slate-700">Active Consultation</h3>
 {activePatient && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>}
 </div>

 {activePatient ? (
 <div className="w-full flex flex-col">
 {renderPatientCard(activePatient)}
 <button onClick={() => setShowPrescriptionModal(true)}
 className="w-full bg-clinic-600 hover:bg-clinic-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 text-base mt-2 active:scale-95"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
 Finish Consultation
 </button>
 </div>
 ) : (
 <div className="flex-1 flex flex-col items-center justify-center opacity-60">
 <svg className="w-16 h-16 text-gray-300 mb-4 transition-colors" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
 <p className="text-gray-400 font-medium text-center text-sm px-6 transition-colors">You have no active patients right now. Select an upcoming patient to start.</p>
 </div>
 )}
 </div>

 {/* Embedded Full Screen Prescription Builder */}
 {showPrescriptionModal && activePatient && (
 <PrescriptionBuilder 
 activePatient={activePatient}
 onCancel={() => setShowPrescriptionModal(false)}
 onSave={handlePrescriptionSave}
 />
 )}

 </div>
 );
};

export default CurrentPatient;
