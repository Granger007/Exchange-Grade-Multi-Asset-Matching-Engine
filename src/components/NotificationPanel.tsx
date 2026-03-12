'use client';

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Bell, X, TrendingUp, AlertTriangle, DollarSign, Info } from 'lucide-react';

interface Notification {
  id: number;
  type: 'price' | 'risk' | 'trade' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    type: 'price',
    title: 'BTC Price Alert',
    message: 'Bitcoin reached $44,000 - 2.3% increase in the last hour',
    timestamp: '5 min ago',
    read: false
  },
  {
    id: 2,
    type: 'trade',
    title: 'Trade Executed',
    message: 'Buy order for 10 ETH filled at $2,234',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'risk',
    title: 'Risk Alert',
    message: 'Portfolio volatility increased by 15%',
    timestamp: '2 hours ago',
    read: true
  },
  {
    id: 4,
    type: 'info',
    title: 'Market Update',
    message: 'S&P 500 reached new all-time high',
    timestamp: '3 hours ago',
    read: true
  },
  {
    id: 5,
    type: 'price',
    title: 'TSLA Price Drop',
    message: 'Tesla down 5.2% in pre-market trading',
    timestamp: '4 hours ago',
    read: true
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'price':
      return <TrendingUp size={16} className="text-primary-green" />;
    case 'risk':
      return <AlertTriangle size={16} className="text-primary-pink" />;
    case 'trade':
      return <DollarSign size={16} className="primary-blue" />;
    case 'info':
      return <Info size={16} className="text-primary-purple" />;
    default:
      return <Bell size={16} className="text-white/50" />;
  }
};

export const NotificationPanel: React.FC = () => {
  const [notificationList, setNotificationList] = useState(notifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotificationList(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id: number) => {
    setNotificationList(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-4 glass-card hover:scale-105 transition-transform"
      >
        <Bell size={24} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary-pink rounded-full flex items-center justify-center text-white text-xs font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <GlassCard className="absolute bottom-20 right-0 w-96 max-h-96 overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <Bell size={20} className="text-white" />
              <h3 className="text-white font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-primary-pink/20 text-primary-pink rounded-full text-xs">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-primary-blue hover:text-primary-blue/80 text-xs"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notificationList.length === 0 ? (
              <div className="text-center py-8">
                <Bell size={48} className="text-white/30 mx-auto mb-4" />
                <p className="text-white/50">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notificationList.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-white/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-white' : 'text-white/70'
                          }`}>
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissNotification(notification.id);
                            }}
                            className="text-white/30 hover:text-white/50"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <p className="text-white/50 text-sm mb-2">
                          {notification.message}
                        </p>
                        <p className="text-white/30 text-xs">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
