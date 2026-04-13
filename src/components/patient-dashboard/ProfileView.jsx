import React from 'react';

const ProfileView = ({ patientData }) => {
  return (
    <div className="flex-1 h-full py-8 md:py-12 px-6 md:px-12 flex flex-col overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#021024]">Patient Profile</h1>
        <p className="text-gray-400 font-medium mt-1">Manage your personal and medical information</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_20px_rgba(0,0,0,0.03)] p-8 flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-32 h-32 mb-6">
            <img src={patientData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover shadow-lg" />
            <div className="absolute bottom-0 right-0 bg-[#5265ec] w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-white cursor-pointer hover:bg-[#4254d3] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{patientData.name}</h2>
          <span className="text-[#5265ec] font-semibold mt-1 bg-[#5265ec]/10 px-3 py-1 rounded-full text-sm">Patient ID: #88902</span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Full Name</label>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold text-slate-700">{patientData.name}</div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Email Address</label>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold text-slate-700">patient@example.com</div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Phone Number</label>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold text-slate-700">+1 (555) 000-0000</div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Date of Birth</label>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-semibold text-slate-700">Jan 01, 1990</div>
          </div>
          
          <div className="md:col-span-2 mt-4">
            <button className="bg-[#5265ec] hover:bg-[#4254d3] text-white px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-[#5265ec]/30 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
