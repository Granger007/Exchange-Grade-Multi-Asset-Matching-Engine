'use client';

import React, { useMemo } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Trade } from '@/app/dashboard/page';

interface MiniOrderBookProps {
  trades: Trade[];
  currentPrice: number;
}

export const MiniOrderBook: React.FC<MiniOrderBookProps> = ({ trades = [], currentPrice = 64000 }) => {
  // Simulate bids/asks from recent trades
  const { bids, asks } = useMemo(() => {
    // Generate simulated orderbook around the current price
    // To make it dynamic, we adjust based on recent trades
    const recentSells = trades.filter(t => t.side === 'SELL');
    const recentBuys = trades.filter(t => t.side === 'BUY');

    // Asks are above current price
    const genAsks = Array.from({ length: 6 }, (_, i) => ({
      price: currentPrice + 5 + i * 5 + (recentSells.length ? Math.random() * 2 : 0),
      size: Math.random() * 2 + 0.1,
    })).reverse();

    // Bids are below current price
    const genBids = Array.from({ length: 6 }, (_, i) => ({
      price: currentPrice - 5 - i * 5 - (recentBuys.length ? Math.random() * 2 : 0),
      size: Math.random() * 2 + 0.1,
    }));

    return { bids: genBids, asks: genAsks };
  }, [trades, currentPrice]);

  return (
    <GlassCard className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-white">BTC Order Book Snapshot</h3>
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
          ${currentPrice.toFixed(2)}
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
