import React, { useState, useEffect } from 'react';

const AvailabilityConfig = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [holidayYear, setHolidayYear] = useState(new Date().getFullYear());
  const [publicHolidays, setPublicHolidays] = useState([]);
  
  // Core Configuration States mapping purely to MongoDB architecture
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
        } else {
          console.error("Failed to fetch core availability structure.");
        }
      } catch (err) {
        console.error("Network binding completely failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // 2. Fetch standard Holidays (Nager.Date) uniquely defaulting to IN timezone parameters
  // useEffect(() => {
  //   const fetchHolidays = async () => {
  //     try {
  //       const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${holidayYear}/IN`);
  //       if (res.ok) {
  //         try {
  //            const data = await res.json();
  //            setPublicHolidays(data);
  //         } catch (jsonErr) {
  //            console.warn("Holiday API returned 200 OK but invalid/empty JSON natively.", jsonErr);
  //            setPublicHolidays([]);
  //         }
  //       } else {
  //          setPublicHolidays([]); // Fallback safely gracefully if API year explicitly undefined
  //       }
  //     } catch (err) {
  //       console.error("Failed explicitly calling public holiday API", err);
  //     }
  //   };
  //   fetchHolidays();
  // }, [holidayYear]);

  // UI Event Handlers
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

  const addBlackoutDate = (dateString, description = "") => {
    if (!blackoutDates.includes(dateString)) {
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
        body: JSON.stringify({
          weeklyConfig,
          slotDuration,
          bufferTime,
          blackoutDates
        })
      });
      if (!response.ok) throw new Error("Binding save layout structurally failed.");
      alert('Availability Successfully Saved & Dispatched natively!');
    } catch (err) {
      alert("Failed explicitly connecting to database router.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return <div className="flex-1 flex justify-center items-center h-full text-[#5265ec] font-bold text-xl animate-pulse">Initializing Layout Mathematics...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar py-12 px-8 flex justify-center bg-[#fafcff] dark:bg-slate-800 transition-colors duration-300">
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm p-8 transition-colors">
          <div>
            <h2 className="text-3xl font-extrabold text-[#021024] dark:text-white mb-2 transition-colors">Availability Matrix</h2>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 max-w-xl transition-colors">Configure split-shifts natively dictating how many patient slots are generated globally per day.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="mt-6 md:mt-0 flex items-center gap-3 bg-[#5265ec] dark:bg-blue-600 hover:bg-[#4355d1] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#5265ec]/30 transition-all active:scale-95"
          >
            {saving ? 'Saving Config...' : (
               <><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Publish Availability</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
           
           {/* Left Core Component: Weekly Recurring Calendar Map */}
           <div className="xl:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] shadow-sm p-8 transition-colors">
             <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Weekly Recurring Master</h3>
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase text-[#5265ec] dark:text-blue-400 mb-1 transition-colors">Slot Duration (Mins)</label>
                    <input type="number" min="5" max="120" value={slotDuration} onChange={e => setSlotDuration(e.target.value)} className="w-20 bg-[#EEF2FA] dark:bg-slate-800 text-slate-800 dark:text-gray-100 font-bold rounded-xl px-3 py-2 outline-none text-center transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold uppercase text-amber-500 dark:text-amber-400 mb-1 transition-colors">Buffer Blocks (Hrs)</label>
                    <input type="number" min="0" max="24" value={bufferTime} onChange={e => setBufferTime(e.target.value)} className="w-20 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold rounded-xl px-3 py-2 outline-none text-center transition-colors" />
                  </div>
                </div>
             </div>

             <div className="space-y-4">
                {weeklyConfig.map((dayConfig, dIndex) => (
                   <div key={dayConfig.day} className={`flex flex-col md:flex-row items-start md:items-center p-5 rounded-2xl border transition-colors ${dayConfig.isOff ? 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700/50 opacity-60' : 'bg-[#fafcff] dark:bg-slate-800 border-[#EEF2FA] dark:border-slate-700'}`}>
                      <div className="w-32 flex items-center justify-between mb-4 md:mb-0 mr-6">
                        <span className="font-bold text-slate-800 dark:text-gray-200 transition-colors">{dayConfig.day}</span>
                        <button 
                           onClick={() => handleToggleDay(dIndex)}
                           className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors ${dayConfig.isOff ? 'bg-gray-300 dark:bg-slate-600' : 'bg-[#5265ec]'}`}
                        >
                           <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${dayConfig.isOff ? '' : 'translate-x-5'}`}></div>
                        </button>
                      </div>

                      <div className="flex-1 w-full space-y-3">
                        {dayConfig.isOff ? (
                           <span className="text-sm font-bold text-gray-400 dark:text-gray-500 italic transition-colors">Explicitly designated as off-duty</span>
                        ) : (
                           <>
                             {dayConfig.slots.map((slot, sIndex) => (
                               <div key={sIndex} className="flex gap-3 items-center">
                                 <input type="time" value={slot.start} onChange={e => updateTime(dIndex, sIndex, 'start', e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg text-sm font-bold outline-none transition-colors" />
                                 <span className="text-gray-400 dark:text-gray-500 font-bold transition-colors">to</span>
                                 <input type="time" value={slot.end} onChange={e => updateTime(dIndex, sIndex, 'end', e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg text-sm font-bold outline-none transition-colors" />
                                 <button onClick={() => removeTimeBlock(dIndex, sIndex)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                 </button>
                               </div>
                             ))}
                             <button onClick={() => addTimeBlock(dIndex)} className="text-[11px] font-bold text-[#5265ec] dark:text-blue-400 uppercase tracking-widest hover:underline transition-colors">+ Add Split Shift</button>
                           </>
                        )}
                      </div>
                   </div>
                ))}
             </div>
           </div>

           {/* Right Configuration: Explicit Blackouts & Holiday Integration */}
           <div className="space-y-8">
             
             {/* Immediate Exceptions Sync */}
             <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] shadow-sm p-8 transition-colors">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 transition-colors">Custom Ad-Hoc Days</h3>
                
                <div className="flex gap-2 mb-6">
                   <input 
                     type="date" 
                     value={customDateInput ? customDateInput.split('-').reverse().join('-') : ''}
                     onChange={(e) => {
                       if (e.target.value) {
                         setCustomDateInput(e.target.value.split('-').reverse().join('-'));
                       } else {
                         setCustomDateInput('');
                       }
                     }}
                     className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-white px-3 py-2 rounded-xl text-sm font-bold outline-none transition-colors" 
                   />
                   <button 
                     onClick={() => { if(customDateInput) addBlackoutDate(customDateInput); setCustomDateInput(''); }}
                     className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                   >Block</button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 no-scrollbar">
                  {blackoutDates.length === 0 && <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold transition-colors">No custom exceptions mapped.</span>}
                  {blackoutDates.map((date, i) => (
                    <div key={i} className="flex justify-between items-center bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl border border-red-100 dark:border-red-900/40 transition-colors">
                      <span className="text-sm font-bold text-red-600 dark:text-red-400 transition-colors">{date}</span>
                      <button onClick={() => removeBlackoutDate(date)} className="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg></button>
                    </div>
                  ))}
                </div>
             </div>

             {/* External API Holiday Syncer */}
             {/* <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] shadow-sm p-8 overflow-hidden relative transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 blur-3xl opacity-10 rounded-full"></div>
                <h3 className="text-xl font-bold text-[#021024] dark:text-white mb-2 transition-colors">Public Holiday Sync</h3>
                <p className="text-[10px] uppercase font-bold text-[#5265ec] dark:text-blue-400 tracking-wider mb-6 transition-colors">Nager.Date Deep Integration (IN)</p>
                
                <div className="h-64 overflow-y-auto space-y-3 no-scrollbar pr-2">
                  {publicHolidays.map((holiday, i) => {
                     const isBlocked = blackoutDates.includes(holiday.date);
                     return (
                       <div key={i} className={`p-4 rounded-xl border transition-colors ${isBlocked ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/40' : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700'}`}>
                          <div className="flex justify-between items-start mb-2">
                             <div className="font-bold text-sm text-slate-800 dark:text-gray-200 transition-colors">{holiday.name}</div>
                             <span className="text-xs font-bold text-gray-500 dark:text-gray-400 transition-colors">{holiday.date}</span>
                          </div>
                          <button 
                            onClick={() => isBlocked ? removeBlackoutDate(holiday.date) : addBlackoutDate(holiday.date, holiday.name)}
                            className={`text-[10px] w-full py-1.5 rounded-lg font-bold uppercase tracking-widest transition-colors ${isBlocked ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-gray-300 shadow-sm'}`}
                          >
                             {isBlocked ? 'Blocked (Unmark)' : 'Mark as Off-Day'}
                          </button>
                       </div>
                     );
                  })}
                </div>
             </div> */}

           </div>

        </div>
      </div>
    </div>
  );
};

export default AvailabilityConfig;
