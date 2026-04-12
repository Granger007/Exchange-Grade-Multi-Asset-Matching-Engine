package com.exchange.domain;

/**
 * Order Type Enum
 * 
 * Defines the type of order (LIMIT, MARKET, etc.)
 * This was missing from the original codebase
 */
public enum OrderType {
    LIMIT,
    MARKET,
    STOP_LOSS,
    TAKE_PROFIT
}
