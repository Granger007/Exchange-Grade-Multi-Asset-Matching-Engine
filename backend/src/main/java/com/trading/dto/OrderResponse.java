package com.trading.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Order Response DTO
 * 
 * Represents the response payload for order operations
 */
public class OrderResponse {
    
    private UUID orderId;
    private String asset;
    private String side;
    private String type;
    private BigDecimal price;
    private BigDecimal quantity;
    private BigDecimal filledQuantity;
    private BigDecimal remainingQuantity;
    private String status;
    private Instant timestamp;
    private List<TradeResponse> trades;
    
    // Constructors
    public OrderResponse() {}
    
    // Getters and Setters
    public UUID getOrderId() {
        return orderId;
    }
    
    public void setOrderId(UUID orderId) {
        this.orderId = orderId;
    }
    
    public String getAsset() {
        return asset;
    }
    
    public void setAsset(String asset) {
        this.asset = asset;
    }
    
    public String getSide() {
        return side;
    }
    
    public void setSide(String side) {
        this.side = side;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
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
        return remainingQuantity;
    }
    
    public void setRemainingQuantity(BigDecimal remainingQuantity) {
        this.remainingQuantity = remainingQuantity;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Instant getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
    
    public List<TradeResponse> getTrades() {
        return trades;
    }
    
    public void setTrades(List<TradeResponse> trades) {
        this.trades = trades;
    }
    
    /**
     * Trade Response DTO (nested class)
     */
    public static class TradeResponse {
        private UUID id;
        private UUID buyOrderId;
        private UUID sellOrderId;
        private BigDecimal price;
        private BigDecimal quantity;
        private Instant timestamp;
        
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
    }
}
