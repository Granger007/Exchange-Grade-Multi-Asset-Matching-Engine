'use client';

import React, { useState } from 'react';

type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED';

interface Order {
  orderId: string;
  pair: string;
  type: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  filled: number;
  status: OrderStatus;
  time: string;
}

const mockOrders: Order[] = [
  { orderId: 'ORD-001', pair: 'BTC/USDT', type: 'LIMIT', side: 'BUY', price: 63500.00, quantity: 1.5, filled: 0.0, status: 'NEW', time: '10:25:31' },
  { orderId: 'ORD-002', pair: 'ETH/USDT', type: 'LIMIT', side: 'SELL', price: 3500.00, quantity: 10.0, filled: 4.5, status: 'PARTIALLY_FILLED', time: '10:24:12' },
  { orderId: 'ORD-003', pair: 'BTC/USDT', type: 'MARKET', side: 'BUY', price: 64102.50, quantity: 0.5, filled: 0.5, status: 'FILLED', time: '10:22:05' },
  { orderId: 'ORD-004', pair: 'SOL/USDT', type: 'LIMIT', side: 'BUY', price: 145.20, quantity: 100.0, filled: 0.0, status: 'CANCELLED', time: '10:15:40' },
];

export const OrderTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OPEN' | 'HISTORY'>('OPEN');

  const filteredOrders = mockOrders.filter(o => 
    activeTab === 'OPEN' ? ['NEW', 'PARTIALLY_FILLED'].includes(o.status) : !['NEW', 'PARTIALLY_FILLED'].includes(o.status)
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case 'NEW': return <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs">New</span>;
      case 'PARTIALLY_FILLED': return <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-400 text-xs">Partial</span>;
      case 'FILLED': return <span className="px-2 py-1 rounded bg-primary-green/20 text-primary-green text-xs">Filled</span>;
      case 'CANCELLED': return <span className="px-2 py-1 rounded bg-white/10 text-white/60 text-xs">Cancelled</span>;
      case 'REJECTED': return <span className="px-2 py-1 rounded bg-primary-pink/20 text-primary-pink text-xs">Rejected</span>;
    }
  };

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/10 px-4">
        <button
          onClick={() => setActiveTab('OPEN')}
          className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'OPEN' ? 'border-primary-blue text-white' : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          Open Orders
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'HISTORY' ? 'border-primary-blue text-white' : 'border-transparent text-white/50 hover:text-white'
          }`}
        >
          Order History
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-white/50 bg-white/5 text-xs">
            <tr>
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Pair</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Side</th>
              <th className="px-6 py-3 font-medium text-right">Price</th>
              <th className="px-6 py-3 font-medium text-right">Amount</th>
              <th className="px-6 py-3 font-medium text-right">Filled</th>
              <th className="px-6 py-3 font-medium text-center">Status</th>
              <th className="px-6 py-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-white/50">
                  No orders found
                </td>
              </tr>
            )}
            {filteredOrders.map(order => (
              <tr key={order.orderId} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white/70">{order.time}</td>
                <td className="px-6 py-4 font-medium text-white">{order.pair}</td>
                <td className="px-6 py-4 text-white/70">{order.type}</td>
                <td className={`px-6 py-4 font-bold ${order.side === 'BUY' ? 'text-primary-green' : 'text-primary-pink'}`}>
                  {order.side}
                </td>
                <td className="px-6 py-4 text-right text-white">{order.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-white">{order.quantity.toFixed(4)}</td>
                <td className="px-6 py-4 text-right text-white">{((order.filled / order.quantity) * 100).toFixed(1)}%</td>
                <td className="px-6 py-4 text-center">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4 text-center">
                  {['NEW', 'PARTIALLY_FILLED'].includes(order.status) && (
                    <button className="text-primary-pink border border-primary-pink/30 hover:bg-primary-pink/10 px-3 py-1 rounded text-xs transition-colors">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
