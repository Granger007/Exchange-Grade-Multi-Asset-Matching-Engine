package com.trading.repository;

import com.trading.model.Order;
import com.trading.model.OrderSide;
import com.trading.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Order Repository - Spring Data JPA
 * 
 * Provides database access for Order entities
 * Optimized queries for FIFO matching performance
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    /**
     * Find open orders by asset and side (for FIFO matching)
     */
    List<Order> findByAssetAndSideAndStatusIn(
        String asset, 
        OrderSide side, 
        List<OrderStatus> statuses
    );
    
    /**
     * Find orders by asset, side, and price level (for FIFO queues)
     */
    List<Order> findByAssetAndSideAndPriceAndStatusInOrderByTimestampAsc(
        String asset,
        OrderSide side,
        BigDecimal price,
        List<OrderStatus> statuses
    );
    
    /**
     * Get best bid orders (highest price, oldest first)
     */
    @Query("SELECT o FROM Order o WHERE o.asset = :asset AND o.side = 'BUY' AND o.status IN (:statuses) ORDER BY o.price DESC, o.timestamp ASC")
    List<Order> findBestBids(@Param("asset") String asset, @Param("statuses") List<OrderStatus> statuses);
    
    /**
     * Get best ask orders (lowest price, oldest first)
     */
    @Query("SELECT o FROM Order o WHERE o.asset = :asset AND o.side = 'SELL' AND o.status IN (:statuses) ORDER BY o.price ASC, o.timestamp ASC")
    List<Order> findBestAsks(@Param("asset") String asset, @Param("statuses") List<OrderStatus> statuses);
    
    /**
     * Find matching orders for FIFO algorithm
     */
    @Query("SELECT o FROM Order o WHERE o.asset = :asset AND o.side = :oppositeSide AND o.status IN ('NEW', 'PARTIALLY_FILLED') " +
           "AND (:price IS NULL OR (:orderSide = 'BUY' AND o.price <= :maxPrice) OR (:orderSide = 'SELL' AND o.price >= :minPrice)) " +
           "ORDER BY CASE WHEN :orderSide = 'BUY' THEN o.price END ASC, " +
           "CASE WHEN :orderSide = 'SELL' THEN o.price END DESC, o.timestamp ASC")
    List<Order> findMatchingOrders(
        @Param("asset") String asset,
        @Param("orderSide") OrderSide orderSide,
        @Param("oppositeSide") OrderSide oppositeSide,
        @Param("price") BigDecimal price,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice
    );
    
    /**
     * Count open orders by asset
     */
    long countByAssetAndStatusIn(String asset, List<OrderStatus> statuses);
    
    /**
     * Find orders by status
     */
    List<Order> findByStatus(OrderStatus status);
    
    /**
     * Find orders by asset
     */
    List<Order> findByAsset(String asset);
    
    /**
     * Find orders by asset and status
     */
    List<Order> findByAssetAndStatus(String asset, OrderStatus status);
}
