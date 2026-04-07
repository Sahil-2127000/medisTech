import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full max-w-7xl border-t border-clinic-600/20 mt-20 pt-8 flex justify-between items-center px-8 text-clinic-400 text-sm">
      <p>&copy; 2026 Clinic@Flow. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
      </div>
    </footer>
  );
};

export default Footer;
