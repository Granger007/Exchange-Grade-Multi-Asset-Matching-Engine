package com.tradingengine.notifications;

import com.tradingengine.model.TradeExecution;
import java.util.ArrayList;
import java.util.List;

public class TradeHistoryLogger implements MarketDataListener {
    private List<TradeExecution> tradeHistory = new ArrayList<>();

    @Override
    public void onTrade(TradeExecution trade) {
        tradeHistory.add(trade);
        System.out.println("[LOG - TRADE EXECUTED] " + trade);
    }

    @Override
    public void onPriceUpdate(String symbol, double price) {
        System.out.println("[LOG - PRICE UPDATE] " + symbol + " updated to " + price);
    }
    
    public List<TradeExecution> getTradeHistory() {
        return tradeHistory;
    }
}
