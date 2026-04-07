import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-[72px] h-[36px] rounded-full p-1 transition-colors duration-500 ease-in-out flex items-center shadow-inner border ${
        theme === 'dark' 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-[#EEF2FA] border-blue-100'
      }`}
      aria-label="Toggle Dark Mode"
    >
      <div 
        className={`absolute w-7 h-7 rounded-full transition-transform duration-500 ease-in-out shadow-sm flex items-center justify-center ${
          theme === 'dark' 
            ? 'translate-x-[36px] bg-slate-700' 
            : 'translate-x-[2px] bg-white'
        }`}
      >
        {theme === 'dark' ? (
          <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zm-4.22 4.22a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.415 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-4.22a1 1 0 010-1.415l-.708-.708a1 1 0 01-1.414 1.414l.708.708a1 1 0 011.415 0zM3 11a1 1 0 100-2H2a1 1 0 100 2h1zm3.22-4.22a1 1 0 01-1.415 0l-.708-.708a1 1 0 011.414-1.414l.708.708a1 1 0 010 1.414zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd"></path>
         </svg>
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
