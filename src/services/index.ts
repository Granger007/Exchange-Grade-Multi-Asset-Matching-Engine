import { OrderService } from './OrderService';
import { TradeService } from './TradeService';
import { MarketService } from './MarketService';

// Initialize all services with mock data
export const initializeServices = () => {
  OrderService.initializeMockData();
  TradeService.initializeMockData();
  MarketService.initializeMockData();
};

export { OrderService, TradeService, MarketService };
