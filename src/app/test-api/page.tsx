'use client';

import { useEffect, useState } from 'react';

export default function TestAPI() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/orders/open');
      const data = await response.json();
      setOrders(data.orders || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch orders: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset: 'BTC/USDT',
          side: 'BUY',
          type: 'LIMIT',
          price: 63800,
          quantity: 0.5
        })
      });
      const data = await response.json();
      console.log('Order created:', data);
      fetchOrders(); // Refresh orders list
    } catch (err) {
      setError('Failed to create order: ' + err);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="mb-6">
        <button 
          onClick={createOrder}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Test Order
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">Current Orders ({orders.length})</h2>
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <span className={`font-semibold ${order.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                    {order.side}
                  </span>
                  <span className="ml-2">{order.asset}</span>
                </div>
                <div className="text-right">
                  <div>Price: ${order.price}</div>
                  <div>Qty: {order.quantity}</div>
                  <div className="text-sm text-gray-600">ID: {order.id}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>✅ Connected to Java Backend API</p>
        <p>✅ Orders are stored in memory (not MySQL yet)</p>
        <p>✅ Real-time order creation and retrieval working</p>
      </div>
    </div>
  );
}
