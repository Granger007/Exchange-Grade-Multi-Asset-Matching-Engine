'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { GlassCard } from '@/components/GlassCard';
import { NotificationPanel } from '@/components/NotificationPanel';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      
      <main className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-white/70">Stay updated with market alerts and trading notifications</p>
          </div>
          
          <GlassCard className="p-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-white mb-4">Notification Center</h3>
              <p className="text-white/70 mb-8">
                All your notifications and alerts in one place. Use the floating notification panel in the bottom right for quick access.
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-blue/20 text-primary-blue border border-primary-blue/30 rounded-lg">
                <span>🔔</span>
                <span>Check the floating panel for active notifications</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
      
      <NotificationPanel />
    </div>
  );
}
