'use client';

import React, { useState, useEffect } from 'react';

interface Trade {
  id: string;
  price: number;
  quantity: number;
  time: string;
  side: 'BUY' | 'SELL';
  buyOrderId: string;
  sellOrderId: string;
  timestamp: number;
}

const generateMockTrades = (): Trade[] => {
  const now = Date.now();
  return Array.from({ length: 30 }, (_, i) => ({
    id: `trade-${Math.random().toString(36).substr(2, 9)}`,
    price: 64000 + (Math.random() * 20 - 10),
    quantity: +(Math.random() * 2).toFixed(4),
    time: new Date(now - i * 1000).toLocaleTimeString([], { hour12: false }),
    side: Math.random() > 0.5 ? 'BUY' : 'SELL',
    buyOrderId: `BUY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    sellOrderId: `SELL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    timestamp: now - i * 1000
  }));
};

export const TradeFeed: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    setTrades(generateMockTrades());

    const interval = setInterval(() => {
      setTrades((prev) => {
        const basePrice = prev.length > 0 ? prev[0].price : 64000;
        const newTrade: Trade = {
          id: `trade-${Math.random().toString(36).substr(2, 9)}`,
          price: basePrice + (Math.random() * 10 - 5),
          quantity: +(Math.random() * 2).toFixed(4),
          time: new Date().toLocaleTimeString([], { hour12: false }),
          side: Math.random() > 0.5 ? 'BUY' : 'SELL',
          buyOrderId: `BUY-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          sellOrderId: `SELL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          timestamp: Date.now()
        };
        return [newTrade, ...prev].slice(0, 50);
      });
    }, 1200); // New trade every 1.2s for more activity

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => price.toFixed(2);
  const formatQuantity = (qty: number) => qty.toFixed(4);

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center space-x-2">
          <span>FIFO Trade Executions</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </h3>
      </div>
      
      <div className="flex text-xs text-white/50 px-4 py-2 border-b border-white/5">
        <div className="flex-1">Price(USDT)</div>
        <div className="flex-1 text-right">Size(BTC)</div>
        <div className="flex-1 text-right">Time</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-2">
        <div className="flex flex-col px-4">
          {trades.map((trade, index) => (
            <div 
              key={trade.id} 
              className={`flex text-sm py-1.5 hover:bg-white/5 cursor-default transition-all duration-300 ${
                index < 3 ? 'animate-fade-in' : ''
              }`}
              title={`Buy: ${trade.buyOrderId} | Sell: ${trade.sellOrderId}`}
            >
              <div className={`flex-1 font-medium ${trade.side === 'BUY' ? 'text-primary-green' : 'text-primary-pink'}`}>
                {formatPrice(trade.price)}
              </div>
              <div className="flex-1 text-right text-white">
                {formatQuantity(trade.quantity)}
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
