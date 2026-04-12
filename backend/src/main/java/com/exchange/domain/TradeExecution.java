package com.exchange.domain;

public class TradeExecution {
    private final String buyOrderId;
    private final String sellOrderId;
    private final double price;
    private final long quantity;
    private final long timestamp;

    public TradeExecution(String buyOrderId, String sellOrderId, double price, long quantity, long timestamp) {
        this.buyOrderId = buyOrderId;
        this.sellOrderId = sellOrderId;
        this.price = price;
        this.quantity = quantity;
        this.timestamp = timestamp;
    }

    public String getBuyOrderId() {
        return buyOrderId;
    }

    public String getSellOrderId() {
        return sellOrderId;
    }

    public double getPrice() {
        return price;
    }

    public long getQuantity() {
        return quantity;
    }

    public long getTimestamp() {
        return timestamp;
    }

    @Override
    public String toString() {
        return String.format("TradeExecution{buyOrderId='%s', sellOrderId='%s', price=%.2f, quantity=%d, timestamp=%d}",
                buyOrderId, sellOrderId, price, quantity, timestamp);
    }
}
