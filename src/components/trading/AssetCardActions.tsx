import React from 'react';
import { Asset } from '../../models/Asset';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './shared/Button';

export interface AssetCardActionsProps {
  asset: Asset;
  onBuyClick: () => void;
  onSellClick: () => void;
}

export const AssetCardActions: React.FC<AssetCardActionsProps> = ({
  asset,
  onBuyClick,
  onSellClick
}) => {
  const isPositive = asset.change24h >= 0;
  const changeColor = isPositive ? 'text-primary-green' : 'text-primary-pink';
  const changeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="glass-card p-6 hover:bg-white/5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-blue/20 rounded-full flex items-center justify-center">
            <span className="text-primary-blue font-bold text-sm">{asset.symbol}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{asset.name}</h3>
            <p className="text-white/70 text-sm">{asset.symbol}/USDT</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${changeColor}`}>
          {React.createElement(changeIcon, { size: 16 })}
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{asset.changePercent24h.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-white mb-2">
          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-white/50 text-sm">
          ≈ ${(asset.price * 1).toLocaleString()}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-white/50 text-xs mb-1">24h Volume</p>
          <p className="text-white font-medium">
            ${(asset.volume24h / 1000000).toFixed(1)}M
          </p>
        </div>
        <div>
          <p className="text-white/50 text-xs mb-1">Market Cap</p>
          <p className="text-white font-medium">
            ${(asset.marketCap / 1000000000).toFixed(1)}B
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onBuyClick}
          variant="success"
          size="lg"
          className="w-full"
        >
          <ArrowUp size={18} className="mr-2" />
          Buy {asset.symbol}
        </Button>
        <Button
          onClick={onSellClick}
          variant="danger"
          size="lg"
          className="w-full"
        >
          <ArrowDown size={18} className="mr-2" />
          Sell {asset.symbol}
        </Button>
      </div>
    </div>
  );
};
