import React from 'react';

// App-style navigation for phones and tablets (hidden from 1024px up, where the sidebars take over).

// Top app bar: title on the left, small icon actions on the right. Pads for the status bar / notch.
export const MobileTopBar = ({ title, subtitle, avatar, actions = [] }) => (
  <header className="lg:hidden shrink-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 pt-[env(safe-area-inset-top)]">
    <div className="flex items-center gap-3 px-4 h-14">
      {avatar && <img src={avatar} alt="" className="w-9 h-9 rounded-full shrink-0" />}
      <div className="min-w-0 flex-1">
        <h1 className="text-[17px] font-extrabold text-slate-900 dark:text-white leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-[11px] font-semibold text-slate-400 truncate">{subtitle}</p>}
      </div>
      {actions.map(a => (
        <button
          key={a.label}
          onClick={a.onClick}
          aria-label={a.label}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95 ${a.danger ? 'text-red-500 active:bg-red-50' : 'text-slate-600 dark:text-slate-300 active:bg-slate-100 dark:active:bg-slate-800'}`}
        >
          <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">{a.icon}</svg>
        </button>
      ))}
    </div>
  </header>
);

// Bottom tab bar: fixed number of equal tabs, active tab highlighted. Pads for the home indicator.
export const MobileTabBar = ({ items, active, onSelect }) => (
  <nav className="lg:hidden shrink-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_rgba(15,23,42,0.06)]">
    <div className="grid h-16 max-w-xl mx-auto" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map(item => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex flex-col items-center justify-center gap-1 transition-colors active:scale-95 ${isActive ? 'text-[#3963F9]' : 'text-slate-400 dark:text-slate-500'}`}
          >
            <span className={`flex items-center justify-center w-12 h-7 rounded-full transition-colors ${isActive ? 'bg-[#3963F9]/10' : ''}`}>
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth={isActive ? 2.4 : 2} viewBox="0 0 24 24">{item.icon}</svg>
            </span>
            <span className={`text-[10.5px] leading-none ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);
