package com.tradingengine.model;

public class Order {
    private String orderId;
    private String symbol;
    private boolean isBuy;
    private double price;
    private int quantity;

    public Order(String orderId, String symbol, boolean isBuy, double price, int quantity) {
        this.orderId = orderId;
        this.symbol = symbol;
        this.isBuy = isBuy;
        this.price = price;
        this.quantity = quantity;
    }

    public String getOrderId() { return orderId; }
    public String getSymbol() { return symbol; }
    public boolean isBuy() { return isBuy; }
    public double getPrice() { return price; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
