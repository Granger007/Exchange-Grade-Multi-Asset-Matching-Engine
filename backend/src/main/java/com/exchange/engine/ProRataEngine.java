package com.exchange.engine;

import com.exchange.domain.*;
import java.util.List;

/**
 * Pro-rata Matching Engine - Stub Implementation
 * 
 * This is a placeholder for future Pro-rata matching implementation.
 * Currently throws an error to indicate it's not implemented.
 * 
 * Follows Open/Closed Principle - ready for future extension
 * without modifying existing FIFO engine.
 */
public class ProRataEngine implements MatchingEngine {
    
    @Override
    public MatchingResult match(Order incomingOrder) {
        throw new UnsupportedOperationException("Pro-rata matching not implemented yet. Use FIFO engine instead.");
    }
    
    @Override
    public OrderBook getOrderBook(String pair) {
        throw new UnsupportedOperationException("Pro-rata matching not implemented yet. Use FIFO engine instead.");
    }
    
    @Override
    public List<Order> getAllOrders(String pair) {
        throw new UnsupportedOperationException("Pro-rata matching not implemented yet. Use FIFO engine instead.");
    }
    
    /**
     * Future implementation placeholder
     * This method will be implemented when Pro-rata matching is added
     */
    private void matchProRata(Order incomingOrder) {
        // TODO: Implement Pro-rata matching logic
        // Pro-rata matching allocates proportionally based on order quantities
        // at the same price level, rather than FIFO time priority
        
        /*
         * Pro-rata algorithm (for future implementation):
         * 1. Group orders by price level
         * 2. Calculate total quantity at each price level
         * 3. Allocate fills proportionally based on order size
         * 4. Handle partial fills and minimum order sizes
         */
        
        throw new UnsupportedOperationException("Pro-rata matching not yet implemented");
    }
}
