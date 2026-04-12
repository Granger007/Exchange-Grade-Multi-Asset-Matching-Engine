export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT';
export type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  pair: string;
  side: OrderSide;
  type: OrderType;
  price: number | null;
  quantity: number;
  filledQuantity: number;
  status: OrderStatus;
  timestamp: number;
  updatedAt: number;
}

export interface CreateOrderRequest {
  userId: string;
  pair: string;
  side: OrderSide;
  type: OrderType;
  price: number | null;
  quantity: number;
}

export interface OrderUpdate {
  status?: OrderStatus;
  filledQuantity?: number;
  updatedAt?: number;
}
