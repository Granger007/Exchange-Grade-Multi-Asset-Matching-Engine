'use client';

import React, { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export const OrderForm: React.FC = () => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder POST /api/orders
    console.log('Placing order:', { side, orderType, price, quantity });
    alert(`Order Placed: ${side} ${quantity} @ ${orderType === 'LIMIT' ? price : 'MARKET'}`);
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-6">Place Order</h3>
      
      {/* Buy / Sell Tabs */}
      <div className="flex bg-white/5 rounded-lg p-1 mb-6">
        <button
          onClick={() => setSide('BUY')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
            side === 'BUY' 
              ? 'bg-primary-green text-white shadow-lg' 
              : 'text-white/50 hover:text-white'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('SELL')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
            side === 'SELL' 
              ? 'bg-primary-pink text-white shadow-lg' 
              : 'text-white/50 hover:text-white'
          }`}
        >
          Sell
        </button>
      </div>

      {/* Order Type */}
      <div className="flex space-x-4 mb-6 text-sm">
        <button
          onClick={() => setOrderType('LIMIT')}
          className={`pb-2 border-b-2 transition-colors ${
            orderType === 'LIMIT' ? 'border-primary-blue text-white' : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          Limit
        </button>
        <button
          onClick={() => setOrderType('MARKET')}
          className={`pb-2 border-b-2 transition-colors ${
            orderType === 'MARKET' ? 'border-primary-blue text-white' : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          Market
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
        {/* Price Input */}
        <div>
          <label className="block text-xs text-white/50 mb-1">Price (USDT)</label>
          <div className="relative">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={orderType === 'MARKET'}
              placeholder={orderType === 'MARKET' ? 'Market Price' : '0.00'}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary-blue transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-xs text-white/50 mb-1">Quantity (BTC)</label>
          <div className="relative">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary-blue transition-colors"
            />
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Total Cost Placeholder */}
        <div className="flex justify-between text-sm py-4 border-t border-white/10 mt-auto">
          <span className="text-white/50">Total</span>
          <span className="text-white font-medium">
            {price && quantity ? (Number(price) * Number(quantity)).toLocaleString() : '0.00'} USDT
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all hover:opacity-90 active:scale-95 ${
            side === 'BUY' ? 'bg-primary-green text-white' : 'bg-primary-pink text-white'
          }`}
        >
          {side === 'BUY' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
          <span>{side === 'BUY' ? 'Buy BTC' : 'Sell BTC'}</span>
        </button>
      </form>
    </div>
  );
};
