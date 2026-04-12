-- FIFO Order Matching System Database Schema
-- Supports multi-asset trading with proper indexing for performance

-- Database: trading_system

-- Orders Table (Core FIFO Matching)
CREATE TABLE orders (
    id BINARY(16) PRIMARY KEY, -- UUID
    asset VARCHAR(50) NOT NULL,
    side ENUM('BUY', 'SELL') NOT NULL,
    price DECIMAL(20, 8), -- NULL for market orders
    quantity DECIMAL(20, 8) NOT NULL,
    remaining_quantity DECIMAL(20, 8) NOT NULL,
    status ENUM('NEW', 'PARTIALLY_FILLED', 'FILLED', 'CANCELLED') DEFAULT 'NEW',
    timestamp TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_asset (asset),
    INDEX idx_side (side),
    INDEX idx_status (status),
    INDEX idx_price_time (price, timestamp),
    INDEX idx_asset_side_status (asset, side, status)
);

-- Trades Table
CREATE TABLE trades (
    id BINARY(16) PRIMARY KEY, -- UUID
    buy_order_id BINARY(16) NOT NULL,
    sell_order_id BINARY(16) NOT NULL,
    asset VARCHAR(50) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    quantity DECIMAL(20, 8) NOT NULL,
    timestamp TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6),
    INDEX idx_buy_order (buy_order_id),
    INDEX idx_sell_order (sell_order_id),
    INDEX idx_asset (asset),
    INDEX idx_timestamp (timestamp)
);

-- Insert sample data for testing
INSERT INTO orders (id, asset, side, price, quantity, remaining_quantity, status, timestamp) VALUES
(UUID_TO_BIN(UUID()), 'BTC/USDT', 'BUY', 64000.00, 1.5, 1.5, 'NEW', NOW(6)),
(UUID_TO_BIN(UUID()), 'BTC/USDT', 'SELL', 64100.00, 0.8, 0.8, 'NEW', NOW(6)),
(UUID_TO_BIN(UUID()), 'ETH/USDT', 'BUY', 3450.00, 10.0, 10.0, 'NEW', NOW(6)),
(UUID_TO_BIN(UUID()), 'ETH/USDT', 'SELL', 3460.00, 5.0, 5.0, 'NEW', NOW(6));

-- Create views for common queries
CREATE VIEW order_book_depth AS
SELECT 
    asset,
    side,
    price,
    SUM(remaining_quantity) as total_quantity,
    COUNT(*) as order_count
FROM orders 
WHERE status IN ('NEW', 'PARTIALLY_FILLED')
GROUP BY asset, side, price
ORDER BY 
    CASE WHEN side = 'BUY' THEN price END DESC,
    CASE WHEN side = 'SELL' THEN price END ASC;
