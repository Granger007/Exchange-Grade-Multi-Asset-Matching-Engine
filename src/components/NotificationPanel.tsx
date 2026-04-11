'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Bell, X, TrendingUp, AlertTriangle, DollarSign, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'PRICE':
      return <TrendingUp size={16} className="text-primary-green" />;
    case 'RISK':
      return <AlertTriangle size={16} className="text-primary-pink" />;
    case 'ORDER_OPEN':
    case 'ORDER_FILLED':
    case 'TRADE':
      return <DollarSign size={16} className="text-primary-blue" />;
    default:
      return <Info size={16} className="text-primary-purple" />;
  }
};

export const NotificationPanel: React.FC = () => {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications from MySQL DB
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications?userId=test-user-123');
        if (res.ok) {
          const data = await res.json();
          setNotificationList(data);
        }
      } catch (err) {
        console.error('Failed to fetch notifications');
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notificationList.filter(n => !n.isRead).length;

  const markAsRead = async (id: string, isCurrentlyRead: boolean) => {
    if (isCurrentlyRead) return;
    
    // Optistic UI update
    setNotificationList(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );

    // Persist to MySQL
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });
    } catch (err) {
      console.error('Failed to update read status');
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notificationList.filter(n => !n.isRead).map(n => n.id);
    
    // Optimistic UI update
    setNotificationList(prev => prev.map(notif => ({ ...notif, isRead: true })));

    // Persist to MySQL (simple loop for batch, properly would be a batch endpoint)
    unreadIds.forEach(id => {
      fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      }).catch(console.error);
    });
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
                {notificationList.map((notification) => {
                  const date = new Date(notification.createdAt);
                  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-white/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id, notification.isRead)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-white' : 'text-white/70'
                            }`}>
                              {notification.title}
                            </h4>
                          </div>
                          <p className="text-white/50 text-sm mb-2">
                            {notification.message}
                          </p>
                          <p className="text-white/30 text-xs">
                            {timeString}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
