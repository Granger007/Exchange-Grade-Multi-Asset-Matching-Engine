'use client';

import React from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Trade } from '@/app/dashboard/page';

interface RecentTradesWidgetProps {
  trades: Trade[];
}

export const RecentTradesWidget: React.FC<RecentTradesWidgetProps> = ({ trades = [] }) => {
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
        {trades.length === 0 ? (
          <div className="text-center text-white/40 mt-8 text-sm">No trades yet.</div>
        ) : (
          trades.map((trade) => {
            const timeStr = new Date(trade.timestamp).toLocaleTimeString([], { hour12: false });
            return (
              <div key={trade.id} className="flex text-sm py-2 px-2 hover:bg-white/5 rounded transition-colors animate-fade-in">
                <div className="flex-[2] font-medium text-white">{trade.symbol}</div>
                <div className={`flex-1 text-right ${trade.side === 'BUY' ? 'text-primary-green' : 'text-primary-pink'}`}>
                  {trade.side === 'BUY' ? '▲' : '▼'} {trade.price.toFixed(2)}
                </div>
                <div className="flex-1 text-right text-white/80">{trade.quantity.toFixed(3)}</div>
                <div className="flex-1 text-right text-white/50 text-xs mt-0.5">{timeStr}</div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
};
