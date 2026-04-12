import { Trade } from '../models/Trade';

export class TradeService {
  private static trades: Trade[] = [];

  static getAllTrades(): Trade[] {
    return [...this.trades];
  }

  static getTradesByUserId(userId: string): Trade[] {
    return this.trades.filter(trade => 
      trade.buyOrderId.startsWith(`ORD-${userId}`) || 
      trade.sellOrderId.startsWith(`ORD-${userId}`)
    );
  }

  static getTradesByPair(pair: string): Trade[] {
    return this.trades.filter(trade => trade.pair === pair);
  }

  static createTrade(trade: Omit<Trade, 'id'>): Trade {
    const newTrade = {
      ...trade,
      id: `TRD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    this.trades.push(newTrade);
    return newTrade;
  }

  static getRecentTrades(limit: number = 50): Trade[] {
    return this.trades
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Mock data initialization
  static initializeMockData(): void {
    const mockTrades: Trade[] = [
      {
        id: 'TRD-MOCK-001',
        buyOrderId: 'ORD-MOCK-001',
        sellOrderId: 'ORD-MOCK-002',
        pair: 'BTC/USDT',
        price: 64050,
        quantity: 0.5,
        side: 'BUY',
        timestamp: Date.now() - 60000,
        fee: 32.025
      },
      {
        id: 'TRD-MOCK-002',
        buyOrderId: 'ORD-MOCK-003',
        sellOrderId: 'ORD-MOCK-004',
        pair: 'BTC/USDT',
        price: 63980,
        quantity: 0.3,
        side: 'SELL',
        timestamp: Date.now() - 120000,
        fee: 19.194
      }
    ];

    this.trades.push(...mockTrades);
  }
}
