package com.exchange.repository;

import com.exchange.domain.entity.TradeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Trade Repository - Data Access Layer
 * 
 * Provides database access for Trade entities
 * Optimized for trade history and analytics
 */
@Repository
public interface TradeRepository extends JpaRepository<TradeEntity, String> {
    
    /**
     * Find trades by order ID
     */
    List<TradeEntity> findByBuyOrderIdOrSellOrderId(String buyOrderId, String sellOrderId);
    
    /**
     * Find trades by pair
     */
    List<TradeEntity> findByPairIdOrderByCreatedAtDesc(String pairId);
    
    /**
     * Find recent trades with pagination
     */
    Page<TradeEntity> findByPairIdOrderByCreatedAtDesc(String pairId, Pageable pageable);
    
    /**
     * Find trades by user (through their orders)
     */
    @Query("SELECT t FROM TradeEntity t WHERE t.buyOrderId IN (SELECT o.id FROM OrderEntity o WHERE o.userId = :userId) " +
           "OR t.sellOrderId IN (SELECT o.id FROM OrderEntity o WHERE o.userId = :userId) ORDER BY t.createdAt DESC")
    List<TradeEntity> findByUserId(@Param("userId") String userId);
    
    /**
     * Get trade volume statistics for a pair
     */
    @Query(value = """
        SELECT 
            COUNT(*) as trade_count,
            SUM(quantity) as total_volume,
            AVG(price) as avg_price,
            MIN(price) as min_price,
            MAX(price) as max_price,
            SUM(total_amount) as total_amount
        FROM trades 
        WHERE pair_id = :pairId 
        AND created_at >= :since
        """, nativeQuery = true)
    Object[] getTradeStatistics(@Param("pairId") String pairId, @Param("since") LocalDateTime since);
    
    /**
     * Get price history for a pair (OHLC)
     */
    @Query(value = """
        SELECT 
            DATE_TRUNC('hour', created_at) as hour,
            MIN(price) as open_price,
            MAX(price) as close_price,
            MIN(price) as low_price,
            MAX(price) as high_price,
            SUM(quantity) as volume,
            SUM(total_amount) as total_amount
        FROM trades 
        WHERE pair_id = :pairId 
        AND created_at >= :since
        GROUP BY DATE_TRUNC('hour', created_at)
        ORDER BY hour ASC
        """, nativeQuery = true)
    List<Object[]> getOHLCData(@Param("pairId") String pairId, @Param("since") LocalDateTime since);
    
    /**
     * Find trades within price range
     */
    List<TradeEntity> findByPairIdAndPriceBetweenOrderByCreatedAtDesc(
        String pairId, 
        BigDecimal minPrice, 
        BigDecimal maxPrice
    );
    
    /**
     * Find trades by time range
     */
    List<TradeEntity> findByPairIdAndCreatedAtBetweenOrderByCreatedAtDesc(
        String pairId,
        LocalDateTime start,
        LocalDateTime end
    );
    
    /**
     * Get recent trades for a pair (limited)
     */
    List<TradeEntity> findTop100ByPairIdOrderByCreatedAtDesc(String pairId);
    
    /**
     * Count trades by pair
     */
    long countByPairId(String pairId);
    
    /**
     * Get daily trade volume
     */
    @Query(value = """
        SELECT 
            DATE(created_at) as trade_date,
            COUNT(*) as trade_count,
            SUM(quantity) as volume,
            SUM(total_amount) as total_amount
        FROM trades 
        WHERE pair_id = :pairId 
        AND created_at >= :since
        GROUP BY DATE(created_at)
        ORDER BY trade_date DESC
        """, nativeQuery = true)
    List<Object[]> getDailyVolume(@Param("pairId") String pairId, @Param("since") LocalDateTime since);
    
    /**
     * Find trades with fee information
     */
    @Query("SELECT t FROM TradeEntity t WHERE t.buyFee > 0 OR t.sellFee > 0 ORDER BY t.createdAt DESC")
    List<TradeEntity> findTradesWithFees();
    
    /**
     * Get fee statistics
     */
    @Query(value = """
        SELECT 
            SUM(buy_fee) as total_buy_fees,
            SUM(sell_fee) as total_sell_fees,
            SUM(buy_fee + sell_fee) as total_fees,
            COUNT(*) as trade_count
        FROM trades 
        WHERE created_at >= :since
        """, nativeQuery = true)
    Object[] getFeeStatistics(@Param("since") LocalDateTime since);
    
    /**
     * Find trades by price point
     */
    List<TradeEntity> findByPairIdAndPriceOrderByCreatedAtDesc(String pairId, BigDecimal price);
    
    /**
     * Get market depth impact
     */
    @Query(value = """
        SELECT 
            price,
            SUM(quantity) as volume,
            COUNT(*) as trade_count
        FROM trades 
        WHERE pair_id = :pairId 
        AND created_at >= :since
        GROUP BY price
        ORDER BY price ASC
        """, nativeQuery = true)
    List<Object[]> getPriceImpact(@Param("pairId") String pairId, @Param("since") LocalDateTime since);
}
