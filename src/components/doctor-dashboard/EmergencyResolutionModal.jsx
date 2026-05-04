import React, { useState } from 'react';

const EmergencyResolutionModal = ({ onClose, onSuccess, elapsedMinutes }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    symptoms: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdAppt, setCreatedAppt] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

    try {
      const res = await fetch('http://localhost:5001/api/appointments/emergency-resolve-and-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          elapsedMinutes,
          date: dateStr
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setCreatedAppt(data.appointment);
        setIsSuccess(true);
      } else {
        alert(data.message || "Failed to resolve emergency.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#021024]/40 z-[999] flex justify-center items-center p-4 animate-fade-in backdrop-blur-sm overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl p-8 relative my-auto">
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600 rounded-full opacity-10 blur-3xl pointer-events-none animate-pulse"></div>

        {!isSuccess && (
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-full p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}

        <h2 className="text-3xl font-extrabold text-red-600 mb-2">{isSuccess ? 'Success!' : 'Emergency Resolution'}</h2>
        <p className="text-sm font-semibold text-gray-400 mb-6">
          {isSuccess ? 'Patient has been registered and queue adjusted.' : `Log the patient details. The queue will be automatically delayed by ${elapsedMinutes} minutes.`}
        </p>

        {isSuccess ? (
          <div className="flex flex-col items-center py-6 text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Protocol Completed</h3>
            <p className="text-slate-500 mb-8 font-medium px-10">The emergency case is now logged in history. Would you like to issue a prescription for this patient immediately?</p>
            
            <div className="flex gap-4 w-full">
               <button onClick={() => { onSuccess(); onClose(); }} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-xl font-extrabold transition-all active:scale-95">
                 Maybe Later
               </button>
               <button onClick={() => { onSuccess(createdAppt, true); onClose(); }} className="flex-1 bg-clinic-600 hover:bg-clinic-800 text-white py-4 rounded-xl font-extrabold shadow-lg shadow-clinic-600/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 Issue Prescription
               </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResolve} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="block text-[10px] font-black text-red-500/80 tracking-widest uppercase">Patient Full Name</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200" placeholder="Jane Doe" />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="block text-[10px] font-black text-red-500/80 tracking-widest uppercase">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200" placeholder="patient@gmail.com" />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="block text-[10px] font-black text-red-500/80 tracking-widest uppercase">Phone Number</label>
                <div className="flex items-center w-full bg-slate-50 border border-gray-100 rounded-xl focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-200 transition-all overflow-hidden">
                  <span className="pl-4 pr-3 py-3 text-sm font-bold text-gray-500 bg-gray-100/50 border-r border-gray-100 select-none">+91</span>
                  <input 
                    type="tel" 
                    name="phone" 
                    maxLength="10"
                    value={formData.phone ? formData.phone.replace('+91 ', '').replace('+91', '') : ''} 
                    onChange={(e) => {
                      const numericVal = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: numericVal ? `+91 ${numericVal}` : '' });
                    }} 
                    className="w-full bg-transparent px-4 py-3 text-sm font-bold focus:outline-none" 
                    placeholder="1234567890" 
                  />
                </div>
              </div>

              <div className="flex gap-4">
                  <div className="flex-1 flex flex-col space-y-1">
                    <label className="block text-[10px] font-black text-red-500/80 tracking-widest uppercase">Age</label>
                    <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200" placeholder="45" />
                  </div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <label className="block text-[10px] font-black text-red-500/80 tracking-widest uppercase">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-200">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-red-500/80">Symptoms & Reason</label>
               <textarea 
                 name="symptoms"
                 required
                 value={formData.symptoms}
                 onChange={handleChange}
                 placeholder="Why was the emergency triggered?"
                 className="w-full bg-slate-50 border border-gray-100 focus:bg-white focus:border-red-500 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors resize-none h-20"
               />
            </div>

            <button 
               type="submit" 
               disabled={submitting}
               className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${!submitting ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               {submitting ? 'Processing Network Request...' : 'Log & Resolve Emergency'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmergencyResolutionModal;
