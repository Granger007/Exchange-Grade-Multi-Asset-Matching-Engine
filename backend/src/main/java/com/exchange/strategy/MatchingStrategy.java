package com.exchange.strategy;

import com.exchange.domain.Order;
import com.exchange.domain.OrderBook;
import com.exchange.domain.TradeExecution;

import java.util.List;

public interface MatchingStrategy {
    List<TradeExecution> match(Order incomingOrder, OrderBook orderBook);
}
