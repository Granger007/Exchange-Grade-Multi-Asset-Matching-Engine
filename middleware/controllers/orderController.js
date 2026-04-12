/**
 * Order Controller - Middleware Layer
 * 
 * Follows MVC Pattern:
 * - Controller: Handles request orchestration
 * - Delegates business logic to services
 * - Returns structured responses
 */

const matchingService = require('../services/matchingService');

class OrderController {
  /**
   * Create and match a new order
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async createOrder(req, res) {
    try {
      // Validate request body
      const { asset, side, price, quantity, type } = req.body;
      
      // Input validation
      if (!asset || !side || !quantity || !type) {
        return res.status(400).json({
          error: 'Missing required fields: asset, side, quantity, type'
        });
      }
      
      if (!['BUY', 'SELL'].includes(side)) {
        return res.status(400).json({
          error: 'Invalid side. Must be BUY or SELL'
        });
      }
      
      if (!['LIMIT', 'MARKET'].includes(type)) {
        return res.status(400).json({
          error: 'Invalid type. Must be LIMIT or MARKET'
        });
      }
      
      if (type === 'LIMIT' && (!price || price <= 0)) {
        return res.status(400).json({
          error: 'Limit orders require a valid price'
        });
      }
      
      if (quantity <= 0) {
        return res.status(400).json({
          error: 'Quantity must be greater than 0'
        });
      }
      
      // Delegate to matching service
      const result = await matchingService.matchOrder({
        asset,
        side,
        price: type === 'LIMIT' ? parseFloat(price) : null,
        quantity: parseFloat(quantity),
        type,
        userId: req.body.userId || 'anonymous'
      });
      
      // Return success response
      res.status(200).json({
        orderId: result.orderId,
        status: result.status,
        filledQuantity: result.filledQuantity,
        remainingQuantity: result.remainingQuantity,
        trades: result.trades
      });
      
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  /**
   * Get order book for a specific asset
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getOrderBook(req, res) {
    try {
      const { asset } = req.params;
      
      if (!asset) {
        return res.status(400).json({
          error: 'Asset parameter is required'
        });
      }
      
      const orderBook = await matchingService.getOrderBook(asset);
      
      res.status(200).json({
        asset,
        orderBook
      });
      
    } catch (error) {
      console.error('Get order book error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  /**
   * Get all orders for a specific asset
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  static async getOrders(req, res) {
    try {
      const { asset } = req.params;
      const { userId } = req.query;
      
      if (!asset) {
        return res.status(400).json({
          error: 'Asset parameter is required'
        });
      }
      
      const orders = await matchingService.getOrders(asset, userId);
      
      res.status(200).json({
        asset,
        orders
      });
      
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
}

module.exports = OrderController;
