package com.exchange.domain;

/**
 * Order Entity - Domain Model
 * 
 * Follows SOLID Principles:
 * - Single Responsibility: Represents order data and behavior
 * - Information Expert: Handles its own quantity management
 */
public class Order {
    private final String id;
    private final String pair;
    private final OrderSide side;
    private final Double price; // null for market orders
    private final long quantity;
    private long remainingQuantity;
    private OrderStatus status;
    private final long timestamp;
    private final String userId;

    public Order(String id, String pair, OrderSide side, Double price, long quantity, 
                 long remainingQuantity, OrderStatus status, long timestamp) {
        this.id = id;
        this.pair = pair;
        this.side = side;
        this.price = price;
        this.quantity = quantity;
        this.remainingQuantity = remainingQuantity;
        this.status = status;
        this.timestamp = timestamp;
        this.userId = "default-user"; // Default user for now
    }

    // Legacy constructor for backward compatibility
    public Order(String orderId, double price, long quantity, OrderSide side, long timestamp) {
        this(orderId, "BTC/USDT", side, price, quantity, quantity, OrderStatus.NEW, timestamp);
    }

    public String getId() {
        return id;
    }

    public String getPair() {
        return pair;
    }

    public OrderSide getSide() {
        return side;
    }

    public Double getPrice() {
        return price;
    }

    public long getQuantity() {
        return quantity;
    }

    public long getRemainingQuantity() {
        return remainingQuantity;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public String getUserId() {
        return userId;
    }

    /**
     * Reduce remaining quantity (Information Expert pattern)
     */
    public void reduceQuantity(long amount) {
        if (amount > remainingQuantity) {
            throw new IllegalArgumentException("Cannot reduce quantity below zero");
        }
        remainingQuantity -= amount;
        
        // Update status based on remaining quantity
        if (remainingQuantity == 0) {
            status = OrderStatus.FILLED;
        } else if (remainingQuantity < quantity) {
            status = OrderStatus.PARTIALLY_FILLED;
        }
    }

    /**
     * Check if order is fully filled
     */
    public boolean isFilled() {
        return remainingQuantity == 0;
    }

    /**
     * Check if order is partially filled
     */
    public boolean isPartiallyFilled() {
        return remainingQuantity > 0 && remainingQuantity < quantity;
    }

    /**
     * Set order status
     */
    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    // Legacy getters for backward compatibility
    public String getOrderId() {
        return id;
    }
}
