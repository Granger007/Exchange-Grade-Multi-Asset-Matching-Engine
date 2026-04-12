import { useState, useCallback, useEffect } from 'react';
import { Order, OrderStatus } from '../models/Order';
import { OrderService } from '../services/OrderService';

export interface OrdersControllerState {
  openOrders: Order[];
  orderHistory: Order[];
  loading: boolean;
  error: string | null;
}

export interface OrdersControllerActions {
  cancelOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  clearError: () => void;
}

export const useOrdersController = (userId: string = 'test-user-123'): OrdersControllerState & OrdersControllerActions => {
  const [state, setState] = useState<OrdersControllerState>({
    openOrders: [],
    orderHistory: [],
    loading: false,
    error: null
  });

  const refreshOrders = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const openOrders = OrderService.getOpenOrders(userId);
      const orderHistory = OrderService.getOrderHistory(userId);
      
      setState(prev => ({
        ...prev,
        openOrders,
        orderHistory,
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load orders'
      }));
    }
  }, [userId]);

  const cancelOrder = useCallback(async (orderId: string): Promise<void> => {
    setState(prev => ({ ...prev, error: null }));

    try {
      const success = OrderService.cancelOrder(orderId);
      
      if (success) {
        setState(prev => ({
          ...prev,
          openOrders: prev.openOrders.filter(order => order.id !== orderId),
          orderHistory: [
            ...prev.orderHistory,
            ...prev.openOrders.filter(order => order.id === orderId)
          ]
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: 'Failed to cancel order'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to cancel order'
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  return {
    ...state,
    cancelOrder,
    refreshOrders,
    clearError
  };
};
