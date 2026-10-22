import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { initialsAvatar } from '../../utils/avatar';

// Each clinic on the platform is run by exactly one doctor
const DoctorsSection = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5001/api/auth/doctors')
      .then(res => (res.ok ? res.json() : []))
      .then(setClinics)
      .catch(err => console.error('Failed to fetch clinics', err));
  }, []);

  const specialties = useMemo(
    () => ['All', ...new Set(clinics.map(d => d.specialization).filter(Boolean))],
    [clinics]
  );

  const filtered = clinics.filter(d => {
    const q = search.trim().toLowerCase();
    const haystack = [d.clinicName, d.clinicAddress, d.fullName, d.specialization].join(' ').toLowerCase();
    return (!q || haystack.includes(q)) && (specialty === 'All' || d.specialization === specialty);
  });

  const handleBook = (doctorId) => {
    // Remember the chosen clinic so the booking form can pre-select it after login
    sessionStorage.setItem('preferredDoctorId', doctorId);
    navigate('/auth');
  };

  return (
    <section id="doctors" className="w-full max-w-7xl mx-auto px-8 md:px-16 py-24">
      <motion.div
        className="text-center max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Find a Clinic</h2>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          Search clinics across Ludhiana by name, area, doctor or specialization and book an appointment in a few clicks.
        </p>
      </motion.div>

      {/* Search + specialty filter */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="relative w-full max-w-xl">
          <svg className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by clinic, area, doctor or specialization..."
            className="w-full bg-white border border-slate-200 rounded-full pl-13 pr-6 py-4 text-slate-700 font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {specialties.map(s => (
            <button
              key={s}
              onClick={() => setSpecialty(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                specialty === s ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Clinic cards */}
      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 font-medium">No clinics match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(doc => (
            <div key={doc._id} className="flex flex-col p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img src={initialsAvatar(doc.fullName, 128)} alt={doc.fullName} className="w-16 h-16 rounded-full ring-4 ring-blue-50 shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{doc.clinicName || `Dr. ${doc.fullName}'s Clinic`}</h3>
                  <p className="text-sm text-slate-600 font-medium mt-0.5">Dr. {doc.fullName}</p>
                </div>
              </div>
              <span className="self-start text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {doc.specialization || 'General Physician'}
              </span>
              {doc.experience && <p className="text-sm text-slate-500 mt-3">{doc.experience}+ years experience</p>}
              {doc.clinicAddress && (
                <p className="text-sm text-slate-500 mt-2 flex gap-2">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {doc.clinicAddress}
                </p>
              )}
              <div className="mt-auto pt-5">
                <button
                  onClick={() => handleBook(doc._id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-blue-500/30"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default DoctorsSection;
