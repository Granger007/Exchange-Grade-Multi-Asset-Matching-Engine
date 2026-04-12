package com.tradingengine.engine;

import com.tradingengine.model.Order;
import java.util.LinkedList;
import java.util.List;

public class OrderBook {
    private String symbol;
    private List<Order> buyOrders = new LinkedList<>();
    private List<Order> sellOrders = new LinkedList<>();

    public OrderBook(String symbol) {
        this.symbol = symbol;
    }

    public void addBuyOrder(Order o) {
        buyOrders.add(o);
    }

    public void addSellOrder(Order o) {
        sellOrders.add(o);
    }

    public List<Order> getBuyOrders() {
        return buyOrders;
    }

    public List<Order> getSellOrders() {
        return sellOrders;
    }
}
