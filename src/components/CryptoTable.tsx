'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoData {
  rank: number;
  coin: string;
  symbol: string;
  price: number;
  change24h: number; // Raw delta
  changePercent: number; // Percentage
  volume: string;
  marketCap: string;
  flashDirection?: 'up' | 'down' | null;
}

const initialCryptoData: CryptoData[] = [
  { rank: 1, coin: 'Bitcoin', symbol: 'BTC', price: 64320.50, change24h: 1234, changePercent: 2.9, volume: '$28.5B', marketCap: '$852B' },
  { rank: 2, coin: 'Ethereum', symbol: 'ETH', price: 3450.20, change24h: -89, changePercent: -3.8, volume: '$15.2B', marketCap: '$268B' },
  { rank: 3, coin: 'Binance Coin', symbol: 'BNB', price: 580.40, change24h: 8, changePercent: 2.6, volume: '$1.8B', marketCap: '$48B' },
  { rank: 4, coin: 'Cardano', symbol: 'ADA', price: 0.58, change24h: 0.02, changePercent: 3.6, volume: '$523M', marketCap: '$20B' },
  { rank: 5, coin: 'Solana', symbol: 'SOL', price: 145.20, change24h: -2.1, changePercent: -2.1, volume: '$2.1B', marketCap: '$42B' },
  { rank: 6, coin: 'Ripple', symbol: 'XRP', price: 0.62, change24h: 0.01, changePercent: 1.2, volume: '$1.1B', marketCap: '$34B' },
  { rank: 7, coin: 'Polkadot', symbol: 'DOT', price: 8.40, change24h: 0.1, changePercent: 1.5, volume: '$320M', marketCap: '$11B' },
];

export const CryptoTable: React.FC = () => {
  const [data, setData] = useState<CryptoData[]>(initialCryptoData);

  useEffect(() => {
    // Simulate live market data updates
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((crypto) => {
          // 30% chance a row updates per tick to make it feel organic
          if (Math.random() > 0.3) {
            return { ...crypto, flashDirection: null };
          }

          const volatility = crypto.price * 0.001; // 0.1% max jump
          const change = (Math.random() - 0.5) * 2 * volatility;
          const newPrice = crypto.price + change;

          return {
            ...crypto,
            price: newPrice,
            flashDirection: change >= 0 ? 'up' : 'down',
            // Update 24h change slightly
            changePercent: crypto.changePercent + (change / crypto.price) * 100
          };
        })
      );
    }, 800); // Ticks every 800ms

    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Cryptocurrency Markets</h3>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th className="pb-3 text-white/50 text-sm font-medium">#</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Coin</th>
              <th className="pb-3 text-white/50 text-sm font-medium text-right pr-4">Price</th>
              <th className="pb-3 text-white/50 text-sm font-medium">24h Change</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Volume</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Market Cap</th>
              <th className="pb-3 text-white/50 text-sm font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((crypto) => {
              const isPositive = crypto.changePercent >= 0;
              
              // Determine flash class
              let flashClass = "transition-colors duration-500 delay-75"; 
              if (crypto.flashDirection === 'up') flashClass = "bg-emerald-500/20 transition-none";
              else if (crypto.flashDirection === 'down') flashClass = "bg-red-500/20 transition-none";

              return (
                <tr key={crypto.rank} className={`border-b border-white/5 hover:bg-white/10 ${flashClass}`}>
                  <td className="py-3 text-white/70 pl-2">{crypto.rank}</td>
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <span className="text-white text-[10px] font-bold">{crypto.symbol.substring(0, 3)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{crypto.coin}</p>
                        <p className="text-white/50 text-xs">{crypto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-white font-mono font-medium text-right pr-4">
                    ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: crypto.price < 10 ? 4 : 2, maximumFractionDigits: crypto.price < 10 ? 4 : 2 })}
                  </td>
                  <td className="py-3">
                    <div className={`flex items-center space-x-1 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>{isPositive ? '+' : ''}{crypto.changePercent.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-white/70 text-sm">{crypto.volume}</td>
                  <td className="py-3 text-white/70 text-sm">{crypto.marketCap}</td>
                  <td className="py-3 text-center">
                    <button className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/30 rounded inline-flex items-center justify-center hover:bg-primary hover:text-black transition-all text-xs font-bold uppercase tracking-wider">
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
