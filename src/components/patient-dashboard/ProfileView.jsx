import React, { useState, useEffect } from 'react';

const ProfileView = ({ patientData }) => {
  const [formData, setFormData] = useState({
    fullName: patientData.fullName || patientData.name || '',
    phone: patientData.phone || '',
    age: patientData.age || '',
    gender: patientData.gender || 'Male'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setFormData({
      fullName: patientData.fullName || patientData.name || '',
      phone: patientData.phone || '',
      age: patientData.age || '',
      gender: patientData.gender || 'Male'
    });
  }, [patientData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const res = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          age: formData.age,
          gender: formData.gender
        })
      });
      
      if (res.ok) {
        setSaveMessage('Profile saved successfully.');
        setTimeout(() => {
           setIsEditing(false);
           setSaveMessage('');
        }, 1500);
      } else {
        setSaveMessage('Failed to update profile.');
      }
    } catch{
      setSaveMessage('Network connection failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
     setFormData({
      fullName: patientData.fullName || patientData.name || '',
      phone: patientData.phone || '',
      age: patientData.age || '',
      gender: patientData.gender || 'Male'
     });
     setIsEditing(false);
     setSaveMessage('');
  };

  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-200 dark:border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Patient Profile</h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium mt-1">Manage physical records and contact details</p>
        </div>
        {!isEditing && (
          <button 
           onClick={() => setIsEditing(true)} 
           className="mt-4 md:mt-0 bg-white dark:bg-slate-800 border border-gray-300 dark:border-white/5 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 hover:border-blue-300 px-5 py-2 rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Edit Profile
          </button>
        )}
      </div>

      <div className="flex gap-8 flex-col lg:flex-row">
        
        {/* Left Column: Avatar & Summary Box */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <div className="w-32 h-32 mb-4 relative">
              <img src={patientData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white text-center">{formData.fullName || "Unspecified Name"}</h2>
            <div className="text-sm font-semibold text-gray-500 dark:text-slate-400 mt-1">Patient ID: <span className="text-slate-800 dark:text-blue-400">#{patientData._id ? patientData._id.slice(-5).toUpperCase() : 'N/A'}</span></div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
             <h3 className="text-sm font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest mb-4">Quick Facts</h3>
             <ul className="space-y-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <li className="flex justify-between border-b border-gray-200 dark:border-white/5 pb-2"><span>Status</span><span className="text-green-600 dark:text-emerald-400 font-bold">Active Patient</span></li>
                <li className="flex justify-between border-b border-gray-200 dark:border-white/5 pb-2"><span>Registrar</span><span>{patientData.createdAt ? new Date(patientData.createdAt).getFullYear() : 'Unknown'}</span></li>
                <li className="flex justify-between"><span>Last Activity</span><span>Today</span></li>
             </ul>
          </div>
        </div>

        {/* Right Column: Detailed Fields */}
        <div className="flex-1 bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-white/5 rounded-2xl p-8 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Demographics & Contact Information</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Full Legal Name</label>
                {isEditing ? (
                  <input 
                     type="text" 
                     name="fullName"
                     value={formData.fullName} 
                     onChange={handleChange}
                     disabled={!isEditing}
                     className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white outline-none transition-all" 
                  />
                ) : (
                  <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white">{formData.fullName || 'Not on file'}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Email Address</label>
                <div className="w-full bg-slate-100 dark:bg-slate-800/30 border border-gray-200 dark:border-white/5 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-500 dark:text-slate-500 select-none">
                   {patientData.email || 'Not on file'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Primary Phone Number</label>
                {isEditing ? (
                  <input 
                     type="text" 
                     name="phone"
                     value={formData.phone} 
                     onChange={handleChange}
                     className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white outline-none transition-all" 
                  />
                ) : (
                  <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white">{formData.phone || 'Not on file'}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Biological Gender</label>
                {isEditing ? (
                  <select 
                     name="gender"
                     value={formData.gender} 
                     onChange={handleChange}
                     className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white outline-none transition-all" 
                  >
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                  </select>
                ) : (
                  <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white">{formData.gender || 'Not on file'}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Chronological Age</label>
                {isEditing ? (
                  <input 
                     type="number" 
                     name="age"
                     value={formData.age} 
                     onChange={handleChange}
                     className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white outline-none transition-all" 
                  />
                ) : (
                  <div className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-white">{formData.age ? `${formData.age} yrs` : 'Not on file'}</div>
                )}
              </div>

           </div>

           {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-end gap-3">
                 {saveMessage && (
                    <span className={`text-sm font-bold mr-auto ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
                       {saveMessage}
                    </span>
                 )}
                 <button 
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                 >
                   Discard Changes
                 </button>
                 <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                 >
                   {isSaving ? 'Processing Update...' : 'Commit Changes'}
                 </button>
              </div>
           )}

        </div>

      </div>
    </div>
  );
};

export default ProfileView;
