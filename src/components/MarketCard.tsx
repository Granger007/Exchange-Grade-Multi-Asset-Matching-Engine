import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketCardProps {
  title: string;
  value: string;
  change: number;
  changePercent: string;
  icon?: React.ReactNode;
}

export const MarketCard: React.FC<MarketCardProps> = ({ 
  title, 
  value, 
  change, 
  changePercent, 
  icon 
}) => {
  const isPositive = change >= 0;

  return (
    <GlassCard hover className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/70 text-sm font-medium">{title}</h3>
        {icon}
      </div>
      
      <div className="mb-2">
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      
      <div className={`flex items-center space-x-2 ${isPositive ? 'text-primary-green' : 'text-primary-pink'}`}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span className="font-medium">
          {isPositive ? '+' : ''}{change} ({changePercent})
        </span>
      </div>
    </GlassCard>
  );
};
