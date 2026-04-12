import { useState, useEffect, useRef } from 'react';

interface Trade {
  id: string;
  price: number;
  amount: number;
  side: 'BUY' | 'SELL';
  time: Date;
}

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

interface CryptoStreamData {
  status: 'connecting' | 'connected' | 'disconnected';
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  recentTrades: Trade[];
  orderBook: {
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
  };
}

export function useCryptoWebSocket(symbol: string = 'BTC/USD') {
  const basePrice = symbol.includes('BTC') ? 64320.50 : symbol.includes('ETH') ? 3450.20 : 150.00;
  
  const [data, setData] = useState<CryptoStreamData>({
    status: 'connecting',
    currentPrice: basePrice,
    priceChange24h: 2.4,
    volume24h: 12450.5,
    recentTrades: [],
    orderBook: {
      bids: [],
      asks: []
    }
  });

  // Track the latest price in a ref to generate realistic subsequent prices
  const priceRef = useRef(basePrice);

  useEffect(() => {
    // Simulate connection delay
    const connectionTimer = setTimeout(() => {
      setData(prev => ({ ...prev, status: 'connected' }));
      
      // Initial Order Book Gen
      const initialBids = generateOrderBook(priceRef.current, 'BUY');
      const initialAsks = generateOrderBook(priceRef.current, 'SELL');
      setData(prev => ({
        ...prev,
        orderBook: { bids: initialBids, asks: initialAsks }
      }));
    }, 800);

    // Simulated WebSocket tick
    const interval = setInterval(() => {
      setData(prev => {
        if (prev.status !== 'connected') return prev;

        // Random walk for price
        const volatility = priceRef.current * 0.0001; // 0.01% volatility per tick
        const step = (Math.random() - 0.5) * 2 * volatility;
        priceRef.current += step;

        // Generate a new trade randomly
        const newTrades = [...prev.recentTrades];
        if (Math.random() > 0.4) {
          const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
          newTrades.unshift({
            id: Math.random().toString(36).substring(2, 9),
            price: priceRef.current,
            amount: Number((Math.random() * (symbol.includes('BTC') ? 2 : 10)).toFixed(4)),
            side,
            time: new Date()
          });
          if (newTrades.length > 20) newTrades.pop(); // Keep array small
        }

        // Slightly jitter the order book
        const newBids = [...prev.orderBook.bids];
        const newAsks = [...prev.orderBook.asks];
        
        if (newBids.length > 0 && Math.random() > 0.5) {
          const idx = Math.floor(Math.random() * newBids.length);
          newBids[idx].size = Number((newBids[idx].size * (0.9 + Math.random() * 0.2)).toFixed(2));
        }
        if (newAsks.length > 0 && Math.random() > 0.5) {
          const idx = Math.floor(Math.random() * newAsks.length);
          newAsks[idx].size = Number((newAsks[idx].size * (0.9 + Math.random() * 0.2)).toFixed(2));
        }

        return {
          ...prev,
          currentPrice: Number(priceRef.current.toFixed(2)),
          recentTrades: newTrades,
          orderBook: {
            bids: newBids,
            asks: newAsks
          }
        };
      });
    }, 200); // Super fast 200ms updates to feel like a real WebSocket

    return () => {
      clearTimeout(connectionTimer);
      clearInterval(interval);
    };
  }, [symbol]);

  return data;
}

// Helper to generate initial order book levels
function generateOrderBook(basePrice: number, side: 'BUY' | 'SELL'): OrderBookLevel[] {
  const levels: OrderBookLevel[] = [];
  let currentTotal = 0;
  const spread = basePrice * 0.0002;

  for (let i = 0; i < 15; i++) {
    const priceDiff = spread + (Math.random() * basePrice * 0.0005 * i);
    const price = side === 'BUY' ? basePrice - priceDiff : basePrice + priceDiff;
    const size = Number((Math.random() * 5 + 0.1).toFixed(2));
    currentTotal += size;

    levels.push({
      price: Number(price.toFixed(2)),
      size,
      total: Number(currentTotal.toFixed(2))
    });
  }

  // Bids descend from highest to lowest. Asks ascend from lowest to highest.
  if (side === 'BUY') {
    return levels.sort((a, b) => b.price - a.price);
  } else {
    return levels.sort((a, b) => a.price - b.price);
  }
}
