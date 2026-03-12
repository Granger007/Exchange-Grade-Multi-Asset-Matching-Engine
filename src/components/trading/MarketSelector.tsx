'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassCard';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

interface Market {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  category: 'crypto' | 'stock' | 'equity';
}

interface MarketSelectorProps {
  selectedMarket: string;
  onMarketChange: (symbol: string) => void;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({ 
  selectedMarket, 
  onMarketChange 
}) => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/markets');
        const data = await response.json();
        
        const mockMarkets: Market[] = [
          { symbol: 'BTC/USDT', name: 'Bitcoin', price: 43250.50, change24h: 2.5, volume24h: 28500000000, category: 'crypto' },
          { symbol: 'ETH/USDT', name: 'Ethereum', price: 2280.75, change24h: -1.2, volume24h: 15200000000, category: 'crypto' },
          { symbol: 'AAPL/USD', name: 'Apple Inc.', price: 175.25, change24h: 0.8, volume24h: 52000000, category: 'stock' },
          { symbol: 'TSLA/USD', name: 'Tesla Inc.', price: 245.80, change24h: -2.3, volume24h: 118000000, category: 'stock' },
          { symbol: 'GOOGL/USD', name: 'Alphabet Inc.', price: 138.45, change24h: 1.5, volume24h: 28000000, category: 'stock' },
          { symbol: 'MSFT/USD', name: 'Microsoft Corp.', price: 378.90, change24h: 0.3, volume24h: 22000000, category: 'stock' },
          { symbol: 'SPY/USD', name: 'S&P 500 ETF', price: 445.20, change24h: 0.6, volume24h: 75000000, category: 'equity' },
          { symbol: 'QQQ/USD', name: 'NASDAQ-100 ETF', price: 378.50, change24h: 0.9, volume24h: 45000000, category: 'equity' },
        ];
        
        setMarkets(mockMarkets);
      } catch (error) {
        console.error('Error fetching markets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectedMarketData = markets.find(m => m.symbol === selectedMarket);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toFixed(2);
    } else if (price >= 100) {
      return price.toFixed(2);
    } else {
      return price.toFixed(2);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else {
      return `$${(volume / 1000).toFixed(1)}K`;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crypto':
        return 'text-purple-400';
      case 'stock':
        return 'text-blue-400';
      case 'equity':
        return 'text-green-400';
      default:
        return 'text-white/70';
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-4">
        <div className="text-white/50 text-center py-4">Loading markets...</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Markets</h3>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {selectedMarketData && (
              <>
                <div>
                  <div className="text-white font-medium">{selectedMarketData.symbol}</div>
                  <div className="text-white/50 text-xs">{selectedMarketData.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">${formatPrice(selectedMarketData.price)}</div>
                  <div className={`text-xs flex items-center ${
                    selectedMarketData.change24h >= 0 ? 'text-green-400' : 'text-pink-400'
                  }`}>
                    {selectedMarketData.change24h >= 0 ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    {Math.abs(selectedMarketData.change24h).toFixed(1)}%
                  </div>
                </div>
              </>
            )}
          </div>
          <ChevronDown 
            size={20} 
            className={`text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-white/20 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
            <div className="p-2">
              {markets.map((market) => (
                <button
                  key={market.symbol}
                  onClick={() => {
                    onMarketChange(market.symbol);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-left ${
                    selectedMarket === market.symbol ? 'bg-white/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{market.symbol}</span>
                          <span className={`text-xs ${getCategoryColor(market.category)}`}>
                            {market.category.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-white/50 text-xs">{market.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">${formatPrice(market.price)}</div>
                      <div className="text-xs text-white/50">{formatVolume(market.volume24h)}</div>
                      <div className={`text-xs flex items-center justify-end ${
                        market.change24h >= 0 ? 'text-green-400' : 'text-pink-400'
                      }`}>
                        {market.change24h >= 0 ? (
                          <TrendingUp size={12} className="mr-1" />
                        ) : (
                          <TrendingDown size={12} className="mr-1" />
                        )}
                        {Math.abs(market.change24h).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
