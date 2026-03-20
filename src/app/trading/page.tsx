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
        <div className="flex-1 p-6 pt-24 no-scrollbar h-screen overflow-y-auto">
          
          {/* Top Ticker Row */}
          <div className="mb-4">
            <PriceTicker />
          </div>

          {/* Grid Layout taking majority of height */}
          <div className="grid grid-cols-12 gap-4 h-[55vh] mb-4">
            {/* Left Box: Order Book (3 cols) */}
            <div className="col-span-3 h-full">
              <OrderBook />
            </div>

            {/* Center Box: Chart & Info (6 cols) */}
            <div className="col-span-6 h-full flex flex-col space-y-4">
              <div className="flex-1">
                <PriceChart />
              </div>
              <div className="h-1/3 flex space-x-4">
                <div className="flex-1 h-full"><MatchingActivity /></div>
                <div className="flex-1 h-full"><MatchingStrategy /></div>
              </div>
            </div>

            {/* Right Box: Order Entry (3 cols) */}
            <div className="col-span-3 h-full">
              <OrderForm />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-12 gap-4 h-[35vh]">
            <div className="col-span-3 h-full">
              <TradeFeed />
            </div>
            <div className="col-span-9 h-full">
              <OrderTable />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
