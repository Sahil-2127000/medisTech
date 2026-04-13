import React, { useState, useEffect } from 'react';

const DoctorProfile = ({ email }) => {
 const [isEditing, setIsEditing] = useState(false);
 const [profile, setProfile] = useState({
 firstName: '',
 lastName: '',
 email: email || '',
 phone: '',
 specialization: '',
 experience: '',
 clinicAddress: '',
 photo: '' // Avatar with camera icon overlay conceptually
 });

 const loadProfile = async () => {
 try {
 const res = await fetch('http://localhost:5001/api/auth/profile', { credentials: 'include' });
 if (res.ok) {
 const data = await res.json();
 // Dissect native schema into frontend struct dynamically mapping
 setProfile({
 firstName: data.fullName?.split(' ')[0] || '',
 lastName: data.fullName?.split(' ').slice(1).join(' ') || '',
 email: data.email || '',
 phone: data.phone || '12345',
 specialization: data.specialization || '',
 experience: data.experience || '',
 clinicAddress: data.clinicAddress || '',
 photo: data.photo || ''
 });
 }
 } catch(err) {
 console.error("Binding failed structurally.", err);
 }
 };

 // Load purely from Node Context dynamically mapping
 useEffect(() => {
 loadProfile();
 }, []);

 const handleChange = (e) => {
 setProfile({ ...profile, [e.target.name]: e.target.value });
 };

 const handleSave = async (e) => {
 e.preventDefault();
 try {
 // Merge names structurally mapping back to Schema natively
 const payload = {
 fullName: `${profile.firstName} ${profile.lastName}`.trim(),
 phone: profile.phone,
 specialization: profile.specialization,
 experience: profile.experience,
 clinicAddress: profile.clinicAddress,
 photo: profile.photo
 };

 const res = await fetch('http://localhost:5001/api/auth/profile', {
 method: 'PUT',
 headers: { 'Content-Type': 'application/json' },
 credentials: 'include',
 body: JSON.stringify(payload)
 });

 if (res.ok) {
 alert('Global Schema Map perfectly bound to MongoDB.');
 setIsEditing(false);
 // Globally update the UI explicitly notifying sidebars
 window.dispatchEvent(new Event("doctorProfileUpdated"));
 } else {
 alert('Database connection string implicitly failed.');
 }
 } catch (err) {
 console.error(err);
 }
 };

 return (
 <div className="flex-1 overflow-y-auto no-scrollbar py-12 px-8 flex justify-center bg-transparent transition-colors duration-300">
 <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] p-10 relative transition-colors duration-300">
 <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-50 transition-colors">
 <div>
 <h2 className="text-3xl font-extrabold text-[#021024] mb-1 transition-colors">Doctor Profile Variables</h2>
 <p className="text-sm font-semibold text-gray-400 transition-colors">Manage your clinical metadata strictly bound locally</p>
 </div>
 <button onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
 className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${isEditing ? 'bg-red-50 text-red-500 hover:bg-red-100 ' : 'bg-blue-50 text-clinic-600 hover:bg-blue-100 '} `}
 >
 {isEditing ? 'Cancel Edit' : 'Edit Profile'}
 </button>
 </div>

 <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-12">
 {/* Avatar Settings Column */}
 <div className="flex flex-col items-center flex-shrink-0 w-64">
 <div className="relative group cursor-pointer mb-6">
 <div className="w-48 h-48 rounded-[2rem] border-4 border-slate-100 overflow-hidden shadow-lg transition-all group-hover:scale-[1.02]">
 <img src={profile.photo || `https://placehold.co/400x400/5265ec/ffffff.png?text=${profile.firstName?.charAt(0) || 'D'}`} alt="Current Avatar" className="w-full h-full object-cover" />
 {isEditing && (
 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
 <svg className="w-12 h-12 text-white/90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
 </div>
 )}
 </div>
 </div>
 {isEditing && (
 <input name="photo" value={profile.photo} onChange={handleChange} placeholder="Paste Image URL..." className="w-full text-xs text-center border-b border-gray-300 bg-transparent py-2 focus:outline-none focus:border-clinic-600 transition-colors"
 />
 )}
 </div>

 {/* Form Matrix */}
 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
 {[
 { label: 'First Name', name: 'firstName' },
 { label: 'Last Name', name: 'lastName' },
 { label: 'Email Address', name: 'email', mdColSpan: true, readOnly: true },
 { label: 'Phone Number', name: 'phone' },
 { label: 'Specialization', name: 'specialization' },
 { label: 'Years Experience', name: 'experience' },
 { label: 'Clinic Address', name: 'clinicAddress', mdColSpan: true }
 ].map((field, i) => (
 <div key={i} className={`flex flex-col space-y-1.5 ${field.mdColSpan ? 'md:col-span-2' : ''}`}>
 <label className="text-[10px] font-extrabold uppercase tracking-widest text-clinic-600/80 transition-colors">{field.label}</label>
 {isEditing && !field.readOnly ? (
 <input name={field.name}
 value={profile[field.name]}
 onChange={handleChange}
 className="w-full bg-[#f4f7fb] border border-transparent focus:bg-white focus:border-clinic-600 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none" />
 ) : (
 <div className={`w-full ${isEditing && field.readOnly ? 'bg-gray-100 text-gray-400 ' : 'bg-transparent text-slate-800 border-b border-gray-100 '} rounded-none md:rounded-xl px-0 md:px-4 py-2 md:py-3 text-sm font-bold min-h-[44px] flex items-center transition-colors`}>
 {profile[field.name] || '—'}
 </div>
 )}
 </div>
 ))}

 {isEditing && (
 <div className="md:col-span-2 mt-6 flex justify-end">
 <button type="submit" className="bg-clinic-600 hover:bg-clinic-800 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2">
 <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
 Save Profile Mapping
 </button>
 </div>
 )}

 </div>
 </form>

 </div>
 </div>
 );
};

export default DoctorProfile;
