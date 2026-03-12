'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { GlassCard } from './GlassCard';

const portfolioData = [
  { date: 'Jan', value: 45000 },
  { date: 'Feb', value: 52000 },
  { date: 'Mar', value: 48000 },
  { date: 'Apr', value: 61000 },
  { date: 'May', value: 58000 },
  { date: 'Jun', value: 67000 },
  { date: 'Jul', value: 72000 },
];

const assetAllocationData = [
  { name: 'Crypto', value: 35, fill: '#a855f7' },
  { name: 'Stocks', value: 40, fill: '#3b82f6' },
  { name: 'Equity', value: 25, fill: '#10b981' },
];

export const PortfolioChart: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GlassCard className="lg:col-span-2 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Portfolio Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={portfolioData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey="date" 
              stroke="#ffffff50"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#ffffff50"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#ffffff' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Asset Allocation</h3>
        <div className="space-y-4">
          {assetAllocationData.map((asset, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70">{asset.name}</span>
                <span className="text-white font-medium">{asset.value}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${asset.value}%`,
                    backgroundColor: asset.fill
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70">Total Value</span>
            <span className="text-2xl font-bold text-white">$72,000</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Daily Change</span>
            <span className="text-primary-green font-medium">+$2,340 (+3.4%)</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
