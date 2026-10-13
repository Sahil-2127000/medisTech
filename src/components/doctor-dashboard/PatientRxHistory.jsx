import React, { useState } from 'react';
import { createPortal } from 'react-dom';

// Small icon shown next to a patient's name when they have past prescriptions.
// Clicking it opens a modal with all previous prescriptions and visits.
const PatientRxHistory = ({ patientId, patientName }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ prescriptions: [], visits: [] });
  const [error, setError] = useState('');

  const openHistory = async (e) => {
    e.stopPropagation();
    setOpen(true);
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5001/api/prescriptions/patient/${patientId}`, { credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load history');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const modal = (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl text-left" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-black text-slate-800">Patient History</h3>
            <p className="text-sm font-semibold text-slate-400">{patientName}</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-full p-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {loading && <p className="text-center text-sm text-gray-400 font-medium py-8">Loading history...</p>}
          {error && <p className="text-center text-sm text-red-500 font-bold py-8">{error}</p>}

          {!loading && !error && (
            <>
              <div>
                <h4 className="text-xs font-black text-clinic-600 uppercase tracking-widest mb-3">
                  Prescriptions ({data.prescriptions.length})
                </h4>
                {data.prescriptions.length === 0 ? (
                  <p className="text-sm text-gray-400">No prescriptions on record.</p>
                ) : (
                  <div className="space-y-3">
                    {data.prescriptions.map(rx => (
                      <div key={rx._id} className="border border-gray-100 rounded-2xl p-4 bg-slate-50/60">
                        <div className="flex justify-between items-start mb-2 gap-3">
                          <div>
                            <div className="font-bold text-slate-800">{rx.diagnosis}</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              Dr. {rx.doctorId?.fullName || 'Unknown'}{rx.doctorId?.specialization ? ` • ${rx.doctorId.specialization}` : ''}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-clinic-600 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">{formatDate(rx.createdAt)}</span>
                        </div>
                        {rx.appointmentId?.symptoms && (
                          <p className="text-xs text-slate-500 mb-2"><span className="font-bold">Symptoms:</span> {rx.appointmentId.symptoms}</p>
                        )}
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-left text-slate-400 uppercase tracking-wider">
                              <th className="py-1 font-bold">Medicine</th>
                              <th className="py-1 font-bold">Dosage</th>
                              <th className="py-1 font-bold">Frequency</th>
                              <th className="py-1 font-bold">Duration</th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-700 font-semibold">
                            {rx.medicines.map((m, i) => (
                              <tr key={i} className="border-t border-gray-100">
                                <td className="py-1">{m.name}</td>
                                <td className="py-1">{m.dosage}</td>
                                <td className="py-1">{m.frequency}</td>
                                <td className="py-1">{m.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {rx.clinicalNotes && (
                          <p className="text-xs text-slate-500 mt-2"><span className="font-bold">Notes:</span> {rx.clinicalNotes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-black text-clinic-600 uppercase tracking-widest mb-3">
                  Past Visits ({data.visits.length})
                </h4>
                {data.visits.length === 0 ? (
                  <p className="text-sm text-gray-400">No completed visits yet.</p>
                ) : (
                  <div className="space-y-2">
                    {data.visits.map(v => (
                      <div key={v._id} className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-2 text-sm">
                        <div>
                          <span className="font-bold text-slate-700">{v.date}</span>
                          <span className="text-slate-400"> • {v.time}</span>
                          {v.symptoms && <span className="text-slate-500"> — {v.symptoms}</span>}
                        </div>
                        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Dr. {v.doctorId?.fullName || 'Unknown'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={openHistory}
        title="View prescription history"
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-clinic-600 hover:bg-clinic-600 hover:text-white transition-colors shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      </button>
      {open && createPortal(modal, document.body)}
    </>
  );
};

export default PatientRxHistory;
