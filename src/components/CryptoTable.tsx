'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoData {
  rank: number;
  coin: string;
  symbol: string;
  price: string;
  change24h: number;
  changePercent: string;
  volume: string;
  marketCap: string;
}

const cryptoData: CryptoData[] = [
  { rank: 1, coin: 'Bitcoin', symbol: 'BTC', price: '$43,567', change24h: 1234, changePercent: '+2.9%', volume: '$28.5B', marketCap: '$852B' },
  { rank: 2, coin: 'Ethereum', symbol: 'ETH', price: '$2,234', change24h: -89, changePercent: '-3.8%', volume: '$15.2B', marketCap: '$268B' },
  { rank: 3, coin: 'Binance Coin', symbol: 'BNB', price: '$312', change24h: 8, changePercent: '+2.6%', volume: '$1.8B', marketCap: '$48B' },
  { rank: 4, coin: 'Cardano', symbol: 'ADA', price: '$0.58', change24h: 0.02, changePercent: '+3.6%', volume: '$523M', marketCap: '$20B' },
  { rank: 5, coin: 'Solana', symbol: 'SOL', price: '$98', change24h: -2.1, changePercent: '-2.1%', volume: '$2.1B', marketCap: '$42B' },
];

export const CryptoTable: React.FC = () => {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Cryptocurrency Markets</h3>
        <button className="text-primary-blue hover:text-primary-blue/80 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th className="pb-3 text-white/50 text-sm font-medium">#</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Coin</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Price</th>
              <th className="pb-3 text-white/50 text-sm font-medium">24h Change</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Volume</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Market Cap</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Trade</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto) => {
              const isPositive = crypto.change24h >= 0;
              return (
                <tr key={crypto.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 text-white/70">{crypto.rank}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-purple to-primary-blue flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{crypto.symbol.substring(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{crypto.coin}</p>
                        <p className="text-white/50 text-sm">{crypto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-white font-medium">{crypto.price}</td>
                  <td className="py-4">
                    <div className={`flex items-center space-x-1 ${isPositive ? 'text-primary-green' : 'text-primary-pink'}`}>
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span className="font-medium">{crypto.changePercent}</span>
                    </div>
                  </td>
                  <td className="py-4 text-white/70">{crypto.volume}</td>
                  <td className="py-4 text-white/70">{crypto.marketCap}</td>
                  <td className="py-4">
                    <button className="px-3 py-1 bg-primary-green/20 text-primary-green border border-primary-green/30 rounded-lg hover:bg-primary-green/30 transition-colors text-sm">
                      Trade
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
