'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { CryptoTable } from '@/components/CryptoTable';
import { LiveStreamWidget } from '@/components/trading/LiveStreamWidget';
import { LiveCryptoFeedWidget } from '@/components/trading/LiveCryptoFeedWidget';
import { Sparkles, Flame } from 'lucide-react';

export default function CryptoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      
      <main className="ml-64 pt-20 p-6">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              Cryptocurrency Markets
              <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded border border-primary/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Live Data
              </span>
            </h1>
            <p className="text-white/70">Experience real-time trading with millisecond latency order books.</p>
          </div>

          {/* Top Section: WebSocket Feed & Live Stream */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> High-Frequency Feed
              </h2>
              <LiveCryptoFeedWidget />
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Social Trading
              </h2>
              <LiveStreamWidget />
            </div>
          </div>
          
          {/* Bottom Section: Standard Crypto Table */}
          <div className="pt-4 border-t border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">All Markets</h2>
            <CryptoTable />
          </div>

        </div>
      </main>
    </div>
  );
}
