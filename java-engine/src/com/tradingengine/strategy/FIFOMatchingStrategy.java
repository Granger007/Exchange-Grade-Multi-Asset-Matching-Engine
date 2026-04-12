package com.tradingengine.strategy;

import com.tradingengine.model.Order;
import com.tradingengine.model.TradeExecution;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class FIFOMatchingStrategy implements MatchingStrategy {
    @Override
    public List<TradeExecution> match(Order newOrder, List<Order> buyOrders, List<Order> sellOrders) {
        List<TradeExecution> trades = new ArrayList<>();
        List<Order> oppositeBook = newOrder.isBuy() ? sellOrders : buyOrders;

        for (int i = 0; i < oppositeBook.size(); i++) {
            Order restingOrder = oppositeBook.get(i);
            boolean priceMatch = newOrder.isBuy() ? newOrder.getPrice() >= restingOrder.getPrice()
                                                  : newOrder.getPrice() <= restingOrder.getPrice();

            if (priceMatch && newOrder.getQuantity() > 0) {
                int tradeQty = Math.min(newOrder.getQuantity(), restingOrder.getQuantity());
                double executionPrice = restingOrder.getPrice(); // Price of the resting order determines execution price

                newOrder.setQuantity(newOrder.getQuantity() - tradeQty);
                restingOrder.setQuantity(restingOrder.getQuantity() - tradeQty);

                TradeExecution trade = new TradeExecution(
                        UUID.randomUUID().toString(),
                        newOrder.getSymbol(),
                        executionPrice,
                        tradeQty,
                        System.currentTimeMillis()
                );
                trades.add(trade);

                if (restingOrder.getQuantity() == 0) {
                    oppositeBook.remove(i);
                    i--; // adjust index because element was removed
                }
                
                if (newOrder.getQuantity() == 0) {
                    break;
                }
            }
        }
        return trades;
    }
}
