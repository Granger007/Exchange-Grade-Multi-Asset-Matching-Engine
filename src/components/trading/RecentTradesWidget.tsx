'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';

interface Trade {
  id: string;
  pair: string;
  price: number;
  qty: number;
  time: string;
  side: 'BUY' | 'SELL';
}

const generateMockTrades = (): Trade[] => {
  const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AAPL', 'TSLA'];
  return Array.from({ length: 8 }, (_, i) => {
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const basePrice = pair === 'BTC/USDT' ? 64000 : pair === 'ETH/USDT' ? 3500 : pair === 'SOL/USDT' ? 145 : pair === 'AAPL' ? 175 : 245;
    return {
      id: `trd-${Math.random().toString(36).substr(2, 6)}`,
      pair,
      price: basePrice + (Math.random() * 10 - 5),
      qty: +(Math.random() * 2 + 0.1).toFixed(3),
      time: new Date(Date.now() - i * 2000).toLocaleTimeString([], { hour12: false }),
      side: Math.random() > 0.5 ? 'BUY' : 'SELL',
    };
  });
};

export const RecentTradesWidget: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    setTrades(generateMockTrades());
    const interval = setInterval(() => {
      setTrades((prev) => {
        const pairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'AAPL', 'TSLA'];
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        const basePrice = pair === 'BTC/USDT' ? 64000 : pair === 'ETH/USDT' ? 3500 : pair === 'SOL/USDT' ? 145 : pair === 'AAPL' ? 175 : 245;
        const newTrade: Trade = {
          id: `trd-${Math.random().toString(36).substr(2, 6)}`,
          pair,
          price: basePrice + (Math.random() * 10 - 5),
          qty: +(Math.random() * 2 + 0.1).toFixed(3),
          time: new Date().toLocaleTimeString([], { hour12: false }),
          side: Math.random() > 0.5 ? 'BUY' : 'SELL',
        };
        return [newTrade, ...prev].slice(0, 10);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-white">Live Execution Feed</h3>
      </div>
      
      <div className="flex text-xs text-white/50 px-4 py-2 border-b border-white/5">
        <div className="flex-[2]">Pair</div>
        <div className="flex-1 text-right">Price</div>
        <div className="flex-1 text-right">Qty</div>
        <div className="flex-1 text-right">Time</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        {trades.map((trade) => (
          <div key={trade.id} className="flex text-sm py-2 px-2 hover:bg-white/5 rounded transition-colors animate-fade-in">
            <div className="flex-[2] font-medium text-white">{trade.pair}</div>
            <div className={`flex-1 text-right ${trade.side === 'BUY' ? 'text-primary-green' : 'text-primary-pink'}`}>
              {trade.side === 'BUY' ? '▲' : '▼'} {trade.price.toFixed(2)}
            </div>
            <div className="flex-1 text-right text-white/80">{trade.qty.toFixed(3)}</div>
            <div className="flex-1 text-right text-white/50 text-xs mt-0.5">{trade.time}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
