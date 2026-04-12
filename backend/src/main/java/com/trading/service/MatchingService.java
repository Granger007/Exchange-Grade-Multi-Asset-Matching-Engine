package com.trading.service;

import com.trading.engine.FIFOEngine;
import com.trading.model.Order;
import com.trading.model.Trade;
import com.trading.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Matching Service - Engine Orchestration
 * 
 * Routes orders to FIFO engine only
 * Follows Single Responsibility Principle
 */
@Service
public class MatchingService {
    
    @Autowired
    private FIFOEngine fifoEngine;
    
    @Autowired
    private OrderRepository orderRepository;
    
    /**
     * Match an order using FIFO engine
     * 
     * @param order The order to match
     * @return List of trades generated
     */
    public List<Trade> matchOrder(Order order) {
        // Route to FIFO engine ONLY
        List<Trade> trades = fifoEngine.matchOrder(order);
        
        // Update order in database after matching
        orderRepository.save(order);
        
        return trades;
    }
    
    /**
     * Add order to matching engine
     * 
     * @param order The order to add
     */
    public void addOrder(Order order) {
        fifoEngine.addOrder(order);
    }
    
    /**
     * Remove order from matching engine
     * 
     * @param order The order to remove
     */
    public void removeOrder(Order order) {
        // FIFO engine would need this method for order cancellation
        // For now, we'll assume it's handled internally
    }
    
    /**
     * Get order book for an asset
     * 
     * @param asset Trading asset
     * @return Order book data
     */
    public FIFOEngine.OrderBookLevel getOrderBook(String asset) {
        return fifoEngine.getOrderBookDepth(asset);
    }
    
    /**
     * Get best bid price for an asset
     * 
     * @param asset Trading asset
     * @return Best bid price
     */
    public java.math.BigDecimal getBestBid(String asset) {
        return fifoEngine.getBestBid(asset);
    }
    
    /**
     * Get best ask price for an asset
     * 
     * @param asset Trading asset
     * @return Best ask price
     */
    public java.math.BigDecimal getBestAsk(String asset) {
        return fifoEngine.getBestAsk(asset);
    }
}
