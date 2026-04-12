package com.tradingengine.notifications;

import com.tradingengine.model.TradeExecution;

public interface MarketDataListener {
    void onTrade(TradeExecution trade);
    void onPriceUpdate(String symbol, double price);
}
