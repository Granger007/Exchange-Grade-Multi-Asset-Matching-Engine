package com.tradingengine.model;

public class TradeExecution {
    public final String tradeId;
    public final String symbol;
    public final double price;
    public final int quantity;
    public final long timestamp;

    public TradeExecution(String tradeId, String symbol, double price, int quantity, long timestamp) {
        this.tradeId = tradeId;
        this.symbol = symbol;
        this.price = price;
        this.quantity = quantity;
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "TradeExecution{" +
                "tradeId='" + tradeId + '\'' +
                ", symbol='" + symbol + '\'' +
                ", price=" + price +
                ", quantity=" + quantity +
                ", timestamp=" + timestamp +
                '}';
    }
}
