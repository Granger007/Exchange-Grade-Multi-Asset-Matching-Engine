import { useState, useCallback } from 'react';
import { CreateOrderRequest, OrderSide, OrderType } from '../models/Order';
import { OrderFactory } from '../factories/OrderFactory';

export interface TradeControllerState {
  isSubmitting: boolean;
  lastError: string | null;
  selectedAsset: string;
  orderType: OrderType;
  side: OrderSide;
  quantity: string;
  price: string;
}

export interface TradeControllerActions {
  setSelectedAsset: (asset: string) => void;
  setOrderType: (type: OrderType) => void;
  setSide: (side: OrderSide) => void;
  setQuantity: (quantity: string) => void;
  setPrice: (price: string) => void;
  submitOrder: () => Promise<void>;
  resetForm: () => void;
}

export const useTradeController = (): TradeControllerState & TradeControllerActions => {
  const [state, setState] = useState<TradeControllerState>({
    isSubmitting: false,
    lastError: null,
    selectedAsset: 'BTC',
    orderType: 'LIMIT',
    side: 'BUY',
    quantity: '',
    price: '64000.00'
  });

  const setSelectedAsset = useCallback((asset: string) => {
    setState(prev => ({ ...prev, selectedAsset: asset, lastError: null }));
  }, []);

  const setOrderType = useCallback((type: OrderType) => {
    setState(prev => ({ ...prev, orderType: type, lastError: null }));
  }, []);

  const setSide = useCallback((side: OrderSide) => {
    setState(prev => ({ ...prev, side, lastError: null }));
  }, []);

  const setQuantity = useCallback((quantity: string) => {
    setState(prev => ({ ...prev, quantity: quantity, lastError: null }));
  }, []);

  const setPrice = useCallback((price: string) => {
    setState(prev => ({ ...prev, price: price, lastError: null }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const qty = parseFloat(state.quantity);
    
    if (!state.quantity || isNaN(qty) || qty <= 0) {
      return false;
    }

    if (state.orderType === 'LIMIT') {
      const prc = parseFloat(state.price);
      return !isNaN(prc) && prc > 0;
    }

    return true;
  }, [state.quantity, state.price, state.orderType]);

  const submitOrder = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      setState(prev => ({ ...prev, lastError: 'Please fill all required fields' }));
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, lastError: null }));

    try {
      const orderRequest = {
        asset: `${state.selectedAsset}/USDT`,
        side: state.side,
        price: state.orderType === 'LIMIT' ? parseFloat(state.price) : null,
        quantity: parseFloat(state.quantity),
        type: state.orderType,
        userId: 'test-user-123'
      };

      // Call middleware API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to place order');
      }

      const result = await response.json();
      
      // Show success notification
      console.log('Order placed successfully:', result);
      
      // Reset form on success
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        quantity: '',
        price: state.orderType === 'LIMIT' ? '64000.00' : '',
        lastError: null
      }));

      // Trigger toast notification (would be handled by a notification system)
      if (result.trades && result.trades.length > 0) {
        console.log(`Order executed: ${result.filledQuantity} filled at ${result.trades[0].price}`);
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        lastError: error instanceof Error ? error.message : 'Failed to place order'
      }));
    }
  }, [state, validateForm]);

  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      quantity: '',
      price: state.orderType === 'LIMIT' ? '64000.00' : '',
      lastError: null
    }));
  }, [state.orderType]);

  return {
    ...state,
    setSelectedAsset,
    setOrderType,
    setSide,
    setQuantity,
    setPrice,
    submitOrder,
    resetForm
  };
};
