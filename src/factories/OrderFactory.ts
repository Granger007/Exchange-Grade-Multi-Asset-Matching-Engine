import { Order, CreateOrderRequest, OrderSide, OrderType, OrderStatus } from '../models/Order';

export class OrderFactory {
  static createMarketOrder(request: CreateOrderRequest): Order {
    return {
      id: this.generateOrderId(),
      ...request,
      type: 'MARKET',
      price: null,
      filledQuantity: 0,
      status: 'NEW',
      timestamp: Date.now(),
      updatedAt: Date.now()
    };
  }

  static createLimitOrder(request: CreateOrderRequest): Order {
    if (!request.price || request.price <= 0) {
      throw new Error('Limit orders require a valid price');
    }

    return {
      id: this.generateOrderId(),
      ...request,
      type: 'LIMIT',
      price: request.price,
      filledQuantity: 0,
      status: 'NEW',
      timestamp: Date.now(),
      updatedAt: Date.now()
    };
  }

  static createOrder(request: CreateOrderRequest): Order {
    if (request.type === 'MARKET') {
      return this.createMarketOrder(request);
    } else {
      return this.createLimitOrder(request);
    }
  }

  static updateOrder(order: Order, updates: Partial<Order>): Order {
    return {
      ...order,
      ...updates,
      updatedAt: Date.now()
    };
  }

  private static generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}
