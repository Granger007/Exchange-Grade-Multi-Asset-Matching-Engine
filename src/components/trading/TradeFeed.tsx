'use client';

import React, { useState, useEffect } from 'react';

interface Trade {
  id: string;
  price: number;
  qty: number;
  time: string;
  side: 'BUY' | 'SELL';
}

const generateMockTrades = (): Trade[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: `trade-${Math.random().toString(36).substr(2, 9)}`,
    price: 64000 + (Math.random() * 20 - 10),
    qty: +(Math.random() * 2).toFixed(4),
    time: new Date(Date.now() - i * 1000).toLocaleTimeString([], { hour12: false }),
    side: Math.random() > 0.5 ? 'BUY' : 'SELL',
  }));
};

export const TradeFeed: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    setTrades(generateMockTrades());

    const interval = setInterval(() => {
      setTrades((prev) => {
        const newTrade: Trade = {
          id: `trade-${Math.random().toString(36).substr(2, 9)}`,
          price: prev.length > 0 ? prev[0].price + (Math.random() * 10 - 5) : 64000,
          qty: +(Math.random() * 2).toFixed(4),
          time: new Date().toLocaleTimeString([], { hour12: false }),
          side: Math.random() > 0.5 ? 'BUY' : 'SELL',
        };
        return [newTrade, ...prev].slice(0, 50); // Keep last 50
      });
    }, 1500); // New trade every 1.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-white">Recent Trades</h3>
      </div>
      
      <div className="flex text-xs text-white/50 px-4 py-2 border-b border-white/5">
        <div className="flex-1">Price(USDT)</div>
        <div className="flex-1 text-right">Size(BTC)</div>
        <div className="flex-1 text-right">Time</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
        <div className="flex flex-col px-4">
          {trades.map((trade) => (
            <div key={trade.id} className="flex text-sm py-1.5 hover:bg-white/5 cursor-default transition-colors">
              <div className={`flex-1 font-medium ${trade.side === 'BUY' ? 'text-primary-green' : 'text-primary-pink'}`}>
                {trade.price.toFixed(2)}
              </div>
              <div className="flex-1 text-right text-white">
                {trade.qty.toFixed(4)}
              </div>
              <div className="flex-1 text-right text-white/50">
                {trade.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
