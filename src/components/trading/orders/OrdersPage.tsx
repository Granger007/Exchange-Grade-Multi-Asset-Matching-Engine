import React, { useState } from 'react';
import { useOrdersController } from '../../../controllers/useOrdersController';
import { Table } from '../shared/Table';
import { Button } from '../shared/Button';
import { Order } from '../../../models/Order';
import { OpenOrdersTable } from './OpenOrdersTable';
import { OrderHistoryTable } from './OrderHistoryTable';

type TabType = 'open' | 'history';

export const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('open');
  const {
    openOrders,
    orderHistory,
    loading,
    error,
    cancelOrder,
    refreshOrders,
    clearError
  } = useOrdersController();

  const handleRefresh = async () => {
    await refreshOrders();
  };

  const handleCancel = async (orderId: string) => {
    await cancelOrder(orderId);
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Orders</h2>
        <Button
          onClick={handleRefresh}
          loading={loading}
          variant="secondary"
          size="sm"
        >
          Refresh
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-red-400">{error}</p>
            <Button
              onClick={clearError}
              variant="secondary"
              size="sm"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-white/10">
        <button
          onClick={() => setActiveTab('open')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'open'
              ? 'text-white border-b-2 border-primary-blue'
              : 'text-white/50 hover:text-white border-b-2 border-transparent'
          }`}
        >
          Open Orders ({openOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'text-white border-b-2 border-primary-blue'
              : 'text-white/50 hover:text-white border-b-2 border-transparent'
          }`}
        >
          Order History ({orderHistory.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'open' && (
          <OpenOrdersTable
            orders={openOrders}
            onCancelOrder={handleCancel}
            loading={loading}
          />
        )}
        
        {activeTab === 'history' && (
          <OrderHistoryTable
            orders={orderHistory}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};
