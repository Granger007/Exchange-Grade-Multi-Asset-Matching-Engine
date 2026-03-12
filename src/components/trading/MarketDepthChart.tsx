'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DepthData {
  price: number;
  bidDepth: number;
  askDepth: number;
}

export const MarketDepthChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [depthData, setDepthData] = useState<DepthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketDepth = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/market-depth/${symbol}`);
        const data = await response.json();
        
        const mockData: DepthData[] = [
          { price: 43240, bidDepth: 0, askDepth: 0 },
          { price: 43241, bidDepth: 0, askDepth: 0.125 },
          { price: 43242, bidDepth: 0, askDepth: 0.375 },
          { price: 43243, bidDepth: 0, askDepth: 0.625 },
          { price: 43244, bidDepth: 0, askDepth: 0.950 },
          { price: 43245, bidDepth: 0, askDepth: 1.325 },
          { price: 43246, bidDepth: 0, askDepth: 1.775 },
          { price: 43247, bidDepth: 0, askDepth: 2.250 },
          { price: 43248, bidDepth: 0, askDepth: 2.800 },
          { price: 43249, bidDepth: 0, askDepth: 3.425 },
          { price: 43250, bidDepth: 0.150, askDepth: 4.125 },
          { price: 43251, bidDepth: 0.425, askDepth: 0 },
          { price: 43252, bidDepth: 0.775, askDepth: 0 },
          { price: 43253, bidDepth: 1.200, askDepth: 0 },
          { price: 43254, bidDepth: 1.675, askDepth: 0 },
          { price: 43255, bidDepth: 2.225, askDepth: 0 },
          { price: 43256, bidDepth: 2.850, askDepth: 0 },
          { price: 43257, bidDepth: 3.550, askDepth: 0 },
          { price: 43258, bidDepth: 4.325, askDepth: 0 },
          { price: 43259, bidDepth: 5.175, askDepth: 0 },
          { price: 43260, bidDepth: 0, askDepth: 0 },
        ];
        
        setDepthData(mockData);
      } catch (error) {
        console.error('Error fetching market depth:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketDepth();
    const interval = setInterval(fetchMarketDepth, 3000);
    return () => clearInterval(interval);
  }, [symbol]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/20 rounded-lg p-2 text-xs">
          <p className="text-white">Price: ${payload[0].payload.price.toFixed(2)}</p>
          {payload[0].payload.bidDepth > 0 && (
            <p className="text-green-400">Bid Depth: {payload[0].payload.bidDepth.toFixed(3)}</p>
          )}
          {payload[0].payload.askDepth > 0 && (
            <p className="text-pink-400">Ask Depth: {payload[0].payload.askDepth.toFixed(3)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <GlassCard className="p-4">
        <h3 className="text-white font-semibold mb-4">Market Depth</h3>
        <div className="text-white/50 text-center py-8">Loading...</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Market Depth</h3>
        <span className="text-white/70 text-sm">{symbol}</span>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={depthData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <defs>
              <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="price" 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={10}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="bidDepth"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#bidGradient)"
            />
            <Area
              type="monotone"
              dataKey="askDepth"
              stroke="#ec4899"
              strokeWidth={2}
              fill="url(#askGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-white/70 text-xs">Bids</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
          <span className="text-white/70 text-xs">Asks</span>
        </div>
      </div>
    </GlassCard>
  );
};
