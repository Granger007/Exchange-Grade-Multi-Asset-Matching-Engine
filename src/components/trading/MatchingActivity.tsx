'use client';

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock } from 'lucide-react';

interface MatchEvent {
  id: string;
  type: 'MATCHED' | 'PARTIAL' | 'COMPLETED';
  message: string;
  time: string;
}

export const MatchingActivity: React.FC = () => {
  const [events, setEvents] = useState<MatchEvent[]>([]);

  useEffect(() => {
    const mockMessages = [
      { type: 'MATCHED', msg: 'Order matched at $64,002.50' },
      { type: 'PARTIAL', msg: 'Partial fill executed: 0.5 BTC' },
      { type: 'COMPLETED', msg: 'Trade completed #T-8492' }
    ];

    const interval = setInterval(() => {
      setEvents(prev => {
        const randomMsg = mockMessages[Math.floor(Math.random() * mockMessages.length)] as any;
        const newEvent: MatchEvent = {
          id: `evt-${Math.random().toString(36).substr(2, 6)}`,
          type: randomMsg.type,
          message: randomMsg.msg,
          time: new Date().toLocaleTimeString([], { hour12: false })
        };
        return [newEvent, ...prev].slice(0, 15);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch(type) {
      case 'MATCHED': return <Activity size={14} className="text-primary-blue mt-0.5" />;
      case 'PARTIAL': return <Clock size={14} className="text-yellow-400 mt-0.5" />;
      case 'COMPLETED': return <CheckCircle size={14} className="text-primary-green mt-0.5" />;
      default: return null;
    }
  };

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold text-white flex items-center">
          <Activity size={18} className="mr-2 text-primary-purple" />
          Engine Activity
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-start space-x-3 text-sm animate-fade-in">
            {getIcon(event.type)}
            <div>
              <p className="text-white/90">{event.message}</p>
              <p className="text-xs text-white/40">{event.time}</p>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center text-white/50 text-sm py-4">
            Waiting for engine events...
          </div>
        )}
      </div>
    </div>
  );
};
