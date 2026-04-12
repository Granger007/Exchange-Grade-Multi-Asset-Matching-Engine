package com.exchange.repository;

import com.exchange.domain.entity.OrderEntity;
import com.exchange.domain.OrderSide;
import com.exchange.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Order Repository - Data Access Layer
 * 
 * Provides database access for Order entities
 * Optimized queries for FIFO matching performance
 */
@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, String> {
    
    /**
     * Find active orders by pair and side (for FIFO matching)
     */
    List<OrderEntity> findByPairIdAndSideAndStatusIn(
        String pairId, 
        OrderSide side, 
        List<OrderStatus> statuses
    );
    
    /**
     * Find orders by price level (for FIFO queues)
     */
    List<OrderEntity> findByPairIdAndSideAndPriceAndStatusInOrderByCreatedAtAsc(
        String pairId,
        OrderSide side,
        BigDecimal price,
        List<OrderStatus> statuses
    );
    
    /**
     * Get best bid orders (highest price, oldest first)
     */
    @Query("SELECT o FROM OrderEntity o WHERE o.pairId = :pairId AND o.side = 'BUY' AND o.status IN (:statuses) ORDER BY o.price DESC, o.createdAt ASC")
    List<OrderEntity> findBestBids(@Param("pairId") String pairId, @Param("statuses") List<OrderStatus> statuses);
    
    /**
     * Get best ask orders (lowest price, oldest first)
     */
    @Query("SELECT o FROM OrderEntity o WHERE o.pairId = :pairId AND o.side = 'SELL' AND o.status IN (:statuses) ORDER BY o.price ASC, o.createdAt ASC")
    List<OrderEntity> findBestAsks(@Param("pairId") String pairId, @Param("statuses") List<OrderStatus> statuses);
    
    /**
     * Find matching orders for FIFO algorithm
     */
    @Query(value = """
        SELECT o.* FROM orders o 
        WHERE o.pair_id = :pairId 
        AND o.side = :oppositeSide 
        AND o.status IN ('NEW', 'PARTIALLY_FILLED')
        AND (:orderSide = 'BUY' AND o.price <= :maxPrice OR :orderSide = 'SELL' AND o.price >= :minPrice)
        ORDER BY 
            CASE WHEN :orderSide = 'BUY' THEN o.price END ASC,
            CASE WHEN :orderSide = 'SELL' THEN o.price END DESC,
            o.created_at ASC
        LIMIT 100
        """, nativeQuery = true)
    List<OrderEntity> findMatchingOrders(
        @Param("pairId") String pairId,
        @Param("orderSide") String orderSide,
        @Param("oppositeSide") String oppositeSide,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice
    );
    
    /**
     * Get order book depth
     */
    @Query(value = """
        SELECT side, price, SUM(remaining_quantity) as total_quantity, COUNT(*) as order_count
        FROM orders 
        WHERE pair_id = :pairId AND status IN ('NEW', 'PARTIALLY_FILLED')
        GROUP BY side, price
        ORDER BY side DESC, 
            CASE WHEN side = 'BUY' THEN price END DESC,
            CASE WHEN side = 'SELL' THEN price END ASC
        """, nativeQuery = true)
    List<Object[]> getOrderBookDepth(@Param("pairId") String pairId);
    
    /**
     * Find orders by user
     */
    List<OrderEntity> findByUserIdOrderByCreatedAtDesc(String userId);
    
    /**
     * Find orders by user and status
     */
    List<OrderEntity> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, OrderStatus status);
    
    /**
     * Find orders by user and pair
     */
    List<OrderEntity> findByUserIdAndPairIdOrderByCreatedAtDesc(String userId, String pairId);
    
    /**
     * Count active orders by pair
     */
    long countByPairIdAndStatusIn(String pairId, List<OrderStatus> statuses);
    
    /**
     * Find old filled orders for cleanup
     */
    List<OrderEntity> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime cutoff);
    
    /**
     * Update order status in batch
     */
    @Query("UPDATE OrderEntity o SET o.status = :status WHERE o.id IN :orderIds")
    int updateStatusByIds(@Param("status") OrderStatus status, @Param("orderIds") List<String> orderIds);
    
    /**
     * Get statistics for a pair
     */
    @Query(value = """
        SELECT 
            COUNT(*) as total_orders,
            SUM(CASE WHEN side = 'BUY' THEN quantity ELSE 0 END) as total_buy_volume,
            SUM(CASE WHEN side = 'SELL' THEN quantity ELSE 0 END) as total_sell_volume,
            AVG(price) as avg_price,
            MIN(price) as min_price,
            MAX(price) as max_price
        FROM orders 
        WHERE pair_id = :pairId AND status = 'FILLED'
        AND created_at >= :since
        """, nativeQuery = true)
    Object[] getPairStatistics(@Param("pairId") String pairId, @Param("since") LocalDateTime since);
    
    /**
     * Find orders that can be matched with a new order
     */
    @Query(value = """
        SELECT * FROM orders 
        WHERE pair_id = :pairId 
        AND side = :oppositeSide 
        AND status IN ('NEW', 'PARTIALLY_FILLED')
        AND remaining_quantity > 0
        AND (:price IS NULL OR (:orderSide = 'BUY' AND price <= :maxPrice) OR (:orderSide = 'SELL' AND price >= :minPrice))
        ORDER BY 
            CASE WHEN :orderSide = 'BUY' THEN price END ASC,
            CASE WHEN :orderSide = 'SELL' THEN price END DESC,
            created_at ASC
        """, nativeQuery = true)
    List<OrderEntity> findMatchableOrders(
        @Param("pairId") String pairId,
        @Param("orderSide") String orderSide,
        @Param("oppositeSide") String oppositeSide,
        @Param("price") BigDecimal price,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice
    );
}
