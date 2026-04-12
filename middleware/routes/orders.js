/**
 * Orders Routes - Middleware Layer
 * 
 * MVC Pattern: Routes act as entry points to controllers
 * Clean Architecture: Routes only handle HTTP concerns
 */

const express = require('express');
const OrderController = require('../controllers/orderController');

const router = express.Router();

/**
 * POST /orders
 * Create and match a new order
 */
router.post('/', OrderController.createOrder);

/**
 * GET /orders/:asset
 * Get all orders for a specific asset
 */
router.get('/:asset', OrderController.getOrders);

/**
 * GET /orders/:asset/orderbook
 * Get order book for a specific asset
 */
router.get('/:asset/orderbook', OrderController.getOrderBook);

module.exports = router;
