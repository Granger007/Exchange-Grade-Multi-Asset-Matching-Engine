'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { StockTable } from '@/components/StockTable';

export default function StocksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Navbar />
      
      <main className="ml-64 pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Stock Markets</h1>
            <p className="text-white/70">Monitor stock performance and trading opportunities</p>
          </div>
          
          <StockTable />
        </div>
      </main>
    </div>
  );
}
