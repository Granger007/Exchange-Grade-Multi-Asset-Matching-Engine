'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassCard';
import { X } from 'lucide-react';

interface OpenOrder {
  id: string;
  asset: string;
  orderType: 'limit' | 'stop' | 'market';
  price: number;
  amount: number;
  status: 'active' | 'partially_filled' | 'pending';
  side: 'buy' | 'sell';
  filled: number;
}

export const OpenOrders: React.FC = () => {
  const [orders, setOrders] = useState<OpenOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders/open');
        const data = await response.json();
        
        const mockOrders: OpenOrder[] = [
          {
            id: '1',
            asset: 'BTC/USDT',
            orderType: 'limit',
            price: 43200.00,
            amount: 0.500,
            status: 'active',
            side: 'buy',
            filled: 0.000
          },
          {
            id: '2',
            asset: 'ETH/USDT',
            orderType: 'limit',
            price: 2280.50,
            amount: 2.000,
            status: 'partially_filled',
            side: 'sell',
            filled: 0.750
          },
          {
            id: '3',
            asset: 'AAPL/USD',
            orderType: 'stop',
            price: 175.25,
            amount: 10,
            status: 'active',
            side: 'sell',
            filled: 0.000
          },
          {
            id: '4',
            asset: 'TSLA/USD',
            orderType: 'limit',
            price: 245.80,
            amount: 5,
            status: 'pending',
            side: 'buy',
            filled: 0.000
          },
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching open orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenOrders();
    const interval = setInterval(fetchOpenOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setOrders(prev => prev.filter(order => order.id !== orderId));
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Error canceling order');
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(3);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'partially_filled':
        return 'text-yellow-400';
      case 'pending':
        return 'text-blue-400';
      default:
        return 'text-white/70';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'partially_filled':
        return 'Partial';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-4">
        <h3 className="text-white font-semibold mb-4">Open Orders</h3>
        <div className="text-white/50 text-center py-8">Loading...</div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Open Orders</h3>
        <span className="text-white/50 text-sm">{orders.length} orders</span>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-white/50 text-center py-8">
          No open orders
        </div>
      ) : (
        <>
          <div className="grid grid-cols-6 text-xs text-white/50 mb-2">
            <div>Asset</div>
            <div>Type</div>
            <div>Price</div>
            <div>Amount</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>
          
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {orders.map((order) => (
              <div key={order.id} className="grid grid-cols-6 text-xs items-center">
                <div className="text-white/70">{order.asset}</div>
                <div>
                  <span className={`px-1 py-0.5 rounded text-xs ${
                    order.side === 'buy' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-pink-500/20 text-pink-400'
                  }`}>
                    {order.side.toUpperCase()}
                  </span>
                  <span className="text-white/50 ml-1">{order.orderType}</span>
                </div>
                <div className="text-white/70">{formatPrice(order.price)}</div>
                <div className="text-white/70">
                  {formatAmount(order.filled)}/{formatAmount(order.amount)}
                </div>
                <div className={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </div>
                <div className="text-right">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="p-1 rounded hover:bg-white/10 transition-colors group"
                    title="Cancel Order"
                  >
                    <X size={14} className="text-white/50 group-hover:text-white/70" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </GlassCard>
  );
};
