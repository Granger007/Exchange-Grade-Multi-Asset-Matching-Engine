package com.tradingengine.engine;

import com.tradingengine.model.Order;
import com.tradingengine.model.TradeExecution;
import com.tradingengine.notifications.MarketDataListener;
import com.tradingengine.strategy.MatchingStrategy;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MatchingEngine {
    private MatchingStrategy strategy;
    private Map<String, OrderBook> orderBooks = new HashMap<>();
    private List<MarketDataListener> listeners = new ArrayList<>();

    public MatchingEngine(MatchingStrategy strategy) {
        this.strategy = strategy;
    }

    public void addListener(MarketDataListener listener) {
        listeners.add(listener);
    }

    // Process a new incoming order
    public void processOrder(Order order) {
        orderBooks.putIfAbsent(order.getSymbol(), new OrderBook(order.getSymbol()));
        OrderBook book = orderBooks.get(order.getSymbol());

        // Delegate matching to the matching strategy
        List<TradeExecution> trades = strategy.match(order, book.getBuyOrders(), book.getSellOrders());

        // If trades were generated, trigger notifications
        if (trades != null && !trades.isEmpty()) {
            for (TradeExecution trade : trades) {
                notifyTrade(trade);
                notifyPriceUpdate(trade.symbol, trade.price);
            }
        }

        // Add any remaining quantity to the order book
        if (order.getQuantity() > 0) {
            if (order.isBuy()) {
                book.addBuyOrder(order);
            } else {
                book.addSellOrder(order);
            }
        }
    }

    private void notifyTrade(TradeExecution trade) {
        for (MarketDataListener listener : listeners) {
            listener.onTrade(trade);
        }
    }

    private void notifyPriceUpdate(String symbol, double price) {
        for (MarketDataListener listener : listeners) {
            listener.onPriceUpdate(symbol, price);
        }
    }
}
