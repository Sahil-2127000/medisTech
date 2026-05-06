import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookAppointment = ({ onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [isDayOff, setIsDayOff] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientName, setPatientName] = useState(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    return user.firstName || (user.fullName ? user.fullName.split(' ')[0] : '');
  });
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // 1. Auto-select the Clinic's singular Doctor transparently
  useEffect(() => {

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
    if (!selectedDoctor || !date || !selectedSlot || isBooking) return;
    setIsBooking(true);

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
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#021024]/40 dark:bg-black/80 z-50 flex justify-center items-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] w-full max-w-2xl shadow-2xl p-8 relative overflow-hidden">

        {/* Decorative Top Blur */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5265ec] rounded-full opacity-10 blur-3xl pointer-events-none"></div>

        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">Book Native Slot</h2>
        <p className="text-sm font-semibold text-gray-400 dark:text-slate-500 mb-8">Securely parsing mathematical doctor availability arrays directly from MongoDB.</p>

        <form onSubmit={handleBook} className="space-y-6 relative z-10">
          <style>{`
            .react-datepicker { font-family: inherit; font-size: 0.95rem; border-radius: 1.2rem; border: 1px solid #e2e8f0; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); padding: 0.75rem; background-color: white; z-index: 100; }
            .react-datepicker-wrapper { width: 100%; }
            .react-datepicker__header { background-color: white; border-bottom: none; padding-top: 0.25rem; }
            .react-datepicker__current-month { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem; }
            .react-datepicker__day-name { width: 2.2rem; line-height: 2.2rem; margin: 0.15rem; font-weight: 800; color: #94a3b8; font-size: 0.8rem; }
            .react-datepicker__day { width: 2.2rem; line-height: 2.2rem; margin: 0.15rem; border-radius: 0.6rem; font-weight: 700; color: #334155; transition: all 0.2s; }
            .react-datepicker__day:hover { background-color: #EEF2FA; color: #5265ec; transform: scale(1.1); }
            .react-datepicker__day--selected { background-color: #5265ec !important; color: white !important; box-shadow: 0 4px 14px 0 rgba(82, 101, 236, 0.39); transform: scale(1.1); }
            .react-datepicker__day--keyboard-selected { background-color: transparent; }
            .react-datepicker__day--disabled { color: #cbd5e1; pointer-events: none; }
            .react-datepicker__navigation { top: 1.25rem; }
            
            /* Dark Mode Support */
            .dark .react-datepicker { background-color: #1e293b; border-color: #334155; }
            .dark .react-datepicker__header { background-color: #1e293b; }
            .dark .react-datepicker__current-month { color: white; }
            .dark .react-datepicker__day-name { color: #64748b; }
            .dark .react-datepicker__day { color: #e2e8f0; }
            .dark .react-datepicker__day:hover { background-color: #334155; color: white; }
            .dark .react-datepicker__day--disabled { color: #475569; }
          `}</style>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-1">
              <label className="block text-xs font-black text-[#5265ec] dark:text-blue-400 tracking-widest uppercase mb-2">Patient Full Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="Who is this visit for?"
                className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col space-y-1 relative">
              <label className="block text-xs font-black text-[#5265ec] dark:text-blue-400 tracking-widest uppercase mb-2">Select Date</label>
              <div className="relative">
                <DatePicker
                  selected={date ? new Date(date.split('-').reverse().join('-')) : null}
                  onChange={(d) => {
                    if (d) {
                      const day = String(d.getDate()).padStart(2, '0');
                      const month = String(d.getMonth() + 1).padStart(2, '0');
                      const year = d.getFullYear();
                      setDate(`${day}-${month}-${year}`);
                    } else {
                      setDate('');
                    }
                    setSelectedSlot('');
                  }}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  maxDate={new Date(new Date().setDate(new Date().getDate() + 20))}
                  placeholderText="DD/MM/YYYY"
                  className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all shadow-sm cursor-pointer hover:border-blue-200"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5265ec] dark:text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-[#5265ec] dark:text-blue-400">Calculated Bookable Slots</label>
            <div className="bg-blue-50/50 dark:bg-slate-800/50 border border-blue-100 dark:border-white/5 rounded-2xl p-4 min-h-[100px] flex flex-wrap gap-3">
              {!date ? (
                <div className="w-full flex items-center justify-center text-sm font-bold text-gray-400 dark:text-slate-500">Select Date to generate array globally</div>
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
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-slate-900/50 disabled:text-gray-400 disabled:border-transparent ${selectedSlot === slot.time ? 'bg-[#5265ec] text-white shadow-md shadow-blue-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-white/10 hover:border-[#5265ec] dark:hover:border-blue-400 hover:text-[#5265ec] dark:hover:text-blue-400'}`}
                  >
                    {slot.time}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-[#5265ec] dark:text-blue-400">Symptoms & Notes</label>
            <textarea
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="Describe your reasoning..."
              className="w-full bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-white/5 focus:bg-white dark:focus:bg-slate-700 focus:border-[#5265ec] dark:focus:border-blue-400 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white outline-none transition-colors resize-none h-20"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedSlot || isBooking}
            className={`w-full py-4 rounded-2xl font-extrabold text-lg transition-all flex items-center justify-center gap-2 ${selectedSlot && !isBooking ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 active:scale-95' : 'bg-gray-200 dark:bg-slate-700 text-gray-400 cursor-not-allowed'}`}
          >
            {isBooking ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Locking Slot...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Complete Booking Validation
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
