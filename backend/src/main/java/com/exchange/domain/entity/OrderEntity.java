package com.exchange.domain.entity;

import com.exchange.domain.OrderSide;
import com.exchange.domain.OrderStatus;
import com.exchange.domain.OrderType;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Order Entity - Database Representation
 * 
 * JPA entity for persisting orders in the database
 * Supports FIFO matching with proper indexing
 */
@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_pair_id", columnList = "pair_id"),
    @Index(name = "idx_side", columnList = "side"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_pair_side_status", columnList = "pair_id, side, status"),
    @Index(name = "idx_price_time", columnList = "price, created_at"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class OrderEntity {
    
    @Id
    @Column(name = "id", length = 50)
    private String id;
    
    @Column(name = "user_id", length = 50, nullable = false)
    private String userId;
    
    @Column(name = "pair_id", length = 50, nullable = false)
    private String pairId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "side", nullable = false)
    private OrderSide side;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private OrderType type;
    
    @Column(name = "price", precision = 20, scale = 8)
    private BigDecimal price; // null for market orders
    
    @Column(name = "quantity", precision = 20, scale = 8, nullable = false)
    private BigDecimal quantity;
    
    @Column(name = "filled_quantity", precision = 20, scale = 8)
    private BigDecimal filledQuantity = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status = OrderStatus.NEW;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public OrderEntity() {}
    
    public OrderEntity(String id, String userId, String pairId, OrderSide side, 
                      OrderType type, BigDecimal price, BigDecimal quantity) {
        this.id = id;
        this.userId = userId;
        this.pairId = pairId;
        this.side = side;
        this.type = type;
        this.price = price;
        this.quantity = quantity;
        this.filledQuantity = BigDecimal.ZERO;
        this.status = OrderStatus.NEW;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getPairId() {
        return pairId;
    }
    
    public void setPairId(String pairId) {
        this.pairId = pairId;
    }
    
    public OrderSide getSide() {
        return side;
    }
    
    public void setSide(OrderSide side) {
        this.side = side;
    }
    
    public OrderType getType() {
        return type;
    }
    
    public void setType(OrderType type) {
        this.type = type;
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
    
    public BigDecimal getFilledQuantity() {
        return filledQuantity;
    }
    
    public void setFilledQuantity(BigDecimal filledQuantity) {
        this.filledQuantity = filledQuantity;
    }
    
    public BigDecimal getRemainingQuantity() {
        return quantity.subtract(filledQuantity);
    }
    
    public OrderStatus getStatus() {
        return status;
    }
    
    public void setStatus(OrderStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Business methods
    public void fillQuantity(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Fill amount must be positive");
        }
        
        if (amount.compareTo(getRemainingQuantity()) > 0) {
            throw new IllegalArgumentException("Cannot fill more than remaining quantity");
        }
        
        this.filledQuantity = this.filledQuantity.add(amount);
        this.updatedAt = LocalDateTime.now();
        
        // Update status
        if (getRemainingQuantity().compareTo(BigDecimal.ZERO) == 0) {
            this.status = OrderStatus.FILLED;
        } else if (this.filledQuantity.compareTo(BigDecimal.ZERO) > 0) {
            this.status = OrderStatus.PARTIALLY_FILLED;
        }
    }
    
    public boolean isFilled() {
        return getRemainingQuantity().compareTo(BigDecimal.ZERO) == 0;
    }
    
    public boolean isPartiallyFilled() {
        return filledQuantity.compareTo(BigDecimal.ZERO) > 0 && !isFilled();
    }
    
    public boolean canMatch(OrderEntity otherOrder) {
        if (this.side == otherOrder.getSide()) {
            return false; // Same side cannot match
        }
        
        if (this.price == null || otherOrder.getPrice() == null) {
            // Market order logic
            return true;
        }
        
        if (this.side == OrderSide.BUY) {
            return this.price.compareTo(otherOrder.getPrice()) >= 0;
        } else {
            return this.price.compareTo(otherOrder.getPrice()) <= 0;
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
    }
}
