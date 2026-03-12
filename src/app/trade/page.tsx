'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { GlassCard } from '@/components/GlassCard';
import { MarketSelector } from '@/components/trading/MarketSelector';
import { OrderBook } from '@/components/trading/OrderBook';
import { TradePanel } from '@/components/trading/TradePanel';
import { RecentTrades } from '@/components/trading/RecentTrades';
import { OpenOrders } from '@/components/trading/OpenOrders';
import { MarketDepthChart } from '@/components/trading/MarketDepthChart';
import { MatchingEngineStatus } from '@/components/trading/MatchingEngineStatus';

export default function TradingPage() {
  const [selectedMarket, setSelectedMarket] = useState('BTC/USDT');

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      
      <main className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Trading Interface</h1>
            <p className="text-white/70">Professional trading with exchange-grade matching engine</p>
          </div>

          {/* Market Selector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <MarketSelector 
                selectedMarket={selectedMarket}
                onMarketChange={setSelectedMarket}
              />
            </div>
            <div className="lg:col-span-2">
              <MatchingEngineStatus />
            </div>
          </div>

          {/* Price Chart Placeholder */}
          <GlassCard className="p-6">
            <h3 className="text-white font-semibold mb-4">Price Chart</h3>
            <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
              <p className="text-white/50">Price chart will be integrated here</p>
            </div>
          </GlassCard>

          {/* Order Book and Trade Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderBook symbol={selectedMarket} />
            <TradePanel symbol={selectedMarket} />
          </div>

          {/* Recent Trades and Open Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentTrades symbol={selectedMarket} />
            <OpenOrders />
          </div>

          {/* Market Depth Chart */}
          <div className="grid grid-cols-1 gap-6">
            <MarketDepthChart symbol={selectedMarket} />
          </div>
        </div>
      </main>
    </div>
  );
}
