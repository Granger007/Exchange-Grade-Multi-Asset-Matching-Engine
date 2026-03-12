'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface StockData {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: string;
  volume: string;
  marketCap: string;
}

const stockData: StockData[] = [
  { symbol: 'AAPL', company: 'Apple Inc.', price: 178.45, change: 2.34, changePercent: '+1.33%', volume: '52.3M', marketCap: '$2.8T' },
  { symbol: 'TSLA', company: 'Tesla Inc.', price: 245.67, change: -5.23, changePercent: '-2.08%', volume: '118.7M', marketCap: '$780B' },
  { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 142.89, change: 1.45, changePercent: '+1.02%', volume: '28.4M', marketCap: '$1.8T' },
  { symbol: 'MSFT', company: 'Microsoft Corp.', price: 378.91, change: 3.67, changePercent: '+0.98%', volume: '22.1M', marketCap: '$2.8T' },
  { symbol: 'AMZN', company: 'Amazon.com Inc.', price: 156.78, change: -1.23, changePercent: '-0.78%', volume: '41.2M', marketCap: '$1.6T' },
];

export const StockTable: React.FC = () => {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Stock Markets</h3>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-3 py-1 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-sm">
            <BarChart3 size={14} />
            <span>Chart View</span>
          </button>
          <button className="text-primary-blue hover:text-primary-blue/80 text-sm font-medium">
            View All
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th className="pb-3 text-white/50 text-sm font-medium">Symbol</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Company</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Price</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Change</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Volume</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((stock) => {
              const isPositive = stock.change >= 0;
              return (
                <tr key={stock.symbol} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-primary-blue/20 flex items-center justify-center">
                        <span className="text-primary-blue text-xs font-bold">{stock.symbol.substring(0, 2)}</span>
                      </div>
                      <span className="text-white font-medium">{stock.symbol}</span>
                    </div>
                  </td>
                  <td className="py-4 text-white/70">{stock.company}</td>
                  <td className="py-4 text-white font-medium">${stock.price}</td>
                  <td className="py-4">
                    <div className={`flex items-center space-x-1 ${isPositive ? 'text-primary-green' : 'text-primary-pink'}`}>
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span className="font-medium">{stock.changePercent}</span>
                    </div>
                  </td>
                  <td className="py-4 text-white/70">{stock.volume}</td>
                  <td className="py-4 text-white/70">{stock.marketCap}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
