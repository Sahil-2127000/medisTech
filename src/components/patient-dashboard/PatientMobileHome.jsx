import React from 'react';

// Patient home for phones / the app: quick actions, next visit, compact stats and vitals.
const Icon = ({ d, className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>
);

const toDate = (date, time) => {
  const [d, m, y] = (date || '').split('-').map(Number);
  const [h, min] = (time || '00:00').split(':').map(Number);
  return new Date(y, m - 1, d, h, min);
};

const STATUS = {
  approved: ['Confirmed', 'bg-emerald-50 text-emerald-600'],
  pending: ['Awaiting approval', 'bg-amber-50 text-amber-600'],
  emergency_active: ['Delayed', 'bg-red-50 text-red-600'],
};

const PatientMobileHome = ({ patientData, completedCount, onBook, onTabChange, onAddVital }) => {
  const upcoming = [...(patientData.upcoming || [])].sort((a, b) => toDate(a.date, a.time) - toDate(b.date, b.time));
  const next = upcoming[0];
  const total = (patientData.upcoming?.length || 0) + (patientData.history?.length || 0);
  const vital = (type, fallback) => patientData.vitals?.find(v => v.type === type)?.value || fallback;

  const actions = [
    ['Book', 'M12 4v16m8-8H4', onBook, 'bg-[#3963F9] text-white'],
    ['Live Queue', 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', () => onTabChange('queue'), 'bg-violet-50 text-violet-600'],
    ['Records', 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', () => onTabChange('docs'), 'bg-teal-50 text-teal-600'],
    ['Add Vitals', 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', onAddVital, 'bg-rose-50 text-rose-500'],
  ];

  return (
    <div className="lg:hidden space-y-5">
      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2">
        {actions.map(([label, d, onClick, tone]) => (
          <button key={label} onClick={onClick} className="flex flex-col items-center gap-1.5 active:opacity-70">
            <span className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tone}`}><Icon d={d} /></span>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* Next visit */}
      <section>
        <h2 className="text-[15px] font-bold text-slate-900 dark:text-white mb-2">Next visit</h2>
        {next ? (
          <button onClick={() => onTabChange('calendar')} className="w-full text-left bg-linear-to-br from-[#3963F9] to-[#1444D8] text-white rounded-2xl p-4 active:opacity-90">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-base truncate">{next.doctor}</div>
                <div className="text-xs text-blue-100 mt-0.5 truncate">For {next.patientName || 'you'}</div>
              </div>
              <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md ${(STATUS[next.status] || ['Booked', 'bg-white/20 text-white'])[1]}`}>
                {(STATUS[next.status] || ['Booked'])[0]}
              </span>
            </div>
            <div className="flex gap-2 mt-4">
              <span className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5 text-sm font-semibold">
                <Icon className="w-4 h-4" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                {toDate(next.date, next.time).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5 text-sm font-semibold">
                <Icon className="w-4 h-4" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                {toDate(next.date, next.time).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          </button>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-blue-50 text-[#3963F9] flex items-center justify-center shrink-0"><Icon d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-800 dark:text-white">No upcoming visits</div>
              <div className="text-xs text-slate-400">Book a slot at a clinic near you</div>
            </div>
            <button onClick={onBook} className="shrink-0 bg-[#3963F9] text-white text-xs font-bold px-3 py-2 rounded-lg">Book</button>
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-2">
        {[
          ['Visits', total, () => onTabChange('calendar')],
          ['Prescriptions', patientData.prescriptionsCount || 0, () => onTabChange('docs')],
          ['Completed', completedCount, () => onTabChange('calendar', '?filter=completed')],
        ].map(([label, value, onClick]) => (
          <button key={label} onClick={onClick} className="bg-white dark:bg-slate-800 rounded-2xl py-3 border border-slate-100 dark:border-slate-700 active:bg-slate-50">
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</div>
            <div className="text-[11px] font-semibold text-slate-400">{label}</div>
          </button>
        ))}
      </section>

      {/* Vitals */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Latest vitals</h2>
          <button onClick={onAddVital} className="text-xs font-bold text-[#3963F9]">Update</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Blood pressure', vital('Blood Pressure', '--'), 'mmHg', 'text-emerald-600'],
            ['Heart rate', vital('Heart Rate', '--'), 'bpm', 'text-rose-500'],
            ['Sugar', vital('Blood Sugar', '--'), 'mg/dL', 'text-amber-500'],
          ].map(([label, value, unit, tone]) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-100 dark:border-slate-700">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide truncate">{label}</div>
              <div className={`text-base font-extrabold mt-1 ${tone}`}>{value}</div>
              <div className="text-[10px] text-slate-400">{unit}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PatientMobileHome;
