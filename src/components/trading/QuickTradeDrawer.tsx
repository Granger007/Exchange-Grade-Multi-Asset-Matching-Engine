import React, { useEffect } from 'react';
import { useTradeController } from '../../controllers/useTradeController';
import { Drawer } from './shared/Drawer';
import { Button } from './shared/Button';
import { Asset } from '../../models/Asset';
import { OrderSide, OrderType } from '../../models/Order';

export interface QuickTradeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export const QuickTradeDrawer: React.FC<QuickTradeDrawerProps> = ({
  isOpen,
  onClose,
  asset
}) => {
  const {
    selectedAsset,
    orderType,
    side,
    quantity,
    price,
    setSelectedAsset,
    setOrderType,
    setSide,
    setQuantity,
    setPrice,
    submitOrder,
    isSubmitting,
    lastError,
    resetForm
  } = useTradeController();

  // Update selected asset when prop changes
  useEffect(() => {
    if (asset && asset.symbol !== selectedAsset) {
      setSelectedAsset(asset.symbol);
    }
  }, [asset, selectedAsset, setSelectedAsset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitOrder();
    if (!lastError) {
      onClose();
    }
  };

  const totalCost = orderType === 'LIMIT' && price && quantity
    ? (parseFloat(price) * parseFloat(quantity)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'Market';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Trade"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Asset Selector */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Asset</label>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-blue"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="SOL">Solana (SOL)</option>
          </select>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Order Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOrderType('LIMIT')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                orderType === 'LIMIT'
                  ? 'bg-primary-blue text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Limit
            </button>
            <button
              type="button"
              onClick={() => setOrderType('MARKET')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                orderType === 'MARKET'
                  ? 'bg-primary-blue text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Market
            </button>
          </div>
        </div>

        {/* Side */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Side</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                side === 'BUY'
                  ? 'bg-primary-green text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                side === 'SELL'
                  ? 'bg-primary-pink text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Price (conditional) */}
        {orderType === 'LIMIT' && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">Price (USDT)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-blue"
            />
          </div>
        )}

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Quantity</label>
          <input
            type="number"
            step="0.0001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-blue"
          />
        </div>

        {/* Error Display */}
        {lastError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{lastError}</p>
          </div>
        )}

        {/* Total Cost */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Total Cost</span>
            <span className="text-white font-medium">{totalCost} USDT</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={resetForm}
            variant="secondary"
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant={side === 'BUY' ? 'success' : 'danger'}
            loading={isSubmitting}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Placing Order...' : `Place ${side} Order`}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};
