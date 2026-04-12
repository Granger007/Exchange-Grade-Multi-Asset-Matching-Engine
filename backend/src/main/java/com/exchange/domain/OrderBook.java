package com.exchange.domain;

import java.util.Queue;
import java.util.TreeMap;
import java.util.LinkedList;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

/**
 * Order Book with FIFO support
 * 
 * Maintains separate price levels for BUY and SELL orders
 * Each price level contains a queue of orders (FIFO by timestamp)
 */
public class OrderBook {
    private final Map<String, String> pairToName;
    private final TreeMap<Double, Queue<Order>> bids;
    private final TreeMap<Double, Queue<Order>> asks;
    
    public OrderBook() {
        this.pairToName = new HashMap<>();
        this.bids = new TreeMap<>((a, b) -> Double.compare(b, a)); // Highest price first
        this.asks = new TreeMap<>(); // Lowest price first
    }
    
    public OrderBook(String pair) {
        this();
        this.pairToName.put(pair, pair);
    }
    
    /**
     * Add order to appropriate side of order book
     */
    public void addOrder(Order order) {
        TreeMap<Double, Queue<Order>> book = order.getSide() == OrderSide.BUY ? bids : asks;
        
        book.computeIfAbsent(order.getPrice(), k -> new LinkedList<>()).add(order);
    }
    
    /**
     * Get best bid order (highest price, oldest timestamp)
     */
    public Order getBestBid() {
        if (bids.isEmpty()) {
            return null;
        }
        Queue<Order> bestBidOrders = bids.firstEntry().getValue();
        return bestBidOrders.isEmpty() ? null : bestBidOrders.peek();
    }
    
    /**
     * Get best ask order (lowest price, oldest timestamp)
     */
    public Order getBestAsk() {
        if (asks.isEmpty()) {
            return null;
        }
        Queue<Order> bestAskOrders = asks.firstEntry().getValue();
        return bestAskOrders.isEmpty() ? null : bestAskOrders.peek();
    }
    
    /**
     * Get orders for opposite side (for matching)
     */
    public TreeMap<Double, Queue<Order>> getOppositeSide(OrderSide side) {
        return side == OrderSide.BUY ? asks : bids;
    }
    
    /**
     * Get all buy orders (sorted by price descending)
     */
    public List<Order> getBuyOrders() {
        List<Order> allBuyOrders = new ArrayList<>();
        bids.forEach((price, orders) -> {
            allBuyOrders.addAll(orders);
        });
        return allBuyOrders;
    }
    
    /**
     * Get all sell orders (sorted by price ascending)
     */
    public List<Order> getSellOrders() {
        List<Order> allSellOrders = new ArrayList<>();
        asks.forEach((price, orders) -> {
            allSellOrders.addAll(orders);
        });
        return allSellOrders;
    }
    
    /**
     * Remove order from order book
     */
    public void removeOrder(Order order) {
        TreeMap<Double, Queue<Order>> book = order.getSide() == OrderSide.BUY ? bids : asks;
        Queue<Order> ordersAtPrice = book.get(order.getPrice());
        
        if (ordersAtPrice != null) {
            ordersAtPrice.remove(order);
            if (ordersAtPrice.isEmpty()) {
                book.remove(order.getPrice());
            }
        }
    }
    
    /**
     * Get the trading pair name
     */
    public String getPairName() {
        return pairToName.values().stream().findFirst().orElse("UNKNOWN");
    }
    
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("OrderBook for ").append(getPairName()).append(":\n");
        sb.append("Best Bid: ").append(getBestBid() != null ? getBestBid().getPrice() : "N/A").append("\n");
        sb.append("Best Ask: ").append(getBestAsk() != null ? getBestAsk().getPrice() : "N/A").append("\n");
        return sb.toString();
    }
}
