package com.exchange.engine;

import com.exchange.domain.*;
import java.util.List;

/**
 * Matching Engine Interface
 * 
 * Follows Open/Closed Principle - allows for different matching algorithms
 * FIFO and Pro-rata engines can be swapped without modifying existing code
 */
public interface MatchingEngine {
    
    /**
     * Match an incoming order against the order book
     * 
     * @param incomingOrder The order to match
     * @return MatchingResult containing trades and updated orders
     */
    MatchingResult match(Order incomingOrder);
    
    /**
     * Get the current order Book for a specific pair
     * 
     * @param pair The trading pair (e.g., "BTC/USDT")
     * @return OrderBook containing all orders for the pair
     */
    OrderBook getOrderBook(String pair);
    
    /**
     * Get all orders for a specific pair
     * 
     * @param pair The trading pair
     * @return List of all orders
     */
    List<Order> getAllOrders(String pair);
}
