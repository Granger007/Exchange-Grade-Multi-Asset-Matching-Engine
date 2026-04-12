import { Order, CreateOrderRequest, OrderUpdate, OrderStatus } from '../models/Order';

export class OrderService {
  private static orders: Order[] = [];
  private static nextId = 1;

  static getAllOrders(): Order[] {
    return [...this.orders];
  }

  static getOrdersByUserId(userId: string): Order[] {
    return this.orders.filter(order => order.userId === userId);
  }

  static getOpenOrders(userId: string): Order[] {
    return this.orders.filter(order => 
      order.userId === userId && 
      (order.status === 'NEW' || order.status === 'PARTIALLY_FILLED')
    );
  }

  static getOrderHistory(userId: string): Order[] {
    return this.orders.filter(order => 
      order.userId === userId && 
      (order.status === 'FILLED' || order.status === 'CANCELLED')
    ).sort((a, b) => b.timestamp - a.timestamp);
  }

  static createOrder(request: CreateOrderRequest): Order {
    const order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...request,
      filledQuantity: 0,
      status: 'NEW' as OrderStatus,
      timestamp: Date.now(),
      updatedAt: Date.now()
    };

    this.orders.push(order);
    return order;
  }

  static updateOrder(orderId: string, updates: OrderUpdate): Order | null {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return null;
    }

    const updatedOrder = {
      ...this.orders[orderIndex],
      ...updates,
      updatedAt: Date.now()
    };

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  static cancelOrder(orderId: string): boolean {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return false;
    }

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      status: 'CANCELLED',
      updatedAt: Date.now()
    };

    return true;
  }

  static fillOrder(orderId: string, filledQuantity: number): Order | null {
    return this.updateOrder(orderId, {
      filledQuantity,
      status: filledQuantity >= this.orders.find(o => o.id === orderId)?.quantity! ? 'FILLED' : 'PARTIALLY_FILLED'
    });
  }

  // Mock data initialization
  static initializeMockData(): void {
    const mockOrders: Order[] = [
      {
        id: 'ORD-MOCK-001',
        userId: 'test-user-123',
        pair: 'BTC/USDT',
        side: 'BUY',
        type: 'LIMIT',
        price: 64000,
        quantity: 1.5,
        filledQuantity: 0,
        status: 'NEW',
        timestamp: Date.now() - 300000,
        updatedAt: Date.now() - 300000
      },
      {
        id: 'ORD-MOCK-002',
        userId: 'test-user-123',
        pair: 'BTC/USDT',
        side: 'SELL',
        type: 'LIMIT',
        price: 64100,
        quantity: 0.8,
        filledQuantity: 0,
        status: 'NEW',
        timestamp: Date.now() - 180000,
        updatedAt: Date.now() - 180000
      }
    ];

    this.orders.push(...mockOrders);
  }
}
