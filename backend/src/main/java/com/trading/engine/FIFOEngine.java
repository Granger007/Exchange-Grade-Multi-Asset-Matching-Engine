package com.trading.engine;

import com.trading.model.Order;
import com.trading.model.OrderSide;
import com.trading.model.Trade;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;

/**
 * FIFO Matching Engine Implementation
 * 
 * Core matching engine implementing FIFO (First-In-First-Out) algorithm
 * Uses PriorityQueue for price priority and maintains FIFO queues within price levels
 */
@Component
public class FIFOEngine {
    
    // Order books per asset: asset -> (side -> (price -> queue of orders))
    private final Map<String, Map<OrderSide, NavigableMap<BigDecimal, Queue<Order>>>> orderBooks;
    
    public FIFOEngine() {
        this.orderBooks = new HashMap<>();
    }
    
    /**
     * Match an incoming order against the order book
     * 
     * @param incomingOrder The order to match
     * @return List of trades generated from matching
     */
    public List<Trade> matchOrder(Order incomingOrder) {
        List<Trade> trades = new ArrayList<>();
        
        // Get or create order book for the asset
        Map<OrderSide, NavigableMap<BigDecimal, Queue<Order>>> assetOrderBook = 
            orderBooks.computeIfAbsent(incomingOrder.getAsset(), k -> new HashMap<>());
        
        // Get opposite side order book
        OrderSide oppositeSide = incomingOrder.getSide() == OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;
        NavigableMap<BigDecimal, Queue<Order>> oppositeSideOrders = 
            assetOrderBook.computeIfAbsent(oppositeSide, k -> new TreeMap<>());
        
        // Find matching orders
        List<Order> matchedOrders = findMatchingOrders(incomingOrder, oppositeSideOrders);
        
        // Execute trades
        for (Order restingOrder : matchedOrders) {
            if (incomingOrder.isFilled()) {
                break;
            }
            
            Trade trade = executeTrade(incomingOrder, restingOrder);
            trades.add(trade);
            
            // Update order quantities
            incomingOrder.fillQuantity(trade.getQuantity());
            restingOrder.fillQuantity(trade.getQuantity());
            
            // Remove fully filled orders from order book
            if (restingOrder.isFilled()) {
                removeFromOrderBook(restingOrder);
            }
        }
        
        // Add remaining quantity of incoming order to order book
        if (!incomingOrder.isFilled()) {
            addToOrderBook(incomingOrder);
        }
        
        return trades;
    }
    
    /**
     * Add order to order book
     */
    public void addOrder(Order order) {
        addToOrderBook(order);
    }
    
    /**
     * Get order book for an asset
     */
    public Map<OrderSide, NavigableMap<BigDecimal, Queue<Order>>> getOrderBook(String asset) {
        return orderBooks.getOrDefault(asset, new HashMap<>());
    }
    
    /**
     * Find matching orders according to FIFO rules
     */
    private List<Order> findMatchingOrders(Order incomingOrder, 
                                         NavigableMap<BigDecimal, Queue<Order>> oppositeSideOrders) {
        List<Order> matchingOrders = new ArrayList<>();
        
        if (incomingOrder.getSide() == OrderSide.BUY) {
            // BUY orders match with lowest SELL prices first
            for (Map.Entry<BigDecimal, Queue<Order>> entry : oppositeSideOrders.entrySet()) {
                BigDecimal sellPrice = entry.getKey();
                if (incomingOrder.getPrice() == null || incomingOrder.getPrice().compareTo(sellPrice) >= 0) {
                    Queue<Order> ordersAtPrice = entry.getValue();
                    for (Order order : ordersAtPrice) {
                        matchingOrders.add(order);
                    }
                } else {
                    break; // Price too high for further matching
                }
            }
        } else {
            // SELL orders match with highest BUY prices first
            for (Map.Entry<BigDecimal, Queue<Order>> entry : oppositeSideOrders.descendingMap().entrySet()) {
                BigDecimal buyPrice = entry.getKey();
                if (incomingOrder.getPrice() == null || incomingOrder.getPrice().compareTo(buyPrice) <= 0) {
                    Queue<Order> ordersAtPrice = entry.getValue();
                    for (Order order : ordersAtPrice) {
                        matchingOrders.add(order);
                    }
                } else {
                    break; // Price too low for further matching
                }
            }
        }
        
        return matchingOrders;
    }
    
    /**
     * Execute a trade between two orders
     */
    private Trade executeTrade(Order buyOrder, Order sellOrder) {
        // Determine trade price (use resting order's price)
        BigDecimal tradePrice = buyOrder.getSide() == OrderSide.BUY ? sellOrder.getPrice() : buyOrder.getPrice();
        
        // Determine trade quantity (minimum of remaining quantities)
        BigDecimal tradeQuantity = buyOrder.getRemainingQuantity().min(sellOrder.getRemainingQuantity());
        
        // Create trade record
        return new Trade(buyOrder.getId(), sellOrder.getId(), buyOrder.getAsset(), tradePrice, tradeQuantity);
    }
    
    /**
     * Add order to appropriate position in order book
     */
    private void addToOrderBook(Order order) {
        Map<OrderSide, NavigableMap<BigDecimal, Queue<Order>>> assetOrderBook = 
            orderBooks.computeIfAbsent(order.getAsset(), k -> new HashMap<>());
        
        NavigableMap<BigDecimal, Queue<Order>> sideOrders = 
            assetOrderBook.computeIfAbsent(order.getSide(), k -> new TreeMap<>());
        
        Queue<Order> ordersAtPrice = sideOrders.computeIfAbsent(order.getPrice(), k -> new LinkedList<>());
        ordersAtPrice.add(order);
    }
    
    /**
     * Remove order from order book
     */
    private void removeFromOrderBook(Order order) {
        Map<OrderSide, NavigableMap<BigDecimal, Queue<Order>>> assetOrderBook = orderBooks.get(order.getAsset());
        if (assetOrderBook == null) return;
        
        NavigableMap<BigDecimal, Queue<Order>> sideOrders = assetOrderBook.get(order.getSide());
        if (sideOrders == null) return;
        
        Queue<Order> ordersAtPrice = sideOrders.get(order.getPrice());
        if (ordersAtPrice != null) {
            ordersAtPrice.remove(order);
            if (ordersAtPrice.isEmpty()) {
                sideOrders.remove(order.getPrice());
            }
        }
    }
    
    /**
     * Get best bid price for an asset
     */
    public BigDecimal getBestBid(String asset) {
        Map<OrderSide, NavigableMap<BigDecimal, Queue<Order>>> assetOrderBook = orderBooks.get(asset);
        if (assetOrderBook == null) return null;
        
        NavigableMap<BigDecimal, Queue<Order>> bidOrders = assetOrderBook.get(OrderSide.BUY);
        if (bidOrders == null || bidOrders.isEmpty()) return null;
        
        return bidOrders.lastKey(); // Highest price
    }
    
    /**
     * Get best ask price for an asset
     */
    public BigDecimal getBestAsk(String asset) {
        Map<OrderSide, NavigableMap<BigDecimal, Queue<Order>>> assetOrderBook = orderBooks.get(asset);
        if (assetOrderBook == null) return null;
        
        NavigableMap<BigDecimal, Queue<Order>> askOrders = assetOrderBook.get(OrderSide.SELL);
        if (askOrders == null || askOrders.isEmpty()) return null;
        
        return askOrders.firstKey(); // Lowest price
    }
    
    /**
     * Get order book depth for an asset
     */
    public List<OrderBookLevel> getOrderBookDepth(String asset) {
        List<OrderBookLevel> depth = new ArrayList<>();
        Map<OrderSide, NavigableMap<BigDecimal, Queue<Order>>> assetOrderBook = orderBooks.get(asset);
        
        if (assetOrderBook != null) {
            // Add bids (highest to lowest)
            NavigableMap<BigDecimal, Queue<Order>> bidOrders = assetOrderBook.get(OrderSide.BUY);
            if (bidOrders != null) {
                for (Map.Entry<BigDecimal, Queue<Order>> entry : bidOrders.descendingMap().entrySet()) {
                    BigDecimal price = entry.getKey();
                    BigDecimal totalQuantity = entry.getValue().stream()
                        .map(Order::getRemainingQuantity)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                    depth.add(new OrderBookLevel(OrderSide.BUY, price, totalQuantity, entry.getValue().size()));
                }
            }
            
            // Add asks (lowest to highest)
            NavigableMap<BigDecimal, Queue<Order>> askOrders = assetOrderBook.get(OrderSide.SELL);
            if (askOrders != null) {
                for (Map.Entry<BigDecimal, Queue<Order>> entry : askOrders.entrySet()) {
                    BigDecimal price = entry.getKey();
                    BigDecimal totalQuantity = entry.getValue().stream()
                        .map(Order::getRemainingQuantity)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                    depth.add(new OrderBookLevel(OrderSide.SELL, price, totalQuantity, entry.getValue().size()));
                }
            }
        }
        
        return depth;
    }
    
    /**
     * Order book level representation
     */
    public static class OrderBookLevel {
        private final OrderSide side;
        private final BigDecimal price;
        private final BigDecimal totalQuantity;
        private final int orderCount;
        
        public OrderBookLevel(OrderSide side, BigDecimal price, BigDecimal totalQuantity, int orderCount) {
            this.side = side;
            this.price = price;
            this.totalQuantity = totalQuantity;
            this.orderCount = orderCount;
        }
        
        // Getters
        public OrderSide getSide() { return side; }
        public BigDecimal getPrice() { return price; }
        public BigDecimal getTotalQuantity() { return totalQuantity; }
        public int getOrderCount() { return orderCount; }
    }
}
