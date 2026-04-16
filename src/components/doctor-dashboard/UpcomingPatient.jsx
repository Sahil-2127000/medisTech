import React from 'react';

const UpcomingPatient = ({ appointments, onStatusChange, renderPatientCard }) => {
  const todayRaw = new Date();
  const todayFormatted = `${String(todayRaw.getDate()).padStart(2, '0')}-${String(todayRaw.getMonth() + 1).padStart(2, '0')}-${todayRaw.getFullYear()}`;

  const nextPatient = appointments
    .filter(app => app.date === todayFormatted && app.status === 'approved')
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="flex-1 bg-white rounded-[2rem] p-8 shadow-xl shadow-blue-500/5 border border-gray-50 flex flex-col h-full">
      <h3 className="text-xl font-extrabold transition-colors mb-3 text-slate-800">Next Upcoming Patient</h3>
      <div className="flex-1 flex flex-col justify-center">
        {nextPatient ? (
          <div className="w-full">
            {renderPatientCard(nextPatient)}
            <button onClick={() => onStatusChange(nextPatient.id, 'in_progress')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all shadow-md mt-4 flex items-center justify-center gap-2 text-base active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              Attend this patient now
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-60 py-12">
             <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
            <p className="text-gray-400 font-bold text-center text-sm px-4">No more upcoming patients in queue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingPatient;
