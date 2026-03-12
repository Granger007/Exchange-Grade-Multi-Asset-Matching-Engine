// Placeholder API functions for Java Spring Boot backend integration

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
}

export interface StockData {
  symbol: string;
  company: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
}

export interface EquityData {
  company: string;
  investmentValue: number;
  returnPercent: number;
  riskScore: number;
  shares: number;
}

export interface PortfolioData {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  assetAllocation: {
    crypto: number;
    stocks: number;
    equity: number;
  };
  performance: Array<{
    date: string;
    value: number;
  }>;
}

export interface RiskAlert {
  id: number;
  type: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  asset: string;
  timestamp: string;
  action?: string;
}

export interface Notification {
  id: number;
  type: 'price' | 'risk' | 'trade' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// API Client
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Crypto endpoints
  async getCryptoData(): Promise<ApiResponse<CryptoData[]>> {
    return this.request<CryptoData[]>('/crypto');
  }

  async getCryptoById(id: string): Promise<ApiResponse<CryptoData>> {
    return this.request<CryptoData>(`/crypto/${id}`);
  }

  // Stock endpoints
  async getStockData(): Promise<ApiResponse<StockData[]>> {
    return this.request<StockData[]>('/stocks');
  }

  async getStockBySymbol(symbol: string): Promise<ApiResponse<StockData>> {
    return this.request<StockData>(`/stocks/${symbol}`);
  }

  // Equity endpoints
  async getEquityData(): Promise<ApiResponse<EquityData[]>> {
    return this.request<EquityData[]>('/equity');
  }

  // Portfolio endpoints
  async getPortfolioData(): Promise<ApiResponse<PortfolioData>> {
    return this.request<PortfolioData>('/portfolio');
  }

  async updatePortfolio(data: Partial<PortfolioData>): Promise<ApiResponse<PortfolioData>> {
    return this.request<PortfolioData>('/portfolio', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Risk alerts endpoints
  async getRiskAlerts(): Promise<ApiResponse<RiskAlert[]>> {
    return this.request<RiskAlert[]>('/risk-alerts');
  }

  async dismissRiskAlert(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/risk-alerts/${id}`, {
      method: 'DELETE',
    });
  }

  // Notifications endpoints
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.request<Notification[]>('/notifications');
  }

  async markNotificationAsRead(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.request<void>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async dismissNotification(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }

  // Market overview endpoints
  async getMarketOverview(): Promise<ApiResponse<{
    btc: { price: string; change: number; changePercent: string };
    eth: { price: string; change: number; changePercent: string };
    sp500: { price: string; change: number; changePercent: string };
    nasdaq: { price: string; change: number; changePercent: string };
    topGainers: StockData[];
    topLosers: StockData[];
  }>> {
    return this.request('/market/overview');
  }

  // Trading endpoints
  async executeTrade(data: {
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    price?: number;
  }): Promise<ApiResponse<{ orderId: string; status: string }>> {
    return this.request('/trades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTradeHistory(): Promise<ApiResponse<Array<{
    id: string;
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
    timestamp: string;
    status: string;
  }>>> {
    return this.request('/trades/history');
  }
}

export const apiClient = new ApiClient();

// Utility functions for frontend until backend is ready
export const mockData = {
  getCryptoData: (): CryptoData[] => [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: 43567, change24h: 1234, volume: '28.5B', marketCap: '852B' },
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: 2234, change24h: -89, volume: '15.2B', marketCap: '268B' },
    { id: '3', name: 'Binance Coin', symbol: 'BNB', price: 312, change24h: 8, volume: '1.8B', marketCap: '48B' },
  ],
  
  getStockData: (): StockData[] => [
    { symbol: 'AAPL', company: 'Apple Inc.', price: 178.45, change: 2.34, volume: '52.3M', marketCap: '2.8T' },
    { symbol: 'TSLA', company: 'Tesla Inc.', price: 245.67, change: -5.23, volume: '118.7M', marketCap: '780B' },
    { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 142.89, change: 1.45, volume: '28.4M', marketCap: '1.8T' },
  ],
  
  getPortfolioData: (): PortfolioData => ({
    totalValue: 72000,
    dailyChange: 2340,
    dailyChangePercent: 3.4,
    assetAllocation: {
      crypto: 35,
      stocks: 40,
      equity: 25,
    },
    performance: [
      { date: 'Jan', value: 45000 },
      { date: 'Feb', value: 52000 },
      { date: 'Mar', value: 48000 },
      { date: 'Apr', value: 61000 },
      { date: 'May', value: 58000 },
      { date: 'Jun', value: 67000 },
      { date: 'Jul', value: 72000 },
    ],
  }),
};
