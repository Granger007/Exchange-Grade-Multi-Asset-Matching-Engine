package com.exchange.engine;

import com.exchange.domain.*;
import java.util.*;

/**
 * FIFO Order Matching Engine Implementation
 * 
 * Follows SOLID and GRASP principles:
 * - Single Responsibility: Handles only FIFO matching logic
 * - Open/Closed: Extensible via MatchingEngine interface
 * - Liskov: Substitutable with other matching engines
 * - Interface Segregation: Focused interfaces
 * - Dependency Inversion: Depends on abstractions
 */
public class FIFOEngine implements MatchingEngine {
    
    private final Map<String, OrderBook> orderBooks;
    
    public FIFOEngine() {
        this.orderBooks = new HashMap<>();
    }
    
    @Override
    public MatchingResult match(Order incomingOrder) {
        String pair = incomingOrder.getPair();
        OrderBook orderBook = orderBooks.computeIfAbsent(pair, k -> new OrderBook());
        
        List<TradeExecution> trades = new ArrayList<>();
        List<Order> matchedOrders = new ArrayList<>();
        
        // Determine opposite side and matching direction
        List<Order> oppositeSide = incomingOrder.getSide() == OrderSide.BUY 
            ? orderBook.getSellOrders() 
            : orderBook.getBuyOrders();
            
        // Sort by price priority
        oppositeSide.sort((a, b) -> {
            if (incomingOrder.getSide() == OrderSide.BUY) {
                return Double.compare(b.getPrice(), a.getPrice()); // Highest price for BUY
            } else {
                return Double.compare(a.getPrice(), b.getPrice()); // Lowest price for SELL
            }
        });
        
        // Match orders following FIFO rules
        Iterator<Order> iterator = oppositeSide.iterator();
        while (iterator.hasNext() && !incomingOrder.isFilled()) {
            Order restingOrder = iterator.next();
            
            if (canMatch(incomingOrder, restingOrder)) {
                // Calculate match quantity
                long matchQuantity = Math.min(
                    incomingOrder.getRemainingQuantity(), 
                    restingOrder.getRemainingQuantity()
                );
                
                // Create trade execution
                TradeExecution trade = createTrade(incomingOrder, restingOrder, matchQuantity);
                trades.add(trade);
                
                // Update order quantities
                updateOrderQuantities(incomingOrder, restingOrder, matchQuantity);
                matchedOrders.add(restingOrder);
                
                // Remove fully filled orders
                if (restingOrder.isFilled()) {
                    iterator.remove();
                }
            }
        }
        
        // Add remaining quantity to orderBook if not fully filled
        if (!incomingOrder.isFilled()) {
            orderBook.addOrder(incomingOrder);
        }
        
        // Update order book
        orderBooks.put(pair, orderBook);
        
        return new MatchingResult(trades, incomingOrder, matchedOrders);
    }
    
    /**
     * Check if orders can match based on price
     */
    private boolean canMatch(Order buyOrder, Order sellOrder) {
        if (buyOrder.getSide() == OrderSide.BUY) {
            return buyOrder.getPrice() >= sellOrder.getPrice();
        } else {
            return sellOrder.getPrice() <= buyOrder.getPrice();
        }
    }
    
    /**
     * Create trade execution from matched orders
     */
    private TradeExecution createTrade(Order buyOrder, Order sellOrder, long quantity) {
        double price = buyOrder.getSide() == OrderSide.BUY ? sellOrder.getPrice() : buyOrder.getPrice();
        
        return new TradeExecution(
            UUID.randomUUID().toString(),
            buyOrder.getId(),
            sellOrder.getId(),
            price,
            quantity,
            System.currentTimeMillis()
        );
    }
    
    /**
     * Update order quantities after matching
     */
    private void updateOrderQuantities(Order incomingOrder, Order restingOrder, long matchQuantity) {
        incomingOrder.reduceQuantity(matchQuantity);
        restingOrder.reduceQuantity(matchQuantity);
        
        // Update statuses
        if (incomingOrder.isFilled()) {
            incomingOrder.setStatus(OrderStatus.FILLED);
        } else {
            incomingOrder.setStatus(OrderStatus.PARTIALLY_FILLED);
        }
        
        if (restingOrder.isFilled()) {
            restingOrder.setStatus(OrderStatus.FILLED);
        } else {
            restingOrder.setStatus(OrderStatus.PARTIALLY_FILLED);
        }
    }
    
    @Override
    public OrderBook getOrderBook(String pair) {
        return orderBooks.getOrDefault(pair, new OrderBook());
    }
    
    @Override
    public List<Order> getAllOrders(String pair) {
        OrderBook orderBook = orderBooks.get(pair);
        if (orderBook == null) return new ArrayList<>();
        
        List<Order> allOrders = new ArrayList<>();
        allOrders.addAll(orderBook.getBuyOrders());
        allOrders.addAll(orderBook.getSellOrders());
        return allOrders;
    }
}
