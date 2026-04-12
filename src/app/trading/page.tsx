import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { OrderBook } from '@/components/trading/OrderBook';
import { OrderForm } from '@/components/trading/OrderForm';
import { TradeFeed } from '@/components/trading/TradeFeed';
import { OrderTable } from '@/components/trading/OrderTable';
import { PriceTicker } from '@/components/trading/PriceTicker';
import { PriceChart } from '@/components/trading/PriceChart';
import { MatchingActivity } from '@/components/trading/MatchingActivity';
import { MatchingStrategy } from '@/components/trading/MatchingStrategy';

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-background text-white flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />
        
        {/* Main Content padding to account for fixed navbar */}
        <div className="flex-1 p-6 pt-24 pb-12 overflow-y-auto w-full">
          
          <div className="max-w-[1700px] mx-auto space-y-4">
            {/* Top Ticker Row */}
            <div>
              <PriceTicker />
            </div>

            {/* Grid Layout Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Box: Order Book (3 cols) */}
              <div className="lg:col-span-3 h-[600px] overflow-hidden">
                <OrderBook />
              </div>

              {/* Center Box: Chart & Info (6 cols) */}
              <div className="lg:col-span-6 flex flex-col space-y-4 h-[600px] overflow-hidden">
                <div className="flex-1 min-h-0 overflow-hidden">
                  <PriceChart />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 h-[120px] shrink-0">
                  <div className="h-full overflow-hidden"><MatchingActivity /></div>
                  <div className="h-full overflow-hidden"><MatchingStrategy /></div>
                </div>
              </div>

              {/* Right Box: Order Entry (3 cols) */}
              <div className="lg:col-span-3 h-[600px] overflow-hidden">
                <OrderForm />
              </div>

            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-3 h-[400px] overflow-hidden">
                <TradeFeed />
              </div>
              <div className="lg:col-span-9 h-[400px] overflow-hidden">
                <OrderTable />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
