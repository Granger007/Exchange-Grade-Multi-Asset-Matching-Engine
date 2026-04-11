package com.tradingengine.strategy;

import com.tradingengine.model.Order;
import com.tradingengine.model.TradeExecution;
import java.util.List;

public interface MatchingStrategy {
    List<TradeExecution> match(Order newOrder, List<Order> buyOrders, List<Order> sellOrders);
}
