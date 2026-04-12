import React from 'react';
import { useOrderBookController } from '../../../controllers/useOrderBookController';
import { AssetDepth } from '../../../models/Asset';

export interface OrderBookProps {
  className?: string;
}

export const OrderBook: React.FC<OrderBookProps> = ({ className = '' }) => {
  const {
    bids,
    asks,
    bestBid,
    bestAsk,
    spread,
    loading,
    selectedPair
  } = useOrderBookController();

  const renderDepthLevel = (depth: AssetDepth, type: 'BID' | 'ASK', index: number) => {
    const isBid = type === 'BID';
    const totalQuantity = depth.quantity;
    const maxSize = 100; // Max width for visualization
    const width = Math.min((totalQuantity / 10) * maxSize, maxSize);
    
    return (
      <div className="flex items-center text-sm py-1 hover:bg-white/5 transition-colors">
        {/* Price */}
        <div className={`w-20 text-right font-medium ${
          isBid ? 'text-primary-green' : 'text-primary-pink'
        }`}>
          ${depth.price.toFixed(2)}
        </div>
        
        {/* Depth Bar */}
        <div className="flex-1 relative h-4 mx-2">
          <div
            className={`absolute top-0 h-full ${
              isBid ? 'bg-primary-green/20' : 'bg-primary-pink/20'
            }`}
            style={{ width: `${width}%` }}
          />
        </div>
        
        {/* Quantity */}
        <div className="w-20 text-right">
          {totalQuantity.toFixed(4)}
        </div>
      </div>
    );
  };

  const renderSpread = () => {
    if (!spread) return null;
    
    return (
      <div className="text-center py-2 border-t border-b border-white/10">
        <span className="text-white/70 text-sm">Spread: </span>
        <span className={`font-medium ${
          spread > 0 ? 'text-red-400' : 'text-green-400'
        }`}>
          {spread > 0 ? spread.toFixed(2) : '0.00'}
        </span>
      </div>
    );
  };

  return (
    <div className={`glass-card p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Order Book</h3>
        <div className="text-white/50 text-sm">
          {selectedPair}
        </div>
      </div>

      {/* Spread */}
      {renderSpread()}

      {/* Order Book Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
            <span className="text-white/50 ml-2">Loading order book...</span>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Asks (Sell Orders) */}
            <div className="mb-4">
              <div className="text-xs text-white/50 mb-2">Asks</div>
              {asks.slice(0, 10).reverse().map((ask, index) => 
                renderDepthLevel(ask, 'ASK', index)
              )}
            </div>

            {/* Spread */}
            {renderSpread()}

            {/* Bids (Buy Orders) */}
            <div>
              <div className="text-xs text-white/50 mb-2">Bids</div>
              {bids.slice(0, 10).map((bid, index) => 
                renderDepthLevel(bid, 'BID', index)
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-white/50">Best Bid: </span>
            <span className="text-primary-green font-medium">
              {bestBid ? `$${bestBid.toFixed(2)}` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-white/50">Best Ask: </span>
            <span className="text-primary-pink font-medium">
              {bestAsk ? `$${bestAsk.toFixed(2)}` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
