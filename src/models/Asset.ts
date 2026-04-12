export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
}

export interface AssetPrice {
  symbol: string;
  price: number;
  timestamp: number;
}

export interface AssetDepth {
  pair: string;
  price: number;
  quantity: number;
  type: 'BID' | 'ASK';
}
