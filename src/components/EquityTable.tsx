'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown, Shield, AlertTriangle } from 'lucide-react';

interface EquityData {
  company: string;
  investmentValue: string;
  returnPercent: number;
  returnAmount: string;
  riskScore: number;
  shares: number;
}

const equityData: EquityData[] = [
  { company: 'Apple Inc.', investmentValue: '$15,000', returnPercent: 12.4, returnAmount: '$1,860', riskScore: 3, shares: 84 },
  { company: 'Microsoft Corp.', investmentValue: '$12,000', returnPercent: 8.7, returnAmount: '$1,044', riskScore: 2, shares: 32 },
  { company: 'Tesla Inc.', investmentValue: '$8,000', returnPercent: -5.2, returnAmount: '-$416', riskScore: 8, shares: 33 },
  { company: 'Amazon.com Inc.', investmentValue: '$10,000', returnPercent: 15.3, returnAmount: '$1,530', riskScore: 4, shares: 64 },
  { company: 'Alphabet Inc.', investmentValue: '$6,000', returnPercent: 6.8, returnAmount: '$408', riskScore: 3, shares: 42 },
];

const getRiskColor = (score: number) => {
  if (score <= 3) return 'text-primary-green';
  if (score <= 6) return 'text-yellow-500';
  return 'text-primary-pink';
};

const getRiskIcon = (score: number) => {
  if (score <= 3) return <Shield size={14} />;
  if (score <= 6) return <AlertTriangle size={14} />;
  return <AlertTriangle size={14} />;
};

const getRiskLabel = (score: number) => {
  if (score <= 3) return 'Low';
  if (score <= 6) return 'Medium';
  return 'High';
};

export const EquityTable: React.FC = () => {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Equity Investments</h3>
        <button className="text-primary-blue hover:text-primary-blue/80 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-white/10">
              <th className="pb-3 text-white/50 text-sm font-medium">Company</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Investment</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Return</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Risk Score</th>
              <th className="pb-3 text-white/50 text-sm font-medium">Shares</th>
            </tr>
          </thead>
          <tbody>
            {equityData.map((equity, index) => {
              const isPositive = equity.returnPercent >= 0;
              const riskColor = getRiskColor(equity.riskScore);
              
              return (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-green to-primary-blue flex items-center justify-center">
                        <span className="text-white font-bold">{equity.company.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{equity.company}</p>
                        <p className="text-white/50 text-sm">{equity.shares} shares</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className="text-white font-medium">{equity.investmentValue}</p>
                      <p className={`text-sm ${isPositive ? 'text-primary-green' : 'text-primary-pink'}`}>
                        {equity.returnAmount}
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className={`flex items-center space-x-1 ${isPositive ? 'text-primary-green' : 'text-primary-pink'}`}>
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span className="font-medium">
                        {isPositive ? '+' : ''}{equity.returnPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className={`flex items-center space-x-2 ${riskColor}`}>
                      {getRiskIcon(equity.riskScore)}
                      <div>
                        <span className="font-medium">{equity.riskScore}/10</span>
                        <span className="text-xs ml-1">({getRiskLabel(equity.riskScore)})</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-white/70">{equity.shares}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-white/50 text-sm mb-1">Total Invested</p>
          <p className="text-white font-bold">$51,000</p>
        </div>
        <div className="text-center">
          <p className="text-white/50 text-sm mb-1">Total Returns</p>
          <p className="text-primary-green font-bold">+$4,426</p>
        </div>
        <div className="text-center">
          <p className="text-white/50 text-sm mb-1">Avg Risk Score</p>
          <p className="text-yellow-500 font-bold">4.0/10</p>
        </div>
      </div>
    </GlassCard>
  );
};
