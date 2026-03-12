'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  AlertTriangle, 
  Bell, 
  Settings,
  Menu,
  X,
  ShoppingCart,
  BookOpen,
  Activity,
  TrendingDown
} from 'lucide-react';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
  { icon: <ShoppingCart size={20} />, label: 'Markets', href: '/markets' },
  { icon: <BookOpen size={20} />, label: 'Orders', href: '/orders' },
  { icon: <Activity size={20} />, label: 'Trades', href: '/trades' },
  { icon: <TrendingDown size={20} />, label: 'Order Book', href: '/orderbook' },
  { icon: <BarChart3 size={20} />, label: 'Market Depth', href: '/depth' },
  { icon: <DollarSign size={20} />, label: 'Stocks', href: '/stocks' },
  { icon: <PieChart size={20} />, label: 'Equity', href: '/equity' },
  { icon: <BarChart3 size={20} />, label: 'Portfolio', href: '/portfolio' },
  { icon: <TrendingUp size={20} />, label: 'Market Analytics', href: '/market' },
  { icon: <AlertTriangle size={20} />, label: 'Risk Alerts', href: '/risk' },
  { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`fixed left-0 top-0 h-full glass-card transition-all duration-300 z-40 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-white">Trading Hub</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                >
                  <span className="text-white/70 group-hover:text-white transition-colors">
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-white/70 group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-green to-primary-blue flex items-center justify-center">
              <span className="text-white font-bold">JD</span>
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-white font-medium">John Doe</p>
                <p className="text-white/50 text-sm">Premium</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
