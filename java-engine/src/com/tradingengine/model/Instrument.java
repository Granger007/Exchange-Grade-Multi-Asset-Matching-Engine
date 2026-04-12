package com.tradingengine.model;

public abstract class Instrument {
    protected String symbol;

    public Instrument(String symbol) {
        this.symbol = symbol;
    }

    public String getSymbol() {
        return symbol;
    }
}
