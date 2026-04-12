package com.exchange.domain;

import java.util.List;

/**
 * Result of order matching operation
 * Contains all trades generated and orders that were matched
 */
public class MatchingResult {
    private final List<TradeExecution> trades;
    private final Order incomingOrder;
    private final List<Order> matchedOrders;
    
    public MatchingResult(List<TradeExecution> trades, Order incomingOrder, List<Order> matchedOrders) {
        this.trades = trades;
        this.incomingOrder = incomingOrder;
        this.matchedOrders = matchedOrders;
    }
    
    public List<TradeExecution> getTrades() {
        return trades;
    }
    
    public Order getIncomingOrder() {
        return incomingOrder;
    }
    
    public List<Order> getMatchedOrders() {
        return matchedOrders;
    }
}
