package com.tradingengine.demo;

import com.tradingengine.engine.MatchingEngine;
import com.tradingengine.model.CryptoAsset;
import com.tradingengine.model.Order;
import com.tradingengine.notifications.TradeHistoryLogger;
import com.tradingengine.strategy.FIFOMatchingStrategy;
import com.tradingengine.strategy.MatchingStrategy;

public class Main {
    public static void main(String[] args) {
        // 1. Create CryptoAsset (BTC)
        CryptoAsset btc = new CryptoAsset("BTC-USD", "Bitcoin", "0x0000000000000000000000000000000000000000");
        System.out.println("Initialized Crypto Asset: " + btc.getSymbol() + " on blockchain: " + btc.getBlockchain());

        // 2. Create MatchingEngine with FIFO strategy
        MatchingStrategy fifoStrategy = new FIFOMatchingStrategy();
        MatchingEngine engine = new MatchingEngine(fifoStrategy);

        // 3. Register TradeHistoryLogger (Observer)
        TradeHistoryLogger logger = new TradeHistoryLogger();
        engine.addListener(logger);

        // Pre-populate Order Book with some resting SELL orders
        System.out.println("\n--- Placing Resting Orders ---");
        Order sellOrder1 = new Order("O-101", btc.getSymbol(), false, 50000.0, 2);
        Order sellOrder2 = new Order("O-102", btc.getSymbol(), false, 50500.0, 3);
        engine.processOrder(sellOrder1);
        engine.processOrder(sellOrder2);

        // 4. Place a BUY order that crosses the spread Let's say we buy 1 BTC at 50500.0
        // This should match with the first resting sell order (O-101) at 50000.0 since it has the best price
        System.out.println("\n--- Placing BUY Order 1 ---");
        Order incomingBuy1 = new Order("O-103", btc.getSymbol(), true, 50500.0, 1);
        engine.processOrder(incomingBuy1);

        // 5. Place another BUY order to match the remaining quantity of O-101 and eat into O-102
        System.out.println("\n--- Placing BUY Order 2 ---");
        Order incomingBuy2 = new Order("O-104", btc.getSymbol(), true, 51000.0, 2);
        engine.processOrder(incomingBuy2);

        // Show final output just to indicate script completion
        System.out.println("\n--- Demo Completed ---");
    }
}
