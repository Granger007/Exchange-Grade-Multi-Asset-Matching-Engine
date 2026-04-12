package com.exchange.engine;

import com.exchange.domain.Order;
import com.exchange.domain.OrderBook;
import com.exchange.domain.TradeExecution;
import com.exchange.strategy.MatchingStrategy;

import java.util.List;

public class MatchingEngine {
    private final OrderBook orderBook;
    private final MatchingStrategy matchingStrategy;

    public MatchingEngine(OrderBook orderBook, MatchingStrategy matchingStrategy) {
        this.orderBook = orderBook;
        this.matchingStrategy = matchingStrategy;
    }

    public List<TradeExecution> processOrder(Order order) {
        List<TradeExecution> executions = matchingStrategy.match(order, orderBook);
        
        if (!order.isFilled()) {
            orderBook.addOrder(order);
        }
        
        return executions;
    }

    public OrderBook getOrderBook() {
        return orderBook;
    }

    public MatchingStrategy getMatchingStrategy() {
        return matchingStrategy;
    }
}
