'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';

export const PriceTicker: React.FC = () => {
  const [price, setPrice] = useState(64002.50);
  const [change, setChange] = useState(2.4);
  const [isUp, setIsUp] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prev => {
        const newPrice = prev + (Math.random() * 20 - 10);
        setIsUp(newPrice >= prev);
        return newPrice;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        {/* Symbol Selector */}
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#F7931A] flex items-center justify-center font-bold text-white text-xs">
            BTC
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              BTC/USDT <ChevronDown size={16} className="ml-1 text-white/50" />
            </h2>
            <a href="#" className="text-xs text-primary-blue hover:underline">Bitcoin</a>
          </div>
        </div>

        {/* Current Price */}
        <div className={`transition-colors duration-300 ${isUp ? 'text-primary-green' : 'text-primary-pink'}`}>
          <div className="text-2xl font-bold flex items-center">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {isUp ? <TrendingUp size={20} className="ml-2" /> : <TrendingDown size={20} className="ml-2" />}
          </div>
          <div className="text-sm font-medium">
            {isUp ? '+' : '-'}${Math.abs(change).toFixed(2)} ({isUp ? '+' : ''}0.04%)
          </div>
        </div>
      </div>

      {/* 24h Stats */}
      <div className="hidden md:flex items-center space-x-8 text-sm">
        <div>
          <div className="text-white/50 mb-1">24h High</div>
          <div className="text-white font-medium">65,240.00</div>
        </div>
        <div>
          <div className="text-white/50 mb-1">24h Low</div>
          <div className="text-white font-medium">62,800.50</div>
        </div>
        <div>
          <div className="text-white/50 mb-1">24h Vol(BTC)</div>
          <div className="text-white font-medium">42,501.24</div>
        </div>
        <div>
          <div className="text-white/50 mb-1">24h Vol(USDT)</div>
          <div className="text-white font-medium">2.71B</div>
        </div>
      </div>
    </div>
  );
};
