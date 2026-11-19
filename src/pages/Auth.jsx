import React, { useState } from 'react';
import useAppView from '../hooks/useAppView';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appView = useAppView();
  const [authMode, setAuthMode] = useState(location.state?.mode || 'signup'); // 'signup' or 'login'

  if (appView) {
    // App screen: plain full-screen form, no decorative card / illustration / animation
    return (
      <div className="min-h-[100dvh] bg-white flex flex-col font-sans">
        <header className="shrink-0 pt-[env(safe-area-inset-top)] border-b border-slate-100">
          <div className="h-14 flex items-center gap-1 px-2">
            <button onClick={() => navigate('/')} aria-label="Back" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 active:bg-slate-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-[17px] font-extrabold text-slate-900">{authMode === 'login' ? 'Sign In' : 'Create Account'}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <h1 className="text-2xl font-extrabold text-slate-900">{authMode === 'login' ? 'Welcome back' : 'Join MedisTech'}</h1>
          <p className="text-sm text-slate-500 mt-1 mb-5">{authMode === 'login' ? 'Sign in to continue to your account.' : 'Book clinics, track your queue and keep your records.'}</p>

          <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6">
            {[['signup', 'Sign Up'], ['login', 'Sign In']].map(([mode, label]) => (
              <button key={mode} onClick={() => setAuthMode(mode)}
                className={`py-2.5 rounded-lg text-sm font-bold ${authMode === mode ? 'bg-white text-[#3963F9] shadow-sm' : 'text-slate-500'}`}>
                {label}
              </button>
            ))}
          </div>

          {authMode === 'login'
            ? <LoginForm onSwitch={() => setAuthMode('signup')} />
            : <SignUpForm onSwitch={() => setAuthMode('login')} />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-tr from-clinic-900 via-clinic-800 to-[#0a183d] animate-gradient-xy flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl h-[min(760px,calc(100vh-2rem))] min-h-[560px] relative rounded-4xl md:rounded-4xl overflow-hidden shadow-2xl z-10 bg-linear-to-br from-[#419EF6] to-[#1444D8]">
        
        {/* Animated Graphic Panel */}
        <div 
          className={`absolute top-0 h-full w-full md:w-[45%] p-8 hidden md:flex flex-col justify-between transition-all duration-900 ease-in-out z-10
            ${authMode === 'signup' ? 'left-0' : 'left-0 md:left-[55%]'}
          `}
        >
          {/* Logo */}
          <div className="text-white font-bold text-xl flex items-center gap-2 z-20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            medisTech
          </div>

          {/* Center Graphic Container */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
             {/* Heartbeat/abstract graphics behind doctor */}
             <div className="w-64 h-64 border-[1rem] border-white/20 rounded-full absolute"></div>
             <img 
               src="/doctor_auth.png" 
               alt="Doctor" 
               className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[320px] object-contain drop-shadow-2xl scale-155 origin-bottom"
               onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x400/1444d8/ffffff.png?text=Medical+Staff";
               }}
             />
          </div>

          
        </div>

        {/* Animated Form Panel */}
        <div 
          className={`absolute top-0 h-full w-full md:w-[55%] bg-[#F8F9FD] flex justify-center overflow-y-auto no-scrollbar p-6 shadow-[0_0_40px_rgba(0,0,0,0.2)] transition-all duration-800 ease-in-out z-20
            ${authMode === 'signup' 
              ? 'left-0 md:left-[45%] md:rounded-l-[3rem] md:rounded-r-none' 
              : 'left-0 md:left-0 md:rounded-r-[3rem] md:rounded-l-none'
            }
          `}
        >
          
          <div className="w-full max-w-[380px] my-auto bg-white rounded-3xl px-8 py-6 shadow-xl relative">
            
            {/* Tabs */}
            <div className="flex items-center gap-6 mb-5 text-lg font-bold border-b border-gray-100 pb-2">
              <button 
                className={`transition-colors hover:scale-[1.03] relative ${authMode === 'signup' ? 'text-gray-800' : 'text-gray-400'}`}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
                {authMode === 'signup' && <div className="absolute -bottom-[9px] left-0 right-0 h-0.5 bg-blue-500"></div>}
              </button>
              <button 
                className={`transition-colors hover:scale-[1.03] relative ${authMode === 'login' ? 'text-gray-800' : 'text-gray-400'}`}
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