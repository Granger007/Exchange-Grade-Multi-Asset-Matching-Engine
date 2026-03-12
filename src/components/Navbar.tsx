'use client';

import React, { useState } from 'react';
import { Search, Bell, User, TrendingUp } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
      isScrolled 
        ? 'glass-card py-2' 
        : 'glass-card py-4'
    }`}>
      <div className="flex items-center justify-between w-full px-6">
       

        {/* Right Section - Search, Quick Trade, Notifications, Profile */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search assets, markets, news..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors w-96"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-green/20 text-primary-green border border-primary-green/30 rounded-lg hover:bg-primary-green/30 transition-colors">
            <TrendingUp size={16} />
            <span>Quick Trade</span>
          </button>
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-pink rounded-full"></span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-purple to-primary-blue flex items-center justify-center">
              <User size={16} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
