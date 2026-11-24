import React, { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../config/api';

// Doctor has to leave: cancel every booking of a day from a chosen time and e-mail the patients.
const pad = (n) => String(n).padStart(2, '0');
const toDDMMYYYY = (iso) => (iso ? iso.split('-').reverse().join('-') : '');
const time12 = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
};
const ACTIVE = ['pending', 'approved', 'emergency_active'];

const UnavailableModal = ({ onClose, onSuccess }) => {
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const nowHHMM = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [dateIso, setDateIso] = useState(todayIso);
  const [slots, setSlots] = useState([]);
  const [isOff, setIsOff] = useState(false);
  const [from, setFrom] = useState('');
  const [dayAppts, setDayAppts] = useState([]);
  const [closures, setClosures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const doctorId = JSON.parse(sessionStorage.getItem('user') || '{}').id;
  const date = toDDMMYYYY(dateIso);

  const loadClosures = () =>
    fetch(`${API_URL}/api/appointments/doctor/closures`, { credentials: 'include' })
      .then(r => (r.ok ? r.json() : []))
      .then(d => setClosures(Array.isArray(d) ? d : []))
      .catch(() => {});

  useEffect(() => { loadClosures(); }, []);

  // Slots of the chosen day (to pick the start time) and the bookings that would be affected
  useEffect(() => {
    if (!doctorId || !date) return;
    setLoading(true);
    setMessage('');
    Promise.all([
      fetch(`${API_URL}/api/appointments/slots?doctorId=${doctorId}&date=${date}`, { credentials: 'include' }).then(r => r.json()).catch(() => ({})),
      fetch(`${API_URL}/api/appointments/doctor?date=${date}`, { credentials: 'include' }).then(r => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([slotData, appts]) => {
      const times = (slotData.slots || []).map(s => s.time);
      setIsOff(!!slotData.isOff);
      setSlots(times);
      setDayAppts(Array.isArray(appts) ? appts : []);
      // Default start: the next slot from now (today), otherwise the first slot of the day
      const firstUpcoming = date === toDDMMYYYY(todayIso) ? times.find(t => t > nowHHMM) : times[0];
      setFrom(firstUpcoming || '');
    }).finally(() => setLoading(false));
  }, [date, doctorId]);

  const selectable = useMemo(
    () => slots.filter(t => date !== toDDMMYYYY(todayIso) || t > nowHHMM),
    [slots, date]
  );
  const affected = dayAppts.filter(a => ACTIVE.includes(a.status) && from && a.time >= from);

  const handleConfirm = async () => {
    if (!from || saving) return;
    const ok = window.confirm(
      `You will be marked unavailable on ${date} from ${time12(from)}.\n\n` +
      `${affected.length} appointment(s) will be cancelled and the patients will be informed by e-mail that they can reschedule.\n\nContinue?`
    );
    if (!ok) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/appointments/doctor/unavailable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ date, from }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setMessage(data.message || 'Could not update your availability.'); return; }
      alert(`${data.message}\n${data.cancelledCount} appointment(s) cancelled and the patients have been informed.`);
      onSuccess && onSuccess();
      onClose();
    } catch {
      setMessage('Could not update your availability. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const reopen = async (d) => {
    if (!window.confirm(`Open the slots on ${d} for booking again? Appointments that were already cancelled stay cancelled.`)) return;
    const res = await fetch(`${API_URL}/api/appointments/doctor/closures/${d}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    setMessage(data.message || '');
    loadClosures();
    onSuccess && onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-[#021024]/40 z-50 flex justify-center items-center p-0 sm:p-4 backdrop-blur-sm">
      <div className="app-compact-modal bg-white rounded-none sm:rounded-[2rem] w-full max-w-lg h-full sm:h-auto max-h-full overflow-y-auto no-scrollbar shadow-2xl px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1.25rem+env(safe-area-inset-top))] sm:p-6 relative">
        <button onClick={onClose} className="absolute top-[calc(1rem+env(safe-area-inset-top))] sm:top-5 right-4 sm:right-5 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-1 pr-10">Not Available</h2>
        <p className="text-sm font-semibold text-gray-400 mb-5">Have to leave? Remaining appointments from the chosen time will be cancelled and each patient gets an e-mail saying they can reschedule.</p>

        <label className="block text-[11px] font-black text-[#5265ec] tracking-widest uppercase mb-1.5">Date</label>
        <input
          type="date"
          value={dateIso}
          min={todayIso}
          onChange={e => setDateIso(e.target.value || todayIso)}
          className="w-full bg-white text-slate-800 font-bold border border-gray-200 rounded-xl px-4 py-2.5 mb-4 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />

        <label className="block text-[11px] font-black text-[#5265ec] tracking-widest uppercase mb-1.5">Unavailable from</label>
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-3 min-h-[70px] grid grid-cols-4 sm:grid-cols-5 content-start gap-2 mb-4">
          {loading ? (
            <div className="col-span-full text-sm font-bold text-[#5265ec] text-center py-2">Loading slots…</div>
          ) : isOff || selectable.length === 0 ? (
            <div className="col-span-full text-sm font-bold text-gray-500 text-center py-2">
              {isOff ? 'You are already off on this day.' : 'No remaining slots on this day.'}
            </div>
          ) : selectable.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setFrom(t)}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${from === t ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-slate-600 border border-gray-200 hover:border-rose-400 hover:text-rose-600'}`}
            >
              {time12(t)}
            </button>
          ))}
        </div>

        {from && !loading && (
          <div className="rounded-xl bg-rose-50 border border-rose-100 px-3 py-2.5 text-sm text-rose-700 font-semibold mb-4">
            {affected.length === 0
              ? `No bookings after ${time12(from)}. New bookings from this time will be blocked.`
              : `${affected.length} booking(s) from ${time12(from)} will be cancelled: ${affected.map(a => `${a.patientName || a.patientId?.fullName || 'Patient'} (${time12(a.time)})`).join(', ')}.`}
          </div>
        )}

        {message && <div className="text-sm font-semibold text-slate-600 mb-3">{message}</div>}

        <button
          type="button"
          disabled={!from || saving}
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl font-extrabold text-base bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none transition-all"
        >
          {saving ? 'Updating…' : 'Mark Unavailable & Inform Patients'}
        </button>

        {closures.length > 0 && (
          <div className="mt-5 border-t border-gray-100 pt-4">
            <div className="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-2">Already marked unavailable</div>
            <div className="space-y-2">
              {closures.map(c => (
                <div key={c.date} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-3 py-2">
                  <span className="text-sm font-bold text-slate-700">{c.date} from {time12(c.from)}</span>
                  <button type="button" onClick={() => reopen(c.date)} className="text-xs font-bold text-[#5265ec] hover:underline">Reopen slots</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnavailableModal;
