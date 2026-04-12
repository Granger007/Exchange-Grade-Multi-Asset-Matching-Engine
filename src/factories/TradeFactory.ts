import { Trade, CreateTradeRequest } from '../models/Trade';

export class TradeFactory {
  static createTrade(request: CreateTradeRequest): Trade {
    return {
      id: this.generateTradeId(),
      ...request,
      side: 'BUY', // Default, can be determined by business logic
      timestamp: Date.now(),
      fee: this.calculateFee(request.quantity, request.price)
    };
  }

  static createTradeFromOrders(buyOrder: any, sellOrder: any, price: number, quantity: number): Trade {
    return {
      id: this.generateTradeId(),
      buyOrderId: buyOrder.id,
      sellOrderId: sellOrder.id,
      pair: buyOrder.pair,
      price,
      quantity,
      side: 'BUY',
      timestamp: Date.now(),
      fee: this.calculateFee(quantity, price)
    };
  }

  private static generateTradeId(): string {
    return `TRD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  private static calculateFee(quantity: number, price: number): number {
    const notional = quantity * price;
    return notional * 0.001; // 0.1% fee
  }
}
