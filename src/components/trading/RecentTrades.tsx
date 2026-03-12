'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassCard';

interface RecentTrade {
  id: string;
  time: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
}

export const RecentTrades: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [trades, setTrades] = useState<RecentTrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTrades = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/trades/${symbol}`);
        const data = await response.json();
        
        const mockTrades: RecentTrade[] = [
          { id: '1', time: '12:34:56', price: 43251.25, amount: 0.125, side: 'buy' },
          { id: '2', time: '12:34:55', price: 43251.00, amount: 0.075, side: 'sell' },
          { id: '3', time: '12:34:54', price: 43250.75, amount: 0.200, side: 'buy' },
          { id: '4', time: '12:34:53', price: 43250.50, amount: 0.150, side: 'sell' },
          { id: '5', time: '12:34:52', price: 43250.25, amount: 0.100, side: 'buy' },
          { id: '6', time: '12:34:51', price: 43250.00, amount: 0.300, side: 'sell' },
          { id: '7', time: '12:34:50', price: 43249.75, amount: 0.075, side: 'buy' },
          { id: '8', time: '12:34:49', price: 43249.50, amount: 0.250, side: 'sell' },
          { id: '9', time: '12:34:48', price: 43249.25, amount: 0.125, side: 'buy' },
          { id: '10', time: '12:34:47', price: 43249.00, amount: 0.100, side: 'sell' },
        ];
        
        setTrades(mockTrades);
      } catch (error) {
        console.error('Error fetching recent trades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTrades();
    const interval = setInterval(fetchRecentTrades, 2000);
    return () => clearInterval(interval);
  }, [symbol]);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(3);
  };

  if (loading) {
    return (
      <GlassCard className="p-4">
        <h3 className="text-white font-semibold mb-4">Recent Trades</h3>
        <div className="text-white/50 text-center py-8">Loading...</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Recent Trades</h3>
        <span className="text-white/70 text-sm">{symbol}</span>
      </div>
      
      <div className="grid grid-cols-4 text-xs text-white/50 mb-2">
        <div>Time</div>
        <div>Price</div>
        <div>Amount</div>
        <div className="text-right">Side</div>
      </div>
      
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {trades.map((trade) => (
          <div key={trade.id} className="grid grid-cols-4 text-xs">
            <div className="text-white/70">{trade.time}</div>
            <div className={trade.side === 'buy' ? 'text-green-400' : 'text-pink-400'}>
              {formatPrice(trade.price)}
            </div>
            <div className="text-white/70">{formatAmount(trade.amount)}</div>
            <div className="text-right">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  trade.side === 'buy'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-pink-500/20 text-pink-400'
                }`}
              >
                {trade.side.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
