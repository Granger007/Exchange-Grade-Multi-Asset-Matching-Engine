'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';

export const MiniOrderBook: React.FC = () => {
  const [bids, setBids] = useState<{price: number, size: number}[]>([]);
  const [asks, setAsks] = useState<{price: number, size: number}[]>([]);

  useEffect(() => {
    const generate = () => {
      setBids(Array.from({ length: 6 }, (_, i) => ({
        price: 64000 - i * 5 - Math.random() * 5,
        size: Math.random() * 2 + 0.1,
      })));
      setAsks(Array.from({ length: 6 }, (_, i) => ({
        price: 64005 + i * 5 + Math.random() * 5,
        size: Math.random() * 2 + 0.1,
      })).reverse());
    };
    
    generate();
    const interval = setInterval(generate, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-white">BTC/USDT Order Book Snapshot</h3>
      </div>
      
      <div className="flex text-xs text-white/50 px-4 py-2 border-b border-white/5">
        <div className="flex-1">Price</div>
        <div className="flex-1 text-right">Size</div>
      </div>

      <div className="flex-1 px-2 py-2 flex flex-col justify-center">
        {/* Asks */}
        <div className="space-y-1 mb-2">
          {asks.map((ask, i) => (
            <div key={`ask-${i}`} className="flex text-sm px-2">
              <div className="flex-1 text-primary-pink">{ask.price.toFixed(2)}</div>
              <div className="flex-1 text-right text-white/80">{ask.size.toFixed(4)}</div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="text-center py-2 bg-white/5 rounded text-lg font-bold text-primary-green my-1">
          $64,002.50
        </div>

        {/* Bids */}
        <div className="space-y-1 mt-2">
          {bids.map((bid, i) => (
            <div key={`bid-${i}`} className="flex text-sm px-2">
              <div className="flex-1 text-primary-green">{bid.price.toFixed(2)}</div>
              <div className="flex-1 text-right text-white/80">{bid.size.toFixed(4)}</div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
