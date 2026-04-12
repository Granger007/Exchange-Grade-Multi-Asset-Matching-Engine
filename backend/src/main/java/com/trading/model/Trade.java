package com.trading.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Trade Entity - JPA Model
 * 
 * Represents a trade execution from order matching
 */
@Entity
@Table(name = "trades", indexes = {
    @Index(name = "idx_buy_order", columnList = "buy_order_id"),
    @Index(name = "idx_sell_order", columnList = "sell_order_id"),
    @Index(name = "idx_asset", columnList = "asset"),
    @Index(name = "idx_timestamp", columnList = "timestamp")
})
public class Trade {
    
    @Id
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;
    
    @Column(name = "buy_order_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID buyOrderId;
    
    @Column(name = "sell_order_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID sellOrderId;
    
    @Column(name = "asset", nullable = false)
    private String asset;
    
    @Column(name = "price", precision = 20, scale = 8, nullable = false)
    private BigDecimal price;
    
    @Column(name = "quantity", precision = 20, scale = 8, nullable = false)
    private BigDecimal quantity;
    
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;
    
    // Constructors
    public Trade() {
        this.id = UUID.randomUUID();
        this.timestamp = Instant.now();
    }
    
    public Trade(UUID buyOrderId, UUID sellOrderId, String asset, BigDecimal price, BigDecimal quantity) {
        this();
        this.buyOrderId = buyOrderId;
        this.sellOrderId = sellOrderId;
        this.asset = asset;
        this.price = price;
        this.quantity = quantity;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public UUID getBuyOrderId() {
        return buyOrderId;
    }
    
    public void setBuyOrderId(UUID buyOrderId) {
        this.buyOrderId = buyOrderId;
    }
    
    public UUID getSellOrderId() {
        return sellOrderId;
    }
    
    public void setSellOrderId(UUID sellOrderId) {
        this.sellOrderId = sellOrderId;
    }
    
    public String getAsset() {
        return asset;
    }
    
    public void setAsset(String asset) {
        this.asset = asset;
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
    
    public Instant getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
    
    // Business methods
    public BigDecimal getTotalAmount() {
        return price.multiply(quantity);
    }
    
    @PrePersist
    public void prePersist() {
        if (this.timestamp == null) {
            this.timestamp = Instant.now();
        }
    }
}
