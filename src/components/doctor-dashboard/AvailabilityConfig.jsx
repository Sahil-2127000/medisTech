import React, { useState, useEffect } from 'react';

const AvailabilityConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [weeklyConfig, setWeeklyConfig] = useState([]);
  const [slotDuration, setSlotDuration] = useState(20);
  const [bufferTime, setBufferTime] = useState(2);
  const [blackoutDates, setBlackoutDates] = useState([]);
  const [customDateInput, setCustomDateInput] = useState('');

  // 1. Fetch Master Configuration from Backend
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/availability/config', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setWeeklyConfig(data.weeklyConfig || []);
          setSlotDuration(data.slotDuration || 10);
          setBufferTime(data.bufferTime || 1);
          setBlackoutDates(data.blackoutDates || []);
        }
      } catch (err) {
        console.error("Network binding completely failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleToggleDay = (index) => {
    const updated = [...weeklyConfig];
    updated[index].isOff = !updated[index].isOff;
    if (updated[index].isOff) updated[index].slots = [];
    else updated[index].slots = [{ start: "09:00", end: "17:00" }];
    setWeeklyConfig(updated);
  };

  const addTimeBlock = (index) => {
    const updated = [...weeklyConfig];
    updated[index].slots.push({ start: "12:00", end: "13:00" });
    setWeeklyConfig(updated);
  };

  const removeTimeBlock = (dayIndex, slotIndex) => {
    const updated = [...weeklyConfig];
    updated[dayIndex].slots.splice(slotIndex, 1);
    setWeeklyConfig(updated);
  };

  const updateTime = (dayIndex, slotIndex, type, value) => {
    const updated = [...weeklyConfig];
    updated[dayIndex].slots[slotIndex][type] = value;
    setWeeklyConfig(updated);
  };

  const addBlackoutDate = (dateString) => {
    if (dateString && !blackoutDates.includes(dateString)) {
      setBlackoutDates([...blackoutDates, dateString]);
    }
  };

  const removeBlackoutDate = (dateString) => {
    setBlackoutDates(blackoutDates.filter(d => d !== dateString));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:5001/api/availability/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ weeklyConfig, slotDuration, bufferTime, blackoutDates })
      });
      if (response.ok) alert('Availability Successfully Saved!');
    } catch {
      alert("Failed to connect to database.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-full bg-slate-50/30">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-clinic-600 rounded-full animate-spin mb-4"></div>
        <div className="text-clinic-600 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Updating...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar py-12 px-8 flex flex-col items-center bg-transparent">
      <div className="w-full max-w-6xl space-y-10">
        
        {/* Header Block: Glassmorphism Gradient */}
        <div className="relative group overflow-hidden bg-linear-to-r from-clinic-600 to-blue-400 rounded-[3rem] p-10 shadow-2xl shadow-blue-500/20">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Availability Timings</h2>
              <p className="text-blue-50 font-bold opacity-80 text-sm max-w-lg leading-relaxed">Customize your clinical shifts, slot timings, and blackout dates.</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`bg-white text-clinic-600 px-10 py-5 rounded-4xl font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95 ${saving ? 'opacity-50' : 'hover:bg-blue-50 hover:shadow-2xl'}`}
            >
              {saving ? 'Syncing...' : 'Publish Shifts'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Recurring Schedule Cards */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2 px-6">
               <h3 className="text-xl font-black text-slate-800 tracking-tight">Weekly Recurring Schedule</h3>
               <div className="flex gap-4">
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 py-2 flex flex-col items-center shadow-sm">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Slot Duration</span>
                    <div className="flex items-center gap-1">
                      <input type="number" value={slotDuration} onChange={e => setSlotDuration(e.target.value)} className="w-9 text-sm font-black text-clinic-600 bg-transparent outline-none text-center" />
                      <span className="text-[10px] font-bold text-slate-400 lowercase">min</span>
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 py-2 flex flex-col items-center shadow-sm">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Buffer Time</span>
                    <div className="flex items-center gap-2">
                      <input type="number" value={bufferTime} onChange={e => setBufferTime(e.target.value)} className="w-8 text-sm font-black text-amber-500 bg-transparent outline-none text-center" />
                      <span className="text-[10px] font-bold text-slate-400 lowercase">hr</span>
                    </div>
                  </div>
               </div>
            </div>

            {weeklyConfig.map((dayConfig, dIndex) => (
              <div key={dayConfig.day} className={`group bg-blue-20 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-4 transition-all duration-300 ${dayConfig.isOff ? 'border-gray-100/50 opacity-60 grayscale' : 'border-gray-300 shadow-md shadow-gray-400 hover:scale-[1.01] hover:bg-blue-50 hover:shadow-blue-500/10'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Day Toggle Area */}
                  <div className="flex items-center gap-2 min-w-[150px]">
                    <button 
                      onClick={() => handleToggleDay(dIndex)}
                      className={`w-14 h-8 rounded-full flex items-center p-1.5 transition-all duration-500 ${dayConfig.isOff ? 'bg-slate-200' : 'bg-clinic-600'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${dayConfig.isOff ? '' : 'translate-x-6'}`}></div>
                    </button>
                    <span className={`text-lg font-black tracking-tight ${dayConfig.isOff ? 'text-slate-400' : 'text-slate-800'}`}>{dayConfig.day}</span>
                  </div>

                  {/* Slot Editor Area */}
                  <div className="flex-1">
                    {dayConfig.isOff ? (
                      <div className="flex items-center gap-2 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                        <span className="text-xs font-black uppercase tracking-widest italic">Clinic Closed</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3 items-center">
                        {dayConfig.slots.map((slot, sIndex) => (
                          <div key={sIndex} className="bg-slate-50 border border-slate-200/50 rounded-2xl px-4 py-3 flex items-center gap-3 transition-all hover:border-clinic-600/30 group/slot relative">
                            <input 
                              type="time" 
                              value={slot.start} 
                              onChange={e => updateTime(dIndex, sIndex, 'start', e.target.value)} 
                              className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer" 
                            />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                            <input 
                              type="time" 
                              value={slot.end} 
                              onChange={e => updateTime(dIndex, sIndex, 'end', e.target.value)} 
                              className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer" 
                            />
                            <button 
                              onClick={() => removeTimeBlock(dIndex, sIndex)}
                              className="ml-2 w-6 h-6 flex items-center justify-center rounded-lg bg-white/80 text-rose-500 shadow-sm hover:bg-rose-500 hover:text-white transition-all scale-0 group-hover/slot:scale-100"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => addTimeBlock(dIndex)}
                          className="bg-blue-50/50 text-clinic-600 px-4 py-3 rounded-2xl border border-dashed border-clinic-600/30 text-[10px] font-black uppercase tracking-widest hover:bg-clinic-600 hover:text-white hover:border-transparent transition-all active:scale-95"
                        >
                          + Split Shift
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar: Exception Management */}
          <div className="lg:col-span-4 space-y-8 sticky top-8">
             <div className="bg-white backdrop-blur-xl border border-gray-300 rounded-[2.5rem] p-8 shadow-lg shadow-gray-400 transition-all">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   </div>
                   <h4 className="text-xl font-black text-slate-800 tracking-tight">Custom Off-Days</h4>
                </div>

                <div className="flex gap-3 mb-8">
                   <input 
                     type="date" 
                     value={customDateInput ? customDateInput.split('-').reverse().join('-') : ''}
                     onChange={(e) => setCustomDateInput(e.target.value ? e.target.value.split('-').reverse().join('-') : '')}
                     className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-clinic-600/20 transition-all shadow-inner" 
                   />
                   <button 
                     onClick={() => { if(customDateInput) addBlackoutDate(customDateInput); setCustomDateInput(''); }}
                     className="bg-slate-800 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all active:scale-95 shadow-lg"
                   >
                     Block
                   </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
                   {blackoutDates.map((date, i) => (
                      <div key={i} className="group flex justify-between items-center bg-slate-50 hover:bg-white hover:shadow-md hover:ring-1 hover:ring-rose-200 px-5 py-4 rounded-3xl transition-all duration-300">
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-slate-800 tracking-tight">{date}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Medical Exception</span>
                         </div>
                         <button 
                           onClick={() => removeBlackoutDate(date)}
                           className="w-8 h-8 rounded-xl bg-white text-rose-500 shadow-sm flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all scale-90 group-hover:scale-100"
                         >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                         </button>
                      </div>
                   ))}
                   {blackoutDates.length === 0 && (
                     <div className="text-center py-10 opacity-30 select-none">
                        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Exceptions Logged</p>
                     </div>
                   )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AvailabilityConfig;
