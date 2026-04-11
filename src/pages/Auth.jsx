import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';

const Auth = () => {
  const [authMode, setAuthMode] = useState('signup'); // 'signup' or 'login'

  return (
    <div className="min-h-screen bg-gradient-to-tr from-clinic-900 via-clinic-800 to-[#0a183d] animate-gradient-xy flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl h-[650px] relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl z-10 bg-gradient-to-br from-[#419EF6] to-[#1444D8]">
        
        {/* Animated Graphic Panel */}
        <div 
          className={`absolute top-0 h-full w-full md:w-[45%] p-8 hidden md:flex flex-col justify-between transition-all duration-[900ms] ease-in-out z-10
            ${authMode === 'signup' ? 'left-0' : 'left-0 md:left-[55%]'}
          `}
        >
          {/* Logo */}
          <div className="text-white font-bold text-xl flex items-center gap-2 z-20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Clinic@Flow
          </div>

          {/* Center Graphic Container */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
             {/* Heartbeat/abstract graphics behind doctor */}
             <div className="w-64 h-64 border-[1rem] border-white/20 rounded-full absolute"></div>
             <img 
               src="/doctor_auth.png" 
               alt="Doctor" 
               className="w-full max-w-[320px] object-contain drop-shadow-2xl scale-155 translate-y-[5rem]"
               onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x400/1444d8/ffffff.png?text=Medical+Staff";
               }}
             />
          </div>

          
        </div>

        {/* Animated Form Panel */}
        <div 
          className={`absolute top-0 h-full w-full md:w-[55%] bg-[#F8F9FD] flex items-center justify-center p-8 shadow-[0_0_40px_rgba(0,0,0,0.2)] transition-all duration-[800ms] ease-in-out z-20
            ${authMode === 'signup' 
              ? 'left-0 md:left-[45%] md:rounded-l-[3rem] md:rounded-r-none' 
              : 'left-0 md:left-0 md:rounded-r-[3rem] md:rounded-l-none'
            }
          `}
        >
          
          <div className="w-full max-w-[380px] bg-white rounded-3xl p-8 shadow-xl relative">
            
            {/* Tabs */}
            <div className="flex items-center gap-6 mb-8 text-lg font-bold border-b border-gray-100 pb-2">
              <button 
                className={`transition-colors relative ${authMode === 'signup' ? 'text-gray-800' : 'text-gray-400'}`}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
                {authMode === 'signup' && <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-blue-500"></div>}
              </button>
              <button 
                className={`transition-colors relative ${authMode === 'login' ? 'text-gray-800' : 'text-gray-400'}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
                {authMode === 'login' && <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-blue-500"></div>}
              </button>
            </div>

            {/* Dynamic Form Rendering */}
            {authMode === 'login' ? (
              <LoginForm onSwitch={() => setAuthMode('signup')} />
            ) : (
              <SignUpForm onSwitch={() => setAuthMode('login')} />
            )}
            
          </div>

          <div className="absolute bottom-6 w-full flex justify-center gap-6 text-gray-400 text-lg">
            <span className="cursor-pointer hover:text-gray-600">in</span>
            <span className="cursor-pointer hover:text-gray-600">ig</span>
            <span className="cursor-pointer hover:text-gray-600">fb</span>
            <span className="cursor-pointer hover:text-gray-600">tw</span>
          </div>

        </div>
      </div>
      
      {/* Dynamic Animated Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-clinic-600/20 rounded-full blur-[100px] animate-float-blob pointer-events-none mix-blend-lighten"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-clinic-400/20 rounded-full blur-[120px] animate-float-delayed pointer-events-none mix-blend-lighten"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1444d8]/10 rounded-full blur-[150px] animate-float-blob hidden md:block pointer-events-none mix-blend-screen" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}

export default Auth;
