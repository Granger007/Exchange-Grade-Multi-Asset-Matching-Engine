package com.exchange.strategy;

import com.exchange.domain.Order;
import com.exchange.domain.OrderBook;
import com.exchange.domain.TradeExecution;
import com.exchange.domain.OrderSide;

import java.util.ArrayList;
import java.util.List;
import java.util.Queue;
import java.util.UUID;
import java.util.TreeMap;

public class FIFOMatching implements MatchingStrategy {

    @Override
    public List<TradeExecution> match(Order incomingOrder, OrderBook orderBook) {
        List<TradeExecution> executions = new ArrayList<>();
        
        if (incomingOrder.isFilled()) {
            return executions;
        }

        TreeMap<Double, Queue<Order>> oppositeSide = orderBook.getOppositeSide(incomingOrder.getSide());
        
        while (incomingOrder.getQuantity() > 0 && !oppositeSide.isEmpty()) {
            boolean canMatch = false;
            
            if (incomingOrder.getSide() == OrderSide.BUY) {
                Double bestAskPrice = oppositeSide.firstKey();
                if (bestAskPrice != null && bestAskPrice <= incomingOrder.getPrice()) {
                    canMatch = true;
                    executions.addAll(matchAtPriceLevel(incomingOrder, oppositeSide, bestAskPrice));
                }
            } else {
                Double bestBidPrice = oppositeSide.firstKey();
                if (bestBidPrice != null && bestBidPrice >= incomingOrder.getPrice()) {
                    canMatch = true;
                    executions.addAll(matchAtPriceLevel(incomingOrder, oppositeSide, bestBidPrice));
                }
            }
            
            if (!canMatch) {
                break;
            }
        }
        
        return executions;
    }

    private List<TradeExecution> matchAtPriceLevel(Order incomingOrder, TreeMap<Double, Queue<Order>> oppositeSide, double price) {
        List<TradeExecution> executions = new ArrayList<>();
        Queue<Order> ordersAtPrice = oppositeSide.get(price);
        
        if (ordersAtPrice == null || ordersAtPrice.isEmpty()) {
            oppositeSide.remove(price);
            return executions;
        }

        while (incomingOrder.getQuantity() > 0 && !ordersAtPrice.isEmpty()) {
            Order restingOrder = ordersAtPrice.peek();
            
            if (restingOrder == null || restingOrder.isFilled()) {
                ordersAtPrice.poll();
                continue;
            }

            long matchQuantity = Math.min(incomingOrder.getQuantity(), restingOrder.getQuantity());
            double executionPrice = price;
            long timestamp = System.currentTimeMillis();

            TradeExecution execution = createExecution(incomingOrder, restingOrder, executionPrice, matchQuantity, timestamp);
            executions.add(execution);

            incomingOrder.reduceQuantity(matchQuantity);
            restingOrder.reduceQuantity(matchQuantity);

            if (restingOrder.isFilled()) {
                ordersAtPrice.poll();
            }
        }

        if (ordersAtPrice.isEmpty()) {
            oppositeSide.remove(price);
        }

        return executions;
    }

    private TradeExecution createExecution(Order incomingOrder, Order restingOrder, double price, long quantity, long timestamp) {
        String buyOrderId = incomingOrder.getSide() == OrderSide.BUY ? incomingOrder.getOrderId() : restingOrder.getOrderId();
        String sellOrderId = incomingOrder.getSide() == OrderSide.SELL ? incomingOrder.getOrderId() : restingOrder.getOrderId();
        String tradeId = UUID.randomUUID().toString();
        
        return new TradeExecution(tradeId, buyOrderId, sellOrderId, price, quantity, timestamp);
    }
}
