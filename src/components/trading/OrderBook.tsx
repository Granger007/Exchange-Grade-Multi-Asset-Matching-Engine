'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassCard';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export const OrderBook: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [orderBookData, setOrderBookData] = useState<OrderBookData>({
    bids: [],
    asks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orderbook/${symbol}`);
        const data = await response.json();
        
        const mockData: OrderBookData = {
          bids: [
            { price: 43250.50, size: 0.125, total: 5406.31 },
            { price: 43250.00, size: 0.250, total: 10812.50 },
            { price: 43249.75, size: 0.100, total: 4324.98 },
            { price: 43249.50, size: 0.500, total: 21624.75 },
            { price: 43249.25, size: 0.075, total: 3243.69 },
            { price: 43249.00, size: 0.200, total: 8649.80 },
            { price: 43248.75, size: 0.150, total: 6487.31 },
            { price: 43248.50, size: 0.300, total: 12974.55 },
          ],
          asks: [
            { price: 43251.00, size: 0.100, total: 4325.10 },
            { price: 43251.25, size: 0.075, total: 3243.84 },
            { price: 43251.50, size: 0.200, total: 8650.30 },
            { price: 43251.75, size: 0.150, total: 6487.76 },
            { price: 43252.00, size: 0.250, total: 10813.00 },
            { price: 43252.25, size: 0.125, total: 5406.53 },
            { price: 43252.50, size: 0.100, total: 4325.25 },
            { price: 43252.75, size: 0.075, total: 3243.96 },
          ]
        };
        
        setOrderBookData(mockData);
      } catch (error) {
        console.error('Error fetching order book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 1000);
    return () => clearInterval(interval);
  }, [symbol]);

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatSize = (size: number) => {
    return size.toFixed(3);
  };

  const formatTotal = (total: number) => {
    return total.toFixed(2);
  };

  if (loading) {
    return (
      <GlassCard className="p-4">
        <h3 className="text-white font-semibold mb-4">Order Book</h3>
        <div className="text-white/50 text-center py-8">Loading...</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Order Book</h3>
        <span className="text-white/70 text-sm">{symbol}</span>
      </div>
      
      <div className="grid grid-cols-3 text-xs text-white/50 mb-2">
        <div>Price</div>
        <div className="text-center">Size</div>
        <div className="text-right">Total</div>
      </div>
      
      <div className="space-y-1 max-h-96 overflow-y-auto">
        <div className="space-y-1">
          {orderBookData.asks.slice().reverse().map((ask, index) => (
            <div key={`ask-${index}`} className="grid grid-cols-3 text-xs">
              <div className="text-pink-400">{formatPrice(ask.price)}</div>
              <div className="text-center text-white/70">{formatSize(ask.size)}</div>
              <div className="text-right text-white/70">{formatTotal(ask.total)}</div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/10 my-2"></div>
        
        <div className="space-y-1">
          {orderBookData.bids.map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-3 text-xs">
              <div className="text-green-400">{formatPrice(bid.price)}</div>
              <div className="text-center text-white/70">{formatSize(bid.size)}</div>
              <div className="text-right text-white/70">{formatTotal(bid.total)}</div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
