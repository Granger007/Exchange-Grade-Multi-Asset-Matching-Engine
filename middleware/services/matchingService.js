/**
 * Matching Service - Middleware Layer
 * 
 * Follows SOLID Principles:
 * - Single Responsibility: Handles only matching orchestration
 * - Open/Closed: Can be extended with new matching engines
 * - Dependency Inversion: Depends on matching engine interface
 */

const axios = require('axios');

class MatchingService {
  constructor() {
    // Backend API endpoint
    this.backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
  }
  
  /**
   * Match an order using the FIFO matching engine
   * 
   * @param {Object} orderRequest - Order details
   * @returns {Object} Matching result
   */
  async matchOrder(orderRequest) {
    try {
      // Call backend matching engine
      const response = await axios.post(`${this.backendUrl}/api/orders/match`, orderRequest, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000 // 5 second timeout
      });
      
      return response.data;
      
    } catch (error) {
      // Fallback to local mock matching if backend is unavailable
      console.warn('Backend unavailable, using local mock matching');
      return this.mockMatchOrder(orderRequest);
    }
  }
  
  /**
   * Get order book for a specific asset
   * 
   * @param {string} asset - Trading asset
   * @returns {Object} Order book data
   */
  async getOrderBook(asset) {
    try {
      const response = await axios.get(`${this.backendUrl}/api/orderbook/${asset}`, {
        timeout: 3000
      });
      
      return response.data;
      
    } catch (error) {
      console.warn('Backend unavailable, using local mock order book');
      return this.mockOrderBook(asset);
    }
  }
  
  /**
   * Get all orders for a specific asset
   * 
   * @param {string} asset - Trading asset
   * @param {string} userId - Optional user filter
   * @returns {Object} Orders data
   */
  async getOrders(asset, userId = null) {
    try {
      const url = userId 
        ? `${this.backendUrl}/api/orders/${asset}?userId=${userId}`
        : `${this.backendUrl}/api/orders/${asset}`;
        
      const response = await axios.get(url, {
        timeout: 3000
      });
      
      return response.data;
      
    } catch (error) {
      console.warn('Backend unavailable, using local mock orders');
      return this.mockOrders(asset, userId);
    }
  }
  
  /**
   * Mock matching for fallback when backend is unavailable
   * 
   * @param {Object} orderRequest - Order details
   * @returns {Object} Mock matching result
   */
  mockMatchOrder(orderRequest) {
    const orderId = `MOCK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Simulate partial or full fill based on random
    const fillProbability = 0.7; // 70% chance of some fill
    const partialFillProbability = 0.6; // 60% chance of partial if filled
    
    let filledQuantity = 0;
    let status = 'NEW';
    let trades = [];
    
    if (Math.random() < fillProbability) {
      if (Math.random() < partialFillProbability) {
        // Partial fill
        filledQuantity = orderRequest.quantity * (0.3 + Math.random() * 0.4); // 30-70% fill
        status = 'PARTIALLY_FILLED';
      } else {
        // Full fill
        filledQuantity = orderRequest.quantity;
        status = 'FILLED';
      }
      
      // Create mock trade
      trades.push({
        id: `TRADE-${Date.now()}`,
        price: orderRequest.price || 64000 + Math.random() * 100,
        quantity: filledQuantity,
        buyOrderId: orderRequest.side === 'BUY' ? orderId : `MOCK-SELL-${Date.now()}`,
        sellOrderId: orderRequest.side === 'SELL' ? orderId : `MOCK-BUY-${Date.now()}`,
        timestamp: Date.now()
      });
    }
    
    return {
      orderId,
      status,
      filledQuantity,
      remainingQuantity: orderRequest.quantity - filledQuantity,
      trades
    };
  }
  
  /**
   * Mock order book for fallback
   * 
   * @param {string} asset - Trading asset
   * @returns {Object} Mock order book
   */
  mockOrderBook(asset) {
    const bids = [];
    const asks = [];
    
    // Generate mock bids
    for (let i = 0; i < 10; i++) {
      const price = 64000 - i * 10 - Math.random() * 5;
      const quantity = Math.random() * 2 + 0.1;
      
      bids.push({
        price,
        quantity,
        orders: [{
          id: `MOCK-BID-${i}-${Date.now()}`,
          price,
          quantity,
          side: 'BUY',
          timestamp: Date.now() - i * 1000
        }]
      });
    }
    
    // Generate mock asks
    for (let i = 0; i < 10; i++) {
      const price = 64010 + i * 10 + Math.random() * 5;
      const quantity = Math.random() * 2 + 0.1;
      
      asks.push({
        price,
        quantity,
        orders: [{
          id: `MOCK-ASK-${i}-${Date.now()}`,
          price,
          quantity,
          side: 'SELL',
          timestamp: Date.now() - i * 1000
        }]
      });
    }
    
    return {
      asset,
      bids,
      asks,
      bestBid: bids[0]?.price || null,
      bestAsk: asks[0]?.price || null,
      spread: bids[0] && asks[0] ? asks[0].price - bids[0].price : null
    };
  }
  
  /**
   * Mock orders for fallback
   * 
   * @param {string} asset - Trading asset
   * @param {string} userId - User filter
   * @returns {Object} Mock orders
   */
  mockOrders(asset, userId = null) {
    const orders = [];
    
    // Generate mock orders
    for (let i = 0; i < 5; i++) {
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const type = Math.random() > 0.3 ? 'LIMIT' : 'MARKET';
      const quantity = Math.random() * 2 + 0.1;
      const filledQuantity = Math.random() * quantity;
      
      orders.push({
        id: `MOCK-ORDER-${i}-${Date.now()}`,
        asset,
        side,
        type,
        price: type === 'LIMIT' ? 64000 + (Math.random() - 0.5) * 100 : null,
        quantity,
        filledQuantity,
        remainingQuantity: quantity - filledQuantity,
        status: filledQuantity === 0 ? 'NEW' : filledQuantity === quantity ? 'FILLED' : 'PARTIALLY_FILLED',
        timestamp: Date.now() - i * 60000,
        userId: userId || `user-${i}`
      });
    }
    
    return {
      asset,
      orders: orders.sort((a, b) => b.timestamp - a.timestamp)
    };
  }
}

module.exports = new MatchingService();
