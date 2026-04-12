package com.exchange.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Trade Entity - Database Representation
 * 
 * JPA entity for persisting trade executions
 * Tracks all matched orders in the FIFO system
 */
@Entity
@Table(name = "trades", indexes = {
    @Index(name = "idx_buy_order", columnList = "buy_order_id"),
    @Index(name = "idx_sell_order", columnList = "sell_order_id"),
    @Index(name = "idx_pair_id", columnList = "pair_id"),
    @Index(name = "idx_price", columnList = "price"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class TradeEntity {
    
    @Id
    @Column(name = "id", length = 50)
    private String id;
    
    @Column(name = "buy_order_id", length = 50, nullable = false)
    private String buyOrderId;
    
    @Column(name = "sell_order_id", length = 50, nullable = false)
    private String sellOrderId;
    
    @Column(name = "pair_id", length = 50, nullable = false)
    private String pairId;
    
    @Column(name = "price", precision = 20, scale = 8, nullable = false)
    private BigDecimal price;
    
    @Column(name = "quantity", precision = 20, scale = 8, nullable = false)
    private BigDecimal quantity;
    
    @Column(name = "buy_fee", precision = 20, scale = 8)
    private BigDecimal buyFee = BigDecimal.ZERO;
    
    @Column(name = "sell_fee", precision = 20, scale = 8)
    private BigDecimal sellFee = BigDecimal.ZERO;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public TradeEntity() {}
    
    public TradeEntity(String id, String buyOrderId, String sellOrderId, String pairId,
                      BigDecimal price, BigDecimal quantity) {
        this.id = id;
        this.buyOrderId = buyOrderId;
        this.sellOrderId = sellOrderId;
        this.pairId = pairId;
        this.price = price;
        this.quantity = quantity;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getBuyOrderId() {
        return buyOrderId;
    }
    
    public void setBuyOrderId(String buyOrderId) {
        this.buyOrderId = buyOrderId;
    }
    
    public String getSellOrderId() {
        return sellOrderId;
    }
    
    public void setSellOrderId(String sellOrderId) {
        this.sellOrderId = sellOrderId;
    }
    
    public String getPairId() {
        return pairId;
    }
    
    public void setPairId(String pairId) {
        this.pairId = pairId;
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
    
    public BigDecimal getBuyFee() {
        return buyFee;
    }
    
    public void setBuyFee(BigDecimal buyFee) {
        this.buyFee = buyFee;
    }
    
    public BigDecimal getSellFee() {
        return sellFee;
    }
    
    public void setSellFee(BigDecimal sellFee) {
        this.sellFee = sellFee;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Business methods
    public BigDecimal getTotalAmount() {
        return price.multiply(quantity);
    }
    
    public void calculateFees(BigDecimal feeRate) {
        BigDecimal totalAmount = getTotalAmount();
        BigDecimal fee = totalAmount.multiply(feeRate);
        this.buyFee = fee;
        this.sellFee = fee;
    }
    
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
