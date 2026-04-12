import React from 'react';
import { Order, OrderStatus } from '../../../models/Order';
import { Table } from '../shared/Table';

export interface OrderHistoryTableProps {
  orders: Order[];
  loading?: boolean;
}

export const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({
  orders,
  loading = false
}) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'FILLED': return 'text-primary-green';
      case 'CANCELLED': return 'text-primary-pink';
      case 'PARTIALLY_FILLED': return 'text-yellow-400';
      default: return 'text-white/70';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'FILLED': return 'Filled';
      case 'CANCELLED': return 'Cancelled';
      case 'PARTIALLY_FILLED': return 'Partially Filled';
      default: return status;
    }
  };

  const columns = [
    {
      key: 'pair',
      title: 'Pair',
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'side',
      title: 'Side',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          value === 'BUY' ? 'bg-primary-green/20 text-primary-green' : 'bg-primary-pink/20 text-primary-pink'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'type',
      title: 'Type',
      render: (value: string) => (
        <span className="text-white/70">{value}</span>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (value: number | null) => (
        <span className="font-medium">
          {value ? `$${value.toFixed(2)}` : 'Market'}
        </span>
      )
    },
    {
      key: 'quantity',
      title: 'Quantity',
      render: (value: number) => (
        <span>{value.toFixed(4)}</span>
      )
    },
    {
      key: 'filledQuantity',
      title: 'Filled',
      render: (value: number, item: Order) => {
        const percentage = item.quantity > 0 ? (value / item.quantity) * 100 : 0;
        return (
          <div>
            <span>{value.toFixed(4)}</span>
            <span className="text-white/50 text-xs ml-1">({percentage.toFixed(1)}%)</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: OrderStatus) => (
        <span className={`font-medium ${getStatusColor(value)}`}>
          {getStatusText(value)}
        </span>
      )
    },
    {
      key: 'timestamp',
      title: 'Time',
      render: (value: number) => (
        <span className="text-white/70 text-sm">
          {new Date(value).toLocaleString()}
        </span>
      )
    }
  ];

  return (
    <Table
      data={orders}
      columns={columns}
      loading={loading}
      emptyMessage="No order history"
      className="min-h-[300px]"
    />
  );
};
