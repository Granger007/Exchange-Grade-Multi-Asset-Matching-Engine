package com.exchange.domain;

public class Order {
    private final String orderId;
    private final double price;
    private long quantity;
    private final OrderSide side;
    private OrderStatus status;
    private final long timestamp;

    public Order(String orderId, double price, long quantity, OrderSide side, long timestamp) {
        this.orderId = orderId;
        this.price = price;
        this.quantity = quantity;
        this.side = side;
        this.status = OrderStatus.NEW;
        this.timestamp = timestamp;
    }

    public String getOrderId() {
        return orderId;
    }

    public double getPrice() {
        return price;
    }

    public long getQuantity() {
        return quantity;
    }

    public OrderSide getSide() {
        return side;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void reduceQuantity(long qty) {
        if (qty <= 0) {
            throw new IllegalArgumentException("Quantity to reduce must be positive");
        }
        if (qty > quantity) {
            throw new IllegalArgumentException("Cannot reduce more than available quantity");
        }
        
        this.quantity -= qty;
        
        if (this.quantity == 0) {
            this.status = OrderStatus.FILLED;
        } else if (this.status == OrderStatus.NEW) {
            this.status = OrderStatus.PARTIALLY_FILLED;
        }
    }

    public boolean isFilled() {
        return status == OrderStatus.FILLED;
    }

    @Override
    public String toString() {
        return String.format("Order{id='%s', price=%.2f, quantity=%d, side=%s, status=%s, timestamp=%d}",
                orderId, price, quantity, side, status, timestamp);
    }
}
