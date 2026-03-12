'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, X } from 'lucide-react';

interface RiskAlert {
  id: number;
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  asset: string;
  timestamp: string;
  action?: string;
}

const riskAlerts: RiskAlert[] = [
  {
    id: 1,
    type: 'high',
    title: 'Tesla Volatility Spike',
    description: 'Tesla volatility increased by 12% in the last 24 hours',
    asset: 'TSLA',
    timestamp: '2 hours ago',
    action: 'Consider reducing exposure'
  },
  {
    id: 2,
    type: 'high',
    title: 'Crypto Market Risk',
    description: 'Overall crypto market showing high volatility indicators',
    asset: 'Market',
    timestamp: '4 hours ago',
    action: 'Recommended: reduce exposure'
  },
  {
    id: 3,
    type: 'medium',
    title: 'Bitcoin Correction Warning',
    description: 'BTC showing signs of potential correction below $42,000',
    asset: 'BTC',
    timestamp: '6 hours ago',
    action: 'Set stop-loss at $41,500'
  },
  {
    id: 4,
    type: 'medium',
    title: 'Apple Earnings Approaching',
    description: 'AAPL earnings report due next week - expect increased volatility',
    asset: 'AAPL',
    timestamp: '1 day ago',
    action: 'Review position sizing'
  },
  {
    id: 5,
    type: 'low',
    title: 'Portfolio Diversification Alert',
    description: 'Tech stocks represent 65% of portfolio - consider diversification',
    asset: 'Portfolio',
    timestamp: '2 days ago',
    action: 'Add defensive positions'
  },
];

const getAlertStyles = (type: string) => {
  switch (type) {
    case 'high':
      return {
        accent: 'pink',
        icon: <AlertTriangle size={20} />,
        borderColor: 'border-primary-pink/30',
        bgColor: 'bg-primary-pink/10'
      };
    case 'medium':
      return {
        accent: 'purple',
        icon: <TrendingDown size={20} />,
        borderColor: 'border-primary-purple/30',
        bgColor: 'bg-primary-purple/10'
      };
    case 'low':
      return {
        accent: 'blue',
        icon: <Shield size={20} />,
        borderColor: 'border-primary-blue/30',
        bgColor: 'bg-primary-blue/10'
      };
    default:
      return {
        accent: 'green',
        icon: <TrendingUp size={20} />,
        borderColor: 'border-primary-green/30',
        bgColor: 'bg-primary-green/10'
      };
  }
};

export const RiskAlerts: React.FC = () => {
  const [alerts, setAlerts] = React.useState(riskAlerts);

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle size={24} className="text-primary-pink" />
          <h3 className="text-lg font-semibold text-white">Risk Monitoring</h3>
          <span className="px-2 py-1 bg-primary-pink/20 text-primary-pink rounded-full text-xs font-medium">
            {alerts.length} Active
          </span>
        </div>
        <button className="text-primary-blue hover:text-primary-blue/80 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {alerts.map((alert) => {
          const styles = getAlertStyles(alert.type);
          
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border ${styles.borderColor} ${styles.bgColor} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`text-${styles.accent}`}>
                    {styles.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{alert.title}</h4>
                    <p className="text-white/70 text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-white/50">Asset: {alert.asset}</span>
                      <span className="text-white/50">{alert.timestamp}</span>
                    </div>
                    {alert.action && (
                      <div className="mt-3 p-2 bg-white/5 rounded-lg">
                        <p className="text-primary-blue text-sm font-medium">
                          💡 {alert.action}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8">
          <Shield size={48} className="text-primary-green mx-auto mb-4" />
          <p className="text-white/70">No active risk alerts</p>
          <p className="text-white/50 text-sm mt-2">Your portfolio is looking healthy</p>
        </div>
      )}
    </GlassCard>
  );
};
