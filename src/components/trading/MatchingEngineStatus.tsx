'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassCard';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

interface EngineMetrics {
  status: 'online' | 'offline' | 'degraded';
  orderThroughput: number;
  tradesPerSecond: number;
  engineLatency: number;
  uptime: number;
  activeConnections: number;
}

export const MatchingEngineStatus: React.FC = () => {
  const [metrics, setMetrics] = useState<EngineMetrics>({
    status: 'online',
    orderThroughput: 3200,
    tradesPerSecond: 900,
    engineLatency: 2.4,
    uptime: 99.98,
    activeConnections: 1542
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngineStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/system/status');
        const data = await response.json();
        
        const mockMetrics: EngineMetrics = {
          status: 'online',
          orderThroughput: Math.floor(Math.random() * 500) + 3000,
          tradesPerSecond: Math.floor(Math.random() * 200) + 800,
          engineLatency: Math.random() * 2 + 1.5,
          uptime: 99.98,
          activeConnections: Math.floor(Math.random() * 200) + 1400
        };
        
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Error fetching engine status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEngineStatus();
    const interval = setInterval(fetchEngineStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-500/20';
      case 'offline':
        return 'text-red-400 bg-red-500/20';
      case 'degraded':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-white/70 bg-white/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Activity size={16} className="text-green-400" />;
      case 'offline':
        return <Activity size={16} className="text-red-400" />;
      case 'degraded':
        return <Activity size={16} className="text-yellow-400" />;
      default:
        return <Activity size={16} className="text-white/70" />;
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-4">
        <h3 className="text-white font-semibold mb-4">Engine Status</h3>
        <div className="text-white/50 text-center py-8">Loading...</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Matching Engine</h3>
        <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metrics.status)}`}>
          {getStatusIcon(metrics.status)}
          <span className="uppercase">{metrics.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white/50 text-xs">Orders/sec</p>
              <p className="text-white font-semibold">{metrics.orderThroughput.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <TrendingUp size={16} className="text-purple-400" />
            </div>
            <div>
              <p className="text-white/50 text-xs">Trades/sec</p>
              <p className="text-white font-semibold">{metrics.tradesPerSecond.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Clock size={16} className="text-green-400" />
            </div>
            <div>
              <p className="text-white/50 text-xs">Latency</p>
              <p className="text-white font-semibold">{metrics.engineLatency.toFixed(1)}ms</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Activity size={16} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-white/50 text-xs">Connections</p>
              <p className="text-white font-semibold">{metrics.activeConnections.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">Uptime</span>
          <span className="text-green-400 text-xs font-medium">{metrics.uptime}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
          <div 
            className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${metrics.uptime}%` }}
          ></div>
        </div>
      </div>
    </GlassCard>
  );
};
