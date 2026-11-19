import React, { useState, useEffect } from 'react';
import { initialsAvatar } from '../../utils/avatar';
import { API_URL } from '../../config/api';

const DoctorProfile = ({ email }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: email || '',
        phone: '',
        specialization: '',
        experience: '',
        clinicName: '',
        clinicAddress: '',
        photo: '' // Avatar with camera icon overlay conceptually
    });

    const loadProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/profile`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                // Dissect native schema into frontend struct dynamically mapping
                setProfile({
                    firstName: data.fullName?.split(' ')[0] || '',
                    lastName: data.fullName?.split(' ').slice(1).join(' ') || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    specialization: data.specialization || '',
                    experience: data.experience || '',
                    clinicName: data.clinicName || '',
                    clinicAddress: data.clinicAddress || '',
                    photo: data.photo || ''
                });
            }
        } catch (err) {
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
                clinicName: profile.clinicName,
                clinicAddress: profile.clinicAddress,
                photo: profile.photo
            };

            const res = await fetch(`${API_URL}/api/auth/profile`, {
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
        <div className="flex-1 overflow-y-auto no-scrollbar py-4 lg:py-12 px-4 md:px-8 flex justify-center bg-transparent transition-colors duration-300">
            <div className="w-full max-w-4xl bg-white border border-gray-100 rounded-2xl lg:rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] p-4 lg:p-10 relative transition-colors duration-300">
                <div className="flex justify-between items-center gap-3 mb-4 lg:mb-10 pb-4 lg:pb-6 border-b border-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                        <img src={profile.photo || initialsAvatar(`${profile.firstName} ${profile.lastName}`, 160)} alt="" className="lg:hidden w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                        <h2 className="hidden lg:block text-3xl font-extrabold text-[#021024] mb-1 transition-colors">Profile</h2>
                        <p className="hidden lg:block text-sm font-semibold text-gray-400 transition-colors">Manage your whole clinical data</p>
                        <div className="lg:hidden font-bold text-slate-800 truncate">Dr. {profile.firstName} {profile.lastName}</div>
                        <div className="lg:hidden text-xs font-semibold text-gray-400 truncate">{profile.specialization || 'Doctor'}</div>
                        </div>
                    </div>
                    <button onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                        className={`shrink-0 px-3 lg:px-6 py-1.5 lg:py-2.5 rounded-lg lg:rounded-xl text-xs lg:text-base font-bold transition-all shadow-sm ${isEditing ? 'bg-red-50 text-red-500 hover:bg-red-100 ' : 'bg-blue-50 text-clinic-600 hover:bg-blue-100 '} `}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-4 md:gap-12">
                    {/* Avatar Settings Column */}
                    <div className={`${isEditing ? "flex" : "hidden"} md:flex flex-col items-center shrink-0 w-full md:w-64`}>
                        <div className="relative group cursor-pointer mb-3 md:mb-6">
                            <div className="w-20 h-20 md:w-48 md:h-48 rounded-2xl md:rounded-4xl border-4 border-slate-100 overflow-hidden shadow-lg transition-all group-hover:scale-[1.02]">
                                <img src={profile.photo || initialsAvatar(`${profile.firstName} ${profile.lastName}`, 400)} alt="Current Avatar" className="w-full h-full object-cover" />
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
                    <div className="flex-1 grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-6">
                        {[
                            { label: 'First Name', name: 'firstName' },
                            { label: 'Last Name', name: 'lastName' },
                            { label: 'Email Address', name: 'email', colSpan: true, readOnly: true },
                            { label: 'Phone Number', name: 'phone' },
                            { label: 'Specialization', name: 'specialization' },
                            { label: 'Years Experience', name: 'experience' },
                            { label: 'Clinic Name', name: 'clinicName', colSpan: true },
                            { label: 'Clinic Address', name: 'clinicAddress', colSpan: true }
                        ].map((field, i) => (
                            <div key={i} className={`flex flex-col min-w-0 space-y-1 md:space-y-1.5 ${field.colSpan ? 'col-span-2' : ''}`}>
                                <label className="text-[10px] font-extrabold uppercase tracking-widest text-clinic-600/80 transition-colors">{field.label}</label>
                                {isEditing && !field.readOnly ? (
                                    <input name={field.name}
                                        value={profile[field.name]}
                                        onChange={handleChange}
                                        className="w-full bg-[#f4f7fb] border border-transparent focus:bg-white focus:border-clinic-600 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm font-semibold text-slate-800 transition-all outline-none" />
                                ) : (
                                    <div className={`w-full ${isEditing && field.readOnly ? 'bg-gray-100 text-gray-400 ' : 'bg-transparent text-slate-800 border-b border-gray-100 '} rounded-none md:rounded-xl px-0 md:px-4 py-1.5 md:py-3 text-sm font-bold min-h-[36px] md:min-h-[44px] flex items-center break-all transition-colors`}>
                                        {profile[field.name] || '—'}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isEditing && (
                            <div className="col-span-2 mt-2 md:mt-6 flex justify-end">
                                <button type="submit" className="bg-clinic-600 hover:bg-clinic-800 text-white w-full md:w-auto justify-center px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl text-sm md:text-base font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    Update Profile
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
