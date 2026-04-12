package com.exchange.service;

import com.exchange.domain.OrderSide;
import com.exchange.domain.OrderStatus;
import com.exchange.domain.entity.OrderEntity;
import com.exchange.domain.entity.TradeEntity;
import com.exchange.repository.OrderRepository;
import com.exchange.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Order Book Service - Database Layer
 * 
 * Manages order book persistence and retrieval
 * Supports FIFO matching with database optimization
 */
@Service
@Transactional
public class OrderBookService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private TradeRepository tradeRepository;
    
    /**
     * Save a new order to the database
     */
    public OrderEntity saveOrder(OrderEntity order) {
        return orderRepository.save(order);
    }
    
    /**
     * Update order status and quantities
     */
    public OrderEntity updateOrder(OrderEntity order) {
        return orderRepository.save(order);
    }
    
    /**
     * Get active orders for FIFO matching
     */
    public List<OrderEntity> getActiveOrders(String pairId, OrderSide side) {
        return orderRepository.findByPairIdAndSideAndStatusIn(
            pairId, 
            side, 
            List.of(OrderStatus.NEW, OrderStatus.PARTIALLY_FILLED)
        );
    }
    
    /**
     * Get best bid orders (highest price, oldest first)
     */
    public List<OrderEntity> getBestBids(String pairId) {
        return orderRepository.findBestBids(pairId, List.of(OrderStatus.NEW, OrderStatus.PARTIALLY_FILLED));
    }
    
    /**
     * Get best ask orders (lowest price, oldest first)
     */
    public List<OrderEntity> getBestAsks(String pairId) {
        return orderRepository.findBestAsks(pairId, List.of(OrderStatus.NEW, OrderStatus.PARTIALLY_FILLED));
    }
    
    /**
     * Find matching orders for FIFO algorithm
     */
    public List<OrderEntity> findMatchingOrders(String pairId, OrderSide orderSide, 
                                             BigDecimal price, BigDecimal minPrice, BigDecimal maxPrice) {
        OrderSide oppositeSide = orderSide == OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;
        
        return orderRepository.findMatchableOrders(
            pairId, 
            orderSide.toString(), 
            oppositeSide.toString(), 
            price, 
            minPrice, 
            maxPrice
        );
    }
    
    /**
     * Get order book depth
     */
    public List<Object[]> getOrderBookDepth(String pairId) {
        return orderRepository.getOrderBookDepth(pairId);
    }
    
    /**
     * Save a trade execution
     */
    public TradeEntity saveTrade(TradeEntity trade) {
        return tradeRepository.save(trade);
    }
    
    /**
     * Get trade history for a pair
     */
    public List<TradeEntity> getTradeHistory(String pairId, int limit) {
        return tradeRepository.findTop100ByPairIdOrderByCreatedAtDesc(pairId);
    }
    
    /**
     * Get user's order history
     */
    public List<OrderEntity> getUserOrderHistory(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Get user's trade history
     */
    public List<TradeEntity> getUserTradeHistory(String userId) {
        return tradeRepository.findByUserId(userId);
    }
    
    /**
     * Get order book statistics
     */
    public Object[] getOrderBookStatistics(String pairId) {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        return orderRepository.getPairStatistics(pairId, since);
    }
    
    /**
     * Get trade statistics
     */
    public Object[] getTradeStatistics(String pairId) {
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        return tradeRepository.getTradeStatistics(pairId, since);
    }
    
    /**
     * Cancel an order
     */
    public boolean cancelOrder(String orderId) {
        OrderEntity order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return false;
        }
        
        // Only allow cancellation of unfilled orders
        if (order.getStatus() == OrderStatus.FILLED) {
            return false;
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        return true;
    }
    
    /**
     * Batch update order statuses
     */
    public int updateOrderStatuses(List<String> orderIds, OrderStatus status) {
        return orderRepository.updateStatusByIds(status, orderIds);
    }
    
    /**
     * Clean up old filled orders
     */
    @Transactional
    public int cleanupOldFilledOrders(int hoursOld) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(hoursOld);
        List<OrderEntity> oldOrders = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.FILLED, cutoff);
        
        // Archive old orders (could move to archive table)
        for (OrderEntity order : oldOrders) {
            // In a real system, you might move to an archive table
            // For now, we'll just keep them but could implement archiving
        }
        
        return oldOrders.size();
    }
    
    /**
     * Get order book snapshot for historical analysis
     */
    public void saveOrderBookSnapshot(String pairId) {
        List<Object[]> depth = getOrderBookDepth(pairId);
        
        // Save to order_book_snapshots table
        // This would be implemented with a separate repository
        // For now, this is a placeholder for the concept
    }
    
    /**
     * Validate order before placing
     */
    public boolean validateOrder(OrderEntity order) {
        // Check if order has valid data
        if (order.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        
        if (order.getType() == com.exchange.domain.OrderType.LIMIT && 
            (order.getPrice() == null || order.getPrice().compareTo(BigDecimal.ZERO) <= 0)) {
            return false;
        }
        
        // Additional validation logic could be added here
        return true;
    }
    
    /**
     * Get market data for a pair
     */
    public MarketData getMarketData(String pairId) {
        Object[] orderStats = getOrderBookStatistics(pairId);
        Object[] tradeStats = getTradeStatistics(pairId);
        
        List<OrderEntity> bestBids = getBestBids(pairId);
        List<OrderEntity> bestAsks = getBestAsks(pairId);
        
        BigDecimal bestBid = bestBids.isEmpty() ? null : bestBids.get(0).getPrice();
        BigDecimal bestAsk = bestAsks.isEmpty() ? null : bestAsks.get(0).getPrice();
        
        BigDecimal spread = (bestBid != null && bestAsk != null) ? bestAsk.subtract(bestBid) : null;
        
        return new MarketData(
            pairId,
            bestBid,
            bestAsk,
            spread,
            tradeStats != null ? (BigDecimal) tradeStats[1] : BigDecimal.ZERO, // volume
            tradeStats != null ? (BigDecimal) tradeStats[2] : BigDecimal.ZERO  // avg price
        );
    }
    
    /**
     * Market data holder class
     */
    public static class MarketData {
        private final String pairId;
        private final BigDecimal bestBid;
        private final BigDecimal bestAsk;
        private final BigDecimal spread;
        private final BigDecimal volume24h;
        private final BigDecimal avgPrice24h;
        
        public MarketData(String pairId, BigDecimal bestBid, BigDecimal bestAsk, 
                         BigDecimal spread, BigDecimal volume24h, BigDecimal avgPrice24h) {
            this.pairId = pairId;
            this.bestBid = bestBid;
            this.bestAsk = bestAsk;
            this.spread = spread;
            this.volume24h = volume24h;
            this.avgPrice24h = avgPrice24h;
        }
        
        // Getters
        public String getPairId() { return pairId; }
        public BigDecimal getBestBid() { return bestBid; }
        public BigDecimal getBestAsk() { return bestAsk; }
        public BigDecimal getSpread() { return spread; }
        public BigDecimal getVolume24h() { return volume24h; }
        public BigDecimal getAvgPrice24h() { return avgPrice24h; }
    }
}
