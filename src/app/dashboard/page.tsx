'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { GlassCard } from '@/components/GlassCard';
import { MarketCard } from '@/components/MarketCard';
import { PortfolioChart } from '@/components/PortfolioChart';
import { CryptoTable } from '@/components/CryptoTable';
import { StockTable } from '@/components/StockTable';
import { EquityTable } from '@/components/EquityTable';
import { RiskAlerts } from '@/components/RiskAlerts';
import { NotificationPanel } from '@/components/NotificationPanel';
import { RecentTradesWidget } from '@/components/trading/RecentTradesWidget';
import { MiniOrderBook } from '@/components/trading/MiniOrderBook';
import { MatchingStrategyIndicator } from '@/components/trading/MatchingStrategyIndicator';
import { TrendingUp, TrendingDown, Bitcoin, DollarSign, BarChart3 } from 'lucide-react';

export type Trade = {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: string;
};

export type Prices = {
  BTC: number;
  ETH: number;
};

export default function Dashboard() {
  const [prices, setPrices] = useState<Prices>({ BTC: 64000, ETH: 3500 });
  const [prevPrices, setPrevPrices] = useState<Prices>({ BTC: 64000, ETH: 3500 });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [strategy, setStrategy] = useState<string>('FIFO');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await fetch('/api/price');
        const pData = await pRes.json();
        setPrevPrices((old) => pData.BTC ? old : old); // Small trick to capture old prices safely
        setPrices((old) => {
          setPrevPrices(old);
          return pData;
        });

        const tRes = await fetch('/api/trade');
        const tData = await tRes.json();
        setTrades(tData);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatChange = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(2)}`;
  const formatPct = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;

  const btcChange = prices.BTC - prevPrices.BTC;
  const btcPct = prevPrices.BTC ? (btcChange / prevPrices.BTC) * 100 : 0;
  
  const ethChange = prices.ETH - prevPrices.ETH;
  const ethPct = prevPrices.ETH ? (ethChange / prevPrices.ETH) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      
      <main className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Trading Dashboard</h1>
              <p className="text-white/70">Welcome back! Here's your market overview</p>
            </div>
            <MatchingStrategyIndicator strategy={strategy} />
          </div>

          {/* Market Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MarketCard
              title="Bitcoin"
              value={formatPrice(prices.BTC)}
              change={btcChange}
              changePercent={formatPct(btcPct)}
              icon={<Bitcoin size={24} className="text-orange-500" />}
            />
            <MarketCard
              title="Ethereum"
              value={formatPrice(prices.ETH)}
              change={ethChange}
              changePercent={formatPct(ethPct)}
              icon={<TrendingUp size={24} className="text-blue-500" />}
            />
            <MarketCard
              title="S&P 500"
              value="4,512.28"
              change={28.45}
              changePercent="+0.64%"
              icon={<BarChart3 size={24} className="text-green-500" />}
            />
            <MarketCard
              title="NASDAQ"
              value="14,234.56"
              change={-45.67}
              changePercent="-0.32%"
              icon={<TrendingDown size={24} className="text-purple-500" />}
            />
          </div>

          {/* Portfolio Charts */}
          <PortfolioChart />

          {/* Top Gainers and Losers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">🚀 Top Gainers</h3>
              <div className="space-y-3">
                {[
                  { symbol: 'NVDA', name: 'NVIDIA Corp', change: '+5.2%', price: '$456.78' },
                  { symbol: 'AMD', name: 'AMD Inc', change: '+4.8%', price: '$123.45' },
                  { symbol: 'META', name: 'Meta Platforms', change: '+3.6%', price: '$345.67' },
                ].map((stock, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white font-medium">{stock.symbol}</p>
                      <p className="text-white/50 text-sm">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{stock.price}</p>
                      <p className="text-primary-green text-sm">{stock.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">📉 Top Losers</h3>
              <div className="space-y-3">
                {[
                  { symbol: 'TSLA', name: 'Tesla Inc', change: '-5.2%', price: '$245.67' },
                  { symbol: 'BA', name: 'Boeing Co', change: '-3.8%', price: '$198.34' },
                  { symbol: 'DIS', name: 'Disney Inc', change: '-2.9%', price: '$89.12' },
                ].map((stock, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div>
                      <p className="text-white font-medium">{stock.symbol}</p>
                      <p className="text-white/50 text-sm">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{stock.price}</p>
                      <p className="text-primary-pink text-sm">{stock.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* New Trading Widgets (Recent Trades & Mini Order Book) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96">
              <RecentTradesWidget trades={trades} />
            </div>
            <div className="h-96">
              <MiniOrderBook trades={trades} currentPrice={prices.BTC} />
            </div>
          </div>

          {/* Crypto, Stock, and Equity Tables */}
          <div className="space-y-6">
            <CryptoTable />
            <StockTable />
            <EquityTable />
          </div>

          {/* Risk Alerts */}
          <RiskAlerts />
        </div>
      </main>

      {/* Notification Panel */}
      <NotificationPanel trades={trades} />
    </div>
  );
}
