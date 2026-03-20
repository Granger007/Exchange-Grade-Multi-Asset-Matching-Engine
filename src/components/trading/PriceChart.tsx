'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const generateMockChartData = () => {
  let basePrice = 64000;
  return Array.from({ length: 40 }, (_, i) => {
    basePrice += (Math.random() * 400 - 180);
    return {
      time: new Date(Date.now() - (40 - i) * 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: basePrice,
    };
  });
};

export const PriceChart: React.FC = () => {
  const [data, setData] = useState<{time: string, price: number}[]>([]);

  useEffect(() => {
    setData(generateMockChartData());
  }, []);

  return (
    <div className="glass-card flex flex-col h-full w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {['15m', '1H', '4H', '1D', '1W'].map((tf) => (
            <button key={tf} className={`px-3 py-1 text-xs rounded-md transition-colors ${
              tf === '1H' ? 'bg-primary-blue text-white' : 'text-white/50 hover:bg-white/10 hover:text-white'
            }`}>
              {tf}
            </button>
          ))}
        </div>
        <div className="text-xs text-white/50">
          Candlestick/Area Placeholder
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} />
            <YAxis domain={['auto', 'auto']} stroke="rgba(255,255,255,0.2)" fontSize={12} tickFormatter={(val) => `$${val.toLocaleString()}`} orientation="right" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(17,17,17,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#10b981' }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
            />
            <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
