'use client';

import React, { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from 'lucide-react';

export const OrderForm: React.FC = () => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || (orderType === 'LIMIT' && !price)) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user-123', // Hardcoded local user for demo
          pair: 'BTC/USDT',
          type: orderType,
          side: side,
          price: orderType === 'LIMIT' ? price : null,
          quantity: quantity
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      // Reset form on success
      setQuantity('');
      if(orderType === 'LIMIT') setPrice('');
      
    } catch (error) {
      console.error('Order error:', error);
      alert('Error placing order to MySQL Database');
    } finally {
      setIsSubmitting(false);
    }
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

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {/* Price Input */}
        <div>
          <label className="block text-xs text-white/50 mb-1">Price (USDT)</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
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
              step="0.0001"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary-blue transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 min-h-0"></div>

        {/* Total Cost Placeholder */}
        <div className="flex justify-between text-sm py-4 border-t border-white/10 mt-auto shrink-0">
          <span className="text-white/50">Total</span>
          <span className="text-white font-medium">
            {price && quantity ? (Number(price) * Number(quantity)).toLocaleString() : '0.00'} USDT
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !quantity || (orderType === 'LIMIT' && !price)}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all hover:opacity-90 active:scale-95 shrink-0 disabled:opacity-50 ${
            side === 'BUY' ? 'bg-primary-green text-white' : 'bg-primary-pink text-white'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : side === 'BUY' ? (
            <ArrowDownCircle size={20} />
          ) : (
            <ArrowUpCircle size={20} />
          )}
          <span>{side === 'BUY' ? 'Buy BTC' : 'Sell BTC'}</span>
        </button>
      </form>
    </div>
  );
};
