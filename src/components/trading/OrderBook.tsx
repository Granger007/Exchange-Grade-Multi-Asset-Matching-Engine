'use client';

import React, { useState, useEffect } from 'react';

// Mock data generator for order book
const generateOrderBookData = () => {
  const bids = Array.from({ length: 15 }, (_, i) => ({
    price: 64000 - i * 10 - Math.random() * 5,
    size: Math.random() * 2 + 0.1,
    total: 0,
  }));
  
  const asks = Array.from({ length: 15 }, (_, i) => ({
    price: 64005 + i * 10 + Math.random() * 5,
    size: Math.random() * 2 + 0.1,
    total: 0,
  }));

  // Calculate totals for depth bars
  let bidTotal = 0;
  bids.forEach(b => {
    bidTotal += b.size;
    b.total = bidTotal;
  });

  let askTotal = 0;
  asks.forEach(a => {
    askTotal += a.size;
    a.total = askTotal;
  });

  return { bids, asks: asks.reverse(), maxTotal: Math.max(bidTotal, askTotal) };
};

export const OrderBook: React.FC = () => {
  const [data, setData] = useState<{
    bids: {price: number, size: number, total: number}[];
    asks: {price: number, size: number, total: number}[];
    maxTotal: number;
  }>({
    bids: [],
    asks: [],
    maxTotal: 0
  });

  useEffect(() => {
    setData(generateOrderBookData());
    const interval = setInterval(() => {
      setData(generateOrderBookData());
    }, 2000); // Simulate WebSocket updates every 2s
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (p: number) => p.toFixed(2);
  const formatSize = (s: number) => s.toFixed(4);

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-white">Order Book</h3>
        <div className="text-xs text-white/50 flex space-x-2">
          <span className="cursor-pointer hover:text-white transition-colors">0.1</span>
          <span className="cursor-pointer hover:text-white transition-colors">0.01</span>
          <span className="cursor-pointer hover:text-white transition-colors">0.001</span>
        </div>
      </div>

      <div className="flex text-xs text-white/50 px-4 py-2">
        <div className="flex-1">Price(USDT)</div>
        <div className="flex-1 text-right">Size(BTC)</div>
        <div className="flex-1 text-right">Total</div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Asks (Sell Orders - Red) */}
        <div className="flex flex-col justify-end px-2">
          {data.asks.map((ask, i) => (
            <div key={`ask-${i}`} className="flex text-sm py-1 relative hover:bg-white/5 cursor-pointer group">
              {/* Depth bar */}
              <div 
                className="absolute right-0 top-0 bottom-0 bg-primary-pink/10 transition-all duration-300"
                style={{ width: `${(ask.total / data.maxTotal) * 100}%` }}
              />
              <div className="flex-1 text-primary-pink relative z-10 pl-2">{formatPrice(ask.price)}</div>
              <div className="flex-1 text-right text-white relative z-10">{formatSize(ask.size)}</div>
              <div className="flex-1 text-right text-white/70 relative z-10 pr-2">{formatSize(ask.total)}</div>
            </div>
          ))}
        </div>

        {/* Spread / Current Price */}
        <div className="flex items-center justify-between py-2 px-4 border-y border-white/10 my-1 bg-white/5">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-green">64,002.50</span>
            <span className="text-xs text-white/50">$64,002.50</span>
          </div>
          <span className="text-xs text-white/50">Spread: 2.50</span>
        </div>

        {/* Bids (Buy Orders - Green) */}
        <div className="flex flex-col px-2">
          {data.bids.map((bid, i) => (
            <div key={`bid-${i}`} className="flex text-sm py-1 relative hover:bg-white/5 cursor-pointer group">
              {/* Depth bar */}
              <div 
                className="absolute right-0 top-0 bottom-0 bg-primary-green/10 transition-all duration-300"
                style={{ width: `${(bid.total / data.maxTotal) * 100}%` }}
              />
              <div className="flex-1 text-primary-green relative z-10 pl-2">{formatPrice(bid.price)}</div>
              <div className="flex-1 text-right text-white relative z-10">{formatSize(bid.size)}</div>
              <div className="flex-1 text-right text-white/70 relative z-10 pr-2">{formatSize(bid.total)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
