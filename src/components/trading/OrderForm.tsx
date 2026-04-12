'use client';

import React, { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Clock, TrendingUp } from 'lucide-react';

interface Order {
  id: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: number;
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED';
}

export const OrderForm: React.FC = () => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'LIMIT' | 'MARKET'>('LIMIT');
  const [price, setPrice] = useState('64000.00');
  const [quantity, setQuantity] = useState('0.5');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order placement
    const newOrder: Order = {
      id: generateOrderId(),
      price: orderType === 'LIMIT' ? parseFloat(price) || 0 : 0,
      quantity: parseFloat(quantity) || 0,
      side,
      timestamp: Date.now(),
      status: 'NEW'
    };

    // Simulate processing delay
    setTimeout(() => {
      setLastOrder(newOrder);
      setIsSubmitting(false);
      
      // Show success message
      const message = orderType === 'LIMIT' 
        ? `${side} order placed: ${quantity} BTC @ $${price} (FIFO Queue)`
        : `${side} order placed: ${quantity} BTC @ Market`;
      
      console.log('FIFO Order Placed:', newOrder);
      console.log(message);
      
      // Reset form after successful submission
      if (orderType === 'LIMIT') {
        setPrice('64000.00');
      }
      setQuantity('0.5');
    }, 1000);
  };

  const isFormValid = () => {
    const qty = parseFloat(quantity);
    if (orderType === 'LIMIT') {
      const prc = parseFloat(price);
      return !isNaN(prc) && prc > 0 && !isNaN(qty) && qty > 0;
    }
    return !isNaN(qty) && qty > 0;
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Place Order</h3>
        <div className="flex items-center space-x-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
          <Clock size={12} />
          <span>FIFO Queue</span>
        </div>
      </div>
      
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
              step="0.01"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary-blue transition-colors disabled:opacity-50"
            />
            {orderType === 'LIMIT' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">
                FIFO
              </div>
            )}
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
              step="0.0001"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary-blue transition-colors"
            />
          </div>
        </div>

        {/* FIFO Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <TrendingUp size={16} className="text-blue-400 mt-0.5" />
            <div className="text-xs text-blue-300">
              <p className="font-medium mb-1">FIFO Matching Active</p>
              <p className="text-blue-400/80">
                Orders are matched by price priority, then time priority (First-In-First-Out)
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Total Cost */}
        <div className="flex justify-between text-sm py-4 border-t border-white/10 mt-auto">
          <span className="text-white/50">Total</span>
          <span className="text-white font-medium">
            {price && quantity && orderType === 'LIMIT' 
              ? (Number(price) * Number(quantity)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : 'Market'
            } USDT
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid() || isSubmitting}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            side === 'BUY' ? 'bg-primary-green text-white' : 'bg-primary-pink text-white'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              {side === 'BUY' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
              <span>Place {side} Order</span>
            </>
          )}
        </button>
      </form>

      {/* Last Order Info */}
      {lastOrder && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-xs text-green-400 font-medium">
            Order {lastOrder.id} placed in FIFO queue
          </p>
        </div>
      )}
    </div>
  );
};
