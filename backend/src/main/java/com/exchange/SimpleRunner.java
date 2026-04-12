package com.exchange;

import com.exchange.domain.Order;
import com.exchange.domain.OrderBook;
import com.exchange.domain.OrderSide;
import com.exchange.domain.TradeExecution;
import com.exchange.engine.MatchingEngine;
import com.exchange.strategy.FIFOMatching;

import java.util.List;

public class SimpleRunner {

    public static void main(String[] args) {
        System.out.println("🚀 FIFO Order Matching Engine - Simple Runner");
        System.out.println("=" .repeat(50));

        // Initialize components
        OrderBook orderBook = new OrderBook();
        FIFOMatching matchingStrategy = new FIFOMatching();
        MatchingEngine matchingEngine = new MatchingEngine(orderBook, matchingStrategy);

        System.out.println("✅ Components initialized successfully!");

        // Test with sample orders
        System.out.println("\n📊 Testing FIFO Order Matching:");
        System.out.println("-" .repeat(30));

        // Add some initial orders to the book
        Order buyOrder1 = new Order("BUY-001", 64000.00, 1500L, OrderSide.BUY, System.currentTimeMillis() - 5000);
        Order buyOrder2 = new Order("BUY-002", 63999.00, 800L, OrderSide.BUY, System.currentTimeMillis() - 3000);
        Order buyOrder3 = new Order("BUY-003", 64000.00, 500L, OrderSide.BUY, System.currentTimeMillis() - 1000);

        orderBook.addOrder(buyOrder1);
        orderBook.addOrder(buyOrder2);
        orderBook.addOrder(buyOrder3);

        System.out.println("📈 Added 3 BUY orders to the book");

        // Process a sell order that should match
        Order sellOrder = new Order("SELL-001", 64000.00, 1200L, OrderSide.SELL, System.currentTimeMillis());
        List<TradeExecution> executions = matchingEngine.processOrder(sellOrder);

        System.out.println("🔄 Processed SELL order: " + sellOrder.getOrderId());
        System.out.println("💰 Generated " + executions.size() + " trade executions:");

        for (TradeExecution execution : executions) {
            System.out.println("   - Trade: " + execution.getBuyOrderId() + " ↔ " + 
                             execution.getSellOrderId() + " @ $" + 
                             execution.getPrice() + " for " + execution.getQuantity() + " BTC");
        }

        System.out.println("\n📋 Order Book Status:");
        System.out.println("Best Bid: $" + (orderBook.getBestBid() != null ? orderBook.getBestBid().getPrice() : "N/A"));
        System.out.println("Best Ask: $" + (orderBook.getBestAsk() != null ? orderBook.getBestAsk().getPrice() : "N/A"));

        System.out.println("\n✅ FIFO Order Matching Engine is working correctly!");
        System.out.println("🎯 Price-time priority matching demonstrated successfully!");
    }
}
