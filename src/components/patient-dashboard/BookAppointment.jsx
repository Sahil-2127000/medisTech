import React, { useState, useEffect } from 'react';

const BookAppointment = ({ onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [isDayOff, setIsDayOff] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Auto-select the Clinic's singular Doctor transparently
  useEffect(() => {
    // Fetch user profile to pre-fill patient name if desired, or just leave empty
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user.fullName) setPatientName(user.fullName);

    fetch('http://localhost:5001/api/auth/doctors', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
         if (data && data.length > 0) {
            setSelectedDoctor(data[0]._id);
         }
      })
      .catch(console.error);
  }, []);

  // Strict 20 Day Max Restrictor logic
  const minDate = new Date().toISOString().split('T')[0];
  const maxDateRaw = new Date();
  maxDateRaw.setDate(maxDateRaw.getDate() + 20);
  const maxDate = maxDateRaw.toISOString().split('T')[0];

  // 2. Poll Slot Mathematics from Availability Grid when Date/Doc changes
  useEffect(() => {
    if (selectedDoctor && date) {
      setLoading(true);
      setErrorMessage('');
      fetch(`http://localhost:5001/api/appointments/slots?doctorId=${selectedDoctor}&date=${date}`, { credentials: 'include' })
        .then(res => res.json().then(data => ({ status: res.status, data })))
        .then(({ status, data }) => {
           if (status !== 200) {
              setSlots([]);
              setIsDayOff(false);
              setErrorMessage(data.message || 'Blockout Array Check');
           } else {
              setSlots(data.slots || []);
              setIsDayOff(!!data.isOff);
           }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSlots([]);
      setIsDayOff(false);
      setErrorMessage('');
    }
  }, [selectedDoctor, date]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !selectedSlot) return;

    try {
      const res = await fetch('http://localhost:5001/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          doctorId: selectedDoctor,
          date,
          time: selectedSlot,
          patientName,
          symptoms
        })
      });
      if (res.ok) {
        alert("Appointment successfully locked!");
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to book slot");
        setLoading(true);
        // Brutally force reload to clear taken slots
        fetch(`http://localhost:5001/api/appointments/slots?doctorId=${selectedDoctor}&date=${date}`, { credentials: 'include' })
          .then(r => r.json())
          .then(d => { setSlots(d.slots || []); setIsDayOff(!!d.isOff); setSelectedSlot(''); })
          .finally(() => setLoading(false));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#021024]/40 z-50 flex justify-center items-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl p-8 relative overflow-hidden">
        
        {/* Decorative Top Blur */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5265ec] rounded-full opacity-10 blur-3xl pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Book Native Slot</h2>
        <p className="text-sm font-semibold text-gray-400 mb-8">Securely parsing mathematical doctor availability arrays directly from MongoDB.</p>

        <form onSubmit={handleBook} className="space-y-6 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1">
              <label className="block text-xs font-black text-[#5265ec] tracking-widest uppercase mb-2">Patient Full Name</label>
              <input 
                type="text" 
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="Who is this visit for?"
                className="w-full bg-white text-slate-800 font-bold border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="block text-xs font-black text-[#5265ec] tracking-widest uppercase mb-2">Select Date</label>
              <input 
                type="date" 
                min={minDate}
                max={maxDate}
                value={date ? date.split('-').reverse().join('-') : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setDate(e.target.value.split('-').reverse().join('-'));
                    setSelectedSlot('');
                  } else {
                    setDate('');
                    setSelectedSlot('');
                  }
                }}
                className="w-full bg-white text-slate-800 font-bold border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm cursor-pointer hover:border-blue-200"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
             <label className="text-xs font-bold uppercase tracking-widest text-[#5265ec]">Calculated Bookable Slots</label>
             <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 min-h-[100px] flex flex-wrap gap-3">
               {!date ? (
                  <div className="w-full flex items-center justify-center text-sm font-bold text-gray-400">Select Date to generate array globally</div>
               ) : loading ? (
                  <div className="w-full flex items-center justify-center text-sm font-bold text-[#5265ec] animate-pulse">Calculating Native Splits...</div>
               ) : isDayOff ? (
                  <div className="w-full flex items-center justify-center text-sm font-bold text-red-500 bg-red-50 py-3 rounded-lg border border-red-100">The clinic is closed on the selected date.</div>
               ) : slots.length === 0 ? (
                  <div className="w-full flex items-center justify-center text-sm font-bold text-gray-500 bg-gray-50 py-3 rounded-lg border border-gray-100">No time slots found for this date.</div>
               ) : (
                  slots.map((slot, i) => (
                    <button 
                      type="button" 
                      key={i} 
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-transparent ${selectedSlot === slot.time ? 'bg-[#5265ec] text-white shadow-md shadow-blue-500/30' : 'bg-white text-slate-600 border border-gray-200 hover:border-[#5265ec] hover:text-[#5265ec]'}`}
                    >
                      {slot.time}
                    </button>
                  ))
               )}
             </div>
          </div>

          <div className="flex flex-col space-y-1">
             <label className="text-xs font-bold uppercase tracking-widest text-[#5265ec]">Symptoms & Notes</label>
             <textarea 
               value={symptoms}
               onChange={e => setSymptoms(e.target.value)}
               placeholder="Describe your reasoning..."
               className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-[#5265ec] rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none transition-colors resize-none h-20"
             />
          </div>

          <button 
             type="submit" 
             disabled={!selectedSlot}
             className={`w-full py-4 rounded-2xl font-extrabold text-lg transition-all flex items-center justify-center gap-2 ${selectedSlot ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
             Complete Booking Validation
          </button>

        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
