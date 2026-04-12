package com.trading.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Order Entity - JPA Model
 * 
 * Represents a trading order in the FIFO matching system
 */
@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_asset", columnList = "asset"),
    @Index(name = "idx_side", columnList = "side"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_price_time", columnList = "price, timestamp"),
    @Index(name = "idx_asset_side_status", columnList = "asset, side, status")
})
public class Order {
    
    @Id
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;
    
    @Column(name = "asset", nullable = false)
    private String asset;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "side", nullable = false)
    private OrderSide side;
    
    @Column(name = "price", precision = 20, scale = 8)
    private BigDecimal price; // null for market orders
    
    @Column(name = "quantity", precision = 20, scale = 8, nullable = false)
    private BigDecimal quantity;
    
    @Column(name = "remaining_quantity", precision = 20, scale = 8, nullable = false)
    private BigDecimal remainingQuantity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status;
    
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;
    
    // Constructors
    public Order() {
        this.id = UUID.randomUUID();
        this.timestamp = Instant.now();
        this.status = OrderStatus.NEW;
    }
    
    public Order(String asset, OrderSide side, BigDecimal price, BigDecimal quantity) {
        this();
        this.asset = asset;
        this.side = side;
        this.price = price;
        this.quantity = quantity;
        this.remainingQuantity = quantity;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getAsset() {
        return asset;
    }
    
    public void setAsset(String asset) {
        this.asset = asset;
    }
    
    public OrderSide getSide() {
        return side;
    }
    
    public void setSide(OrderSide side) {
        this.side = side;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getQuantity() {
        return quantity;
    }
    
    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }
    
    public BigDecimal getRemainingQuantity() {
        return remainingQuantity;
    }
    
    public void setRemainingQuantity(BigDecimal remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }
    
    public OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(OrderStatus status) {
        this.status = status;
    }
    
    public Instant getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
    
    // Business methods
    public void fillQuantity(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Fill amount must be positive");
        }
        
        if (amount.compareTo(remainingQuantity) > 0) {
            throw new IllegalArgumentException("Cannot fill more than remaining quantity");
        }
        
        this.remainingQuantity = remainingQuantity.subtract(amount);
        
        if (this.remainingQuantity.compareTo(BigDecimal.ZERO) == 0) {
            this.status = OrderStatus.FILLED;
        } else {
            this.status = OrderStatus.PARTIALLY_FILLED;
        }
    }
    
    public boolean isFilled() {
        return remainingQuantity.compareTo(BigDecimal.ZERO) == 0;
    }
    
    public boolean isPartiallyFilled() {
        return remainingQuantity.compareTo(BigDecimal.ZERO) > 0 && 
               remainingQuantity.compareTo(quantity) < 0;
    }
    
    public boolean canMatch(Order otherOrder) {
        if (this.side == otherOrder.getSide()) {
            return false; // Same side cannot match
        }
        
        if (this.price == null || otherOrder.getPrice() == null) {
            return true; // Market order matches any price
        }
        
        if (this.side == OrderSide.BUY) {
            return this.price.compareTo(otherOrder.getPrice()) >= 0;
        } else {
            return this.price.compareTo(otherOrder.getPrice()) <= 0;
        }
    }
    
    @PrePersist
    public void prePersist() {
        if (this.timestamp == null) {
            this.timestamp = Instant.now();
        }
    }
}
