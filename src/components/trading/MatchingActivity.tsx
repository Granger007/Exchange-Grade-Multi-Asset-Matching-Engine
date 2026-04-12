'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface MatchEvent {
  id: string;
  type: 'BUY_MATCH' | 'SELL_MATCH' | 'PARTIAL_FILL' | 'TRADE_COMPLETED' | 'FIFO_QUEUE' | 'PRICE_IMPROVEMENT';
  message: string;
  time: string;
  price?: number;
  quantity?: number;
  side?: 'BUY' | 'SELL';
}

export const MatchingActivity: React.FC = () => {
  const [events, setEvents] = useState<MatchEvent[]>([]);

  useEffect(() => {
    const mockMessages = [
      { type: 'BUY_MATCH', msg: 'Buy order matched at $64,002.50', price: 64002.50, quantity: 0.5, side: 'BUY' },
      { type: 'SELL_MATCH', msg: 'Sell order matched at $64,005.00', price: 64005.00, quantity: 0.3, side: 'SELL' },
      { type: 'PARTIAL_FILL', msg: 'Partial fill executed: 0.25 BTC', price: 64003.75, quantity: 0.25 },
      { type: 'TRADE_COMPLETED', msg: 'FIFO trade completed - Order #ORD-8492', price: 64002.50 },
      { type: 'FIFO_QUEUE', msg: 'New order queued at price level $64,000.00', price: 64000.00 },
      { type: 'PRICE_IMPROVEMENT', msg: 'Price improvement detected for buy orders', price: 64001.25 }
    ];

    const interval = setInterval(() => {
      setEvents(prev => {
        const randomMsg = mockMessages[Math.floor(Math.random() * mockMessages.length)] as any;
        const newEvent: MatchEvent = {
          id: `evt-${Math.random().toString(36).substr(2, 6)}`,
          type: randomMsg.type,
          message: randomMsg.msg,
          price: randomMsg.price,
          quantity: randomMsg.quantity,
          side: randomMsg.side,
          time: new Date().toLocaleTimeString([], { hour12: false })
        };
        return [newEvent, ...prev].slice(0, 20);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string, side?: 'BUY' | 'SELL') => {
    switch(type) {
      case 'BUY_MATCH': return <TrendingUp size={14} className="text-primary-green mt-0.5" />;
      case 'SELL_MATCH': return <TrendingDown size={14} className="text-primary-pink mt-0.5" />;
      case 'PARTIAL_FILL': return <Clock size={14} className="text-yellow-400 mt-0.5" />;
      case 'TRADE_COMPLETED': return <CheckCircle size={14} className="text-primary-green mt-0.5" />;
      case 'FIFO_QUEUE': return <Activity size={14} className="text-blue-400 mt-0.5" />;
      case 'PRICE_IMPROVEMENT': return <ArrowRight size={14} className="text-purple-400 mt-0.5" />;
      default: return null;
    }
  };

  const getEventColor = (type: string, side?: 'BUY' | 'SELL') => {
    switch(type) {
      case 'BUY_MATCH': return 'text-primary-green';
      case 'SELL_MATCH': return 'text-primary-pink';
      case 'PARTIAL_FILL': return 'text-yellow-400';
      case 'TRADE_COMPLETED': return 'text-primary-green';
      case 'FIFO_QUEUE': return 'text-blue-400';
      case 'PRICE_IMPROVEMENT': return 'text-purple-400';
      default: return 'text-white/90';
    }
  };

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-white flex items-center">
          <Activity size={18} className="mr-2 text-primary-purple" />
          FIFO Matching Activity
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
        {events.map((event) => (
          <div key={event.id} className="flex items-start space-x-3 text-sm animate-fade-in p-2 rounded-lg hover:bg-white/5 transition-colors">
            {getIcon(event.type, event.side)}
            <div className="flex-1">
              <p className={`${getEventColor(event.type, event.side)} font-medium`}>
                {event.message}
              </p>
              {event.price && (
                <p className="text-xs text-white/60">
                  Price: ${event.price.toFixed(2)}
                  {event.quantity && ` | Qty: ${event.quantity.toFixed(4)} BTC`}
                </p>
              )}
              <p className="text-xs text-white/40 mt-1">{event.time}</p>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center text-white/50 text-sm py-4">
            Waiting for FIFO matching events...
          </div>
        )}
      </div>
    </div>
  );
};
