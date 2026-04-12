export interface Trade {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  pair: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: number;
  fee: number;
}

export interface TradeExecution {
  orderId: string;
  price: number;
  quantity: number;
  timestamp: number;
}

export interface CreateTradeRequest {
  buyOrderId: string;
  sellOrderId: string;
  pair: string;
  price: number;
  quantity: number;
}
