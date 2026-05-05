import React, { useState, useEffect } from 'react';

const OfflineBookingModal = ({ onClose, onSuccess }) => {
  const formatTime12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    date: '',
    symptoms: ''
  });
  
  const [doctorId, setDoctorId] = useState('');
  const [slots, setSlots] = useState([]);
  const [isDayOff, setIsDayOff] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user.id) setDoctorId(user.id);
  }, []);

  // Strict restrictions for dates
  const minDate = new Date().toISOString().split('T')[0];
  const maxDateRaw = new Date();
  maxDateRaw.setDate(maxDateRaw.getDate() + 20);
  const maxDate = maxDateRaw.toISOString().split('T')[0];

  // Fetch slots
  useEffect(() => {
    if (doctorId && formData.date) {
      setLoadingSlots(true);
      setErrorMsg('');
      fetch(`http://localhost:5001/api/appointments/slots?doctorId=${doctorId}&date=${formData.date}`, { credentials: 'include' })
        .then(res => res.json().then(data => ({ status: res.status, data })))
        .then(({ status, data }) => {
           if (status !== 200) {
              setSlots([]);
              setIsDayOff(false);
              setErrorMsg(data.message || 'Error fetching slots');
           } else {
              setSlots(data.slots || []);
              setIsDayOff(!!data.isOff);
           }
        })
        .catch(console.error)
        .finally(() => setLoadingSlots(false));
    } else {
      setSlots([]);
      setIsDayOff(false);
    }
  }, [doctorId, formData.date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return alert("Please select a valid time slot.");
    
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5001/api/appointments/offline-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          time: selectedSlot
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        onSuccess();
        onClose();
      } else {
        alert(data.message || "Failed to book offline appointment.");
        // Reload slots
        fetch(`http://localhost:5001/api/appointments/slots?doctorId=${doctorId}&date=${formData.date}`, { credentials: 'include' })
          .then(r => r.json())
          .then(d => { setSlots(d.slots || []); setIsDayOff(!!d.isOff); setSelectedSlot(''); });
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
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-clinic-600 rounded-full opacity-10 blur-3xl pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Walk-in Patient Registration </h2>
        <p className="text-sm font-semibold text-gray-400 mb-8">Register walk-in patients</p>

        <form onSubmit={handleBook} className="space-y-6 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="block text-[10px] font-black text-clinic-600 tracking-widest uppercase">Patient Full Name</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-clinic-400 focus:ring-2 focus:ring-clinic-200" placeholder="Patient name" />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="block text-[10px] font-black text-clinic-600 tracking-widest uppercase">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-clinic-400 focus:ring-2 focus:ring-clinic-200" placeholder="patient@gmail.com" />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="block text-[10px] font-black text-clinic-600 tracking-widest uppercase">Phone Number</label>
              <div className="flex items-center w-full bg-slate-50 border border-gray-100 rounded-xl focus-within:border-clinic-400 focus-within:ring-2 focus-within:ring-clinic-200 transition-all overflow-hidden">
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
                  <label className="block text-[10px] font-black text-clinic-600 tracking-widest uppercase">Age</label>
                  <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-clinic-400 focus:ring-2 focus:ring-clinic-200" placeholder="25" />
                </div>
                <div className="flex-1 flex flex-col space-y-1">
                  <label className="block text-[10px] font-black text-clinic-600 tracking-widest uppercase">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-clinic-400 focus:ring-2 focus:ring-clinic-200">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="block text-[10px] font-black text-clinic-600 tracking-widest uppercase">Select Date</label>
              <input 
                type="date" 
                name="date"
                required
                min={minDate}
                max={maxDate}
                value={formData.date ? formData.date.split('-').reverse().join('-') : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setFormData({...formData, date: e.target.value.split('-').reverse().join('-')});
                    setSelectedSlot('');
                  } else {
                    setFormData({...formData, date: ''});
                    setSelectedSlot('');
                  }
                }}
                className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-clinic-400 focus:ring-2 focus:ring-clinic-200"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1">
             <label className="text-[10px] font-black uppercase tracking-widest text-clinic-600">Calculated Bookable Slots</label>
             <div className="bg-clinic-50/50 border border-clinic-100 rounded-xl p-4 min-h-[80px] flex flex-wrap gap-2">
               {!formData.date ? (
                  <div className="w-full flex items-center justify-center text-xs font-bold text-gray-400">Select Date to generate slots</div>
               ) : loadingSlots ? (
                  <div className="w-full flex items-center justify-center text-xs font-bold text-clinic-600 animate-pulse">Calculating Native Splits...</div>
               ) : isDayOff ? (
                  <div className="w-full flex items-center justify-center text-xs font-bold text-red-500 bg-red-50 py-2 rounded-lg">The clinic is closed on this date.</div>
               ) : slots.length === 0 ? (
                  <div className="w-full flex items-center justify-center text-xs font-bold text-gray-500 bg-gray-50 py-2 rounded-lg">No time slots found.</div>
               ) : (
                  slots.map((slot, i) => (
                    <button 
                      type="button" 
                      key={i} 
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 ${selectedSlot === slot.time ? 'bg-clinic-600 text-white shadow-md shadow-clinic-600/30' : 'bg-white text-slate-600 border border-gray-200 hover:border-clinic-600 hover:text-clinic-600'}`}
                    >
                      {formatTime12Hour(slot.time)}
                    </button>
                  ))
               )}
             </div>
             {errorMsg && <p className="text-red-500 text-xs font-bold mt-1">{errorMsg}</p>}
          </div>

          <div className="flex flex-col space-y-1">
             <label className="text-[10px] font-black uppercase tracking-widest text-clinic-600">Symptoms & Notes</label>
             <textarea 
               name="symptoms"
               value={formData.symptoms}
               onChange={handleChange}
               placeholder="Why are they visiting?"
               className="w-full bg-slate-50 border border-gray-100 focus:bg-white focus:border-clinic-600 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors resize-none h-20"
             />
          </div>

          <button 
             type="submit" 
             disabled={!selectedSlot || submitting}
             className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 ${selectedSlot && !submitting ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
             {submitting ? 'Processing Network Request...' : 'Finalize Walk-In Booking'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default OfflineBookingModal;
