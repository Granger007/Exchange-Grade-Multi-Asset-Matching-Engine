'use client';

import React, { useState, useEffect } from 'react';

type Order = {
  id: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: number;
};

type PriceLevel = {
  price: number;
  totalQuantity: number;
  orders: Order[];
};

// Mock data generator for FIFO order book
const generateFIFOOrderBookData = () => {
  const now = Date.now();
  
  // Generate price levels with multiple orders (FIFO queues)
  const bidLevels: PriceLevel[] = Array.from({ length: 10 }, (_, i) => {
    const price = 64000 - i * 10;
    const orderCount = Math.floor(Math.random() * 4) + 1;
    const orders: Order[] = Array.from({ length: orderCount }, (_, j) => ({
      id: `bid-${i}-${j}`,
      price,
      quantity: Math.random() * 0.5 + 0.1,
      side: 'BUY' as const,
      timestamp: now - (orderCount - j) * 1000 // Older orders first
    }));
    
    return {
      price,
      totalQuantity: orders.reduce((sum, order) => sum + order.quantity, 0),
      orders: orders.sort((a, b) => a.timestamp - b.timestamp) // FIFO order
    };
  });

  const askLevels: PriceLevel[] = Array.from({ length: 10 }, (_, i) => {
    const price = 64010 + i * 10;
    const orderCount = Math.floor(Math.random() * 4) + 1;
    const orders: Order[] = Array.from({ length: orderCount }, (_, j) => ({
      id: `ask-${i}-${j}`,
      price,
      quantity: Math.random() * 0.5 + 0.1,
      side: 'SELL' as const,
      timestamp: now - (orderCount - j) * 1000 // Older orders first
    }));
    
    return {
      price,
      totalQuantity: orders.reduce((sum, order) => sum + order.quantity, 0),
      orders: orders.sort((a, b) => a.timestamp - b.timestamp) // FIFO order
    };
  });

  // Calculate totals for depth bars
  let bidTotal = 0;
  bidLevels.forEach(level => {
    bidTotal += level.totalQuantity;
    level.totalQuantity = bidTotal;
  });

  let askTotal = 0;
  askLevels.slice().reverse().forEach(level => {
    askTotal += level.totalQuantity;
    level.totalQuantity = askTotal;
  });

  return { 
    bids: bidLevels, 
    asks: askLevels.reverse(), 
    maxTotal: Math.max(bidTotal, askTotal),
    bestBid: bidLevels[0]?.price || 0,
    bestAsk: askLevels[askLevels.length - 1]?.price || 0
  };
};

export const OrderBook: React.FC = () => {
  const [data, setData] = useState<{
    bids: PriceLevel[];
    asks: PriceLevel[];
    maxTotal: number;
    bestBid: number;
    bestAsk: number;
  }>({
    bids: [],
    asks: [],
    maxTotal: 0,
    bestBid: 0,
    bestAsk: 0
  });

  useEffect(() => {
    setData(generateFIFOOrderBookData());
    const interval = setInterval(() => {
      setData(generateFIFOOrderBookData());
    }, 3000); // Simulate WebSocket updates every 3s
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (p: number) => p.toFixed(2);
  const formatSize = (s: number) => s.toFixed(4);
  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString();

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-white">Order Book</h3>
          <div className="flex items-center space-x-1 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            <span>FIFO Matching Active</span>
          </div>
        </div>
        <div className="text-xs text-white/50 flex space-x-2">
          <span className="cursor-pointer hover:text-white transition-colors">0.1</span>
          <span className="cursor-pointer hover:text-white transition-colors">0.01</span>
          <span className="cursor-pointer hover:text-white transition-colors">0.001</span>
        </div>
      </div>

      <div className="flex text-xs text-white/50 px-4 py-2">
        <div className="flex-1">Price(USDT)</div>
        <div className="flex-1 text-right">Size(BTC)</div>
        <div className="flex-1 text-right">Total</div>
        <div className="w-16 text-center">Queue</div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Asks (Sell Orders - Red) */}
        <div className="flex flex-col justify-end px-2">
          {data.asks.map((ask, i) => (
            <div key={`ask-${i}`} className="flex text-sm py-1 relative hover:bg-white/5 cursor-pointer group">
              {/* Depth bar */}
              <div 
                className="absolute right-0 top-0 bottom-0 bg-primary-pink/10 transition-all duration-300"
                style={{ width: `${(ask.totalQuantity / data.maxTotal) * 100}%` }}
              />
              <div className={`flex-1 ${ask.price === data.bestAsk ? 'text-yellow-400 font-semibold' : 'text-primary-pink'} relative z-10 pl-2`}>
                {formatPrice(ask.price)}
              </div>
              <div className="flex-1 text-right text-white relative z-10">{formatSize(ask.orders.reduce((sum, o) => sum + o.quantity, 0))}</div>
              <div className="flex-1 text-right text-white/70 relative z-10">{formatSize(ask.totalQuantity)}</div>
              <div className="w-16 text-center relative z-10">
                <div className="flex flex-col items-center space-y-1">
                  {ask.orders.slice(0, 3).map((order, idx) => (
                    <div 
                      key={order.id} 
                      className={`text-xs px-1 rounded ${idx === 0 ? 'bg-primary-pink/30 text-primary-pink' : 'bg-white/10 text-white/60'}`}
                      title={`Order ${order.id} - ${formatTime(order.timestamp)}`}
                    >
                      {formatSize(order.quantity)}
                    </div>
                  ))}
                  {ask.orders.length > 3 && (
                    <div className="text-xs text-white/40">+{ask.orders.length - 3}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spread / Current Price */}
        <div className="flex items-center justify-between py-2 px-4 border-y border-white/10 my-1 bg-white/5">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-green">{formatPrice((data.bestBid + data.bestAsk) / 2)}</span>
            <span className="text-xs text-white/50">${formatPrice((data.bestBid + data.bestAsk) / 2)}</span>
          </div>
          <span className="text-xs text-white/50">Spread: {formatPrice(data.bestAsk - data.bestBid)}</span>
        </div>

        {/* Bids (Buy Orders - Green) */}
        <div className="flex flex-col px-2">
          {data.bids.map((bid, i) => (
            <div key={`bid-${i}`} className="flex text-sm py-1 relative hover:bg-white/5 cursor-pointer group">
              {/* Depth bar */}
              <div 
                className="absolute right-0 top-0 bottom-0 bg-primary-green/10 transition-all duration-300"
                style={{ width: `${(bid.totalQuantity / data.maxTotal) * 100}%` }}
              />
              <div className={`flex-1 ${bid.price === data.bestBid ? 'text-yellow-400 font-semibold' : 'text-primary-green'} relative z-10 pl-2`}>
                {formatPrice(bid.price)}
              </div>
              <div className="flex-1 text-right text-white relative z-10">{formatSize(bid.orders.reduce((sum, o) => sum + o.quantity, 0))}</div>
              <div className="flex-1 text-right text-white/70 relative z-10">{formatSize(bid.totalQuantity)}</div>
              <div className="w-16 text-center relative z-10">
                <div className="flex flex-col items-center space-y-1">
                  {bid.orders.slice(0, 3).map((order, idx) => (
                    <div 
                      key={order.id} 
                      className={`text-xs px-1 rounded ${idx === 0 ? 'bg-primary-green/30 text-primary-green' : 'bg-white/10 text-white/60'}`}
                      title={`Order ${order.id} - ${formatTime(order.timestamp)}`}
                    >
                      {formatSize(order.quantity)}
                    </div>
                  ))}
                  {bid.orders.length > 3 && (
                    <div className="text-xs text-white/40">+{bid.orders.length - 3}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
