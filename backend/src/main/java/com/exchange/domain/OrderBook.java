package com.exchange.domain;

import java.util.Queue;
import java.util.TreeMap;
import java.util.LinkedList;

public class OrderBook {
    private final TreeMap<Double, Queue<Order>> bids;
    private final TreeMap<Double, Queue<Order>> asks;

    public OrderBook() {
        this.bids = new TreeMap<>((a, b) -> Double.compare(b, a));
        this.asks = new TreeMap<>();
    }

    public void addOrder(Order order) {
        TreeMap<Double, Queue<Order>> book = order.getSide() == OrderSide.BUY ? bids : asks;
        
        book.computeIfAbsent(order.getPrice(), k -> new LinkedList<>()).add(order);
    }

    public Order getBestBid() {
        if (bids.isEmpty()) {
            return null;
        }
        Queue<Order> bestBidOrders = bids.firstEntry().getValue();
        return bestBidOrders.isEmpty() ? null : bestBidOrders.peek();
    }

    public Order getBestAsk() {
        if (asks.isEmpty()) {
            return null;
        }
        Queue<Order> bestAskOrders = asks.firstEntry().getValue();
        return bestAskOrders.isEmpty() ? null : bestAskOrders.peek();
    }

    public TreeMap<Double, Queue<Order>> getOppositeSide(OrderSide side) {
        return side == OrderSide.BUY ? asks : bids;
    }

    public TreeMap<Double, Queue<Order>> getBids() {
        return bids;
    }

    public TreeMap<Double, Queue<Order>> getAsks() {
        return asks;
    }

    public void removeOrder(Order order) {
        TreeMap<Double, Queue<Order>> book = order.getSide() == OrderSide.BUY ? bids : asks;
        Queue<Order> ordersAtPrice = book.get(order.getPrice());
        
        if (ordersAtPrice != null) {
            ordersAtPrice.remove(order);
            if (ordersAtPrice.isEmpty()) {
                book.remove(order.getPrice());
            }
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("OrderBook:\n");
        sb.append("Bids:\n");
        bids.forEach((price, orders) -> {
            sb.append(String.format("  Price: %.2f, Orders: %d\n", price, orders.size()));
        });
        sb.append("Asks:\n");
        asks.forEach((price, orders) -> {
            sb.append(String.format("  Price: %.2f, Orders: %d\n", price, orders.size()));
        });
        return sb.toString();
    }
}
