package com.trading.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * Order Request DTO
 * 
 * Represents the request payload for creating orders
 */
public class OrderRequest {
    
    @NotBlank(message = "Asset is required")
    private String asset;
    
    @NotBlank(message = "Side is required")
    @Pattern(regexp = "BUY|SELL", message = "Side must be BUY or SELL")
    private String side;
    
    @NotBlank(message = "Type is required")
    @Pattern(regexp = "LIMIT|MARKET", message = "Type must be LIMIT or MARKET")
    private String type;
    
    @DecimalMin(value = "0.00000001", message = "Price must be positive")
    @Digits(integer = 12, fraction = 8, message = "Price format invalid")
    private BigDecimal price; // null for market orders
    
    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.00000001", message = "Quantity must be positive")
    @Digits(integer = 12, fraction = 8, message = "Quantity format invalid")
    private BigDecimal quantity;
    
    // Constructors
    public OrderRequest() {}
    
    public OrderRequest(String asset, String side, String type, BigDecimal price, BigDecimal quantity) {
        this.asset = asset;
        this.side = side;
        this.type = type;
        this.price = price;
        this.quantity = quantity;
    }
    
    // Getters and Setters
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
    
    // Validation methods
    public boolean isLimitOrder() {
        return "LIMIT".equalsIgnoreCase(type);
    }
    
    public boolean isValidLimitOrder() {
        return !isLimitOrder() || (price != null && price.compareTo(BigDecimal.ZERO) > 0);
    }
}
