import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 md:px-16 py-8 relative z-20">
      <div className="text-2xl font-bold flex items-center gap-2">
        <span className="text-white">Medi</span>
        <span className="text-clinic-400">Tech</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-clinic-200">
        <a href="#" className="hover:text-white transition-colors">Home</a>
        <a href="#" className="hover:text-white transition-colors">Facilities</a>
        <a href="#" className="hover:text-white transition-colors">Reviews</a>
        <a href="#" className="hover:text-white transition-colors">Pricing</a>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/auth" className="hidden sm:block text-clinic-200 hover:text-white px-4 py-2 text-sm font-semibold transition-colors">
          Login
        </Link>
        <Link to="/auth" className="block bg-clinic-600 hover:bg-clinic-400 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
