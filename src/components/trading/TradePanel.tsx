'use client';

import React, { useState } from 'react';
import { GlassCard } from '../GlassCard';

interface OrderForm {
  price: string;
  quantity: string;
  orderType: 'market' | 'limit' | 'stop';
}

export const TradePanel: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [activeTab, setActiveTab] = useState<'market' | 'limit' | 'stop'>('market');
  const [orderForm, setOrderForm] = useState<OrderForm>({
    price: '',
    quantity: '',
    orderType: 'market'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof OrderForm, value: string) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTabChange = (tab: 'market' | 'limit' | 'stop') => {
    setActiveTab(tab);
    setOrderForm(prev => ({
      ...prev,
      orderType: tab
    }));
  };

  const handleSubmit = async (side: 'buy' | 'sell') => {
    setLoading(true);
    try {
      const orderData = {
        symbol,
        side,
        type: activeTab,
        price: activeTab === 'market' ? null : parseFloat(orderForm.price),
        quantity: parseFloat(orderForm.quantity)
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setOrderForm({ price: '', quantity: '', orderType: activeTab });
        alert(`${side.toUpperCase()} order placed successfully!`);
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'market', label: 'Market' },
    { id: 'limit', label: 'Limit' },
    { id: 'stop', label: 'Stop' }
  ] as const;

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Trade</h3>
        <span className="text-white/70 text-sm">{symbol}</span>
      </div>

      <div className="flex space-x-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab !== 'market' && (
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Price (USD)
            </label>
            <input
              type="number"
              value={orderForm.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/20"
              step="0.01"
            />
          </div>
        )}

        <div>
          <label className="block text-white/70 text-sm mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={orderForm.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/20"
            step="0.001"
          />
        </div>

        {activeTab !== 'market' && orderForm.price && orderForm.quantity && (
          <div className="text-white/50 text-sm">
            Total: ${(parseFloat(orderForm.price) * parseFloat(orderForm.quantity)).toFixed(2)}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleSubmit('buy')}
            disabled={loading || !orderForm.quantity || (activeTab !== 'market' && !orderForm.price)}
            className="py-3 px-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg font-medium hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing...' : 'Buy'}
          </button>
          <button
            onClick={() => handleSubmit('sell')}
            disabled={loading || !orderForm.quantity || (activeTab !== 'market' && !orderForm.price)}
            className="py-3 px-4 bg-pink-500/20 border border-pink-500/50 text-pink-400 rounded-lg font-medium hover:bg-pink-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing...' : 'Sell'}
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
