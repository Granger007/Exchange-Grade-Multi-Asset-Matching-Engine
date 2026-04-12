package com.trading.repository;

import com.trading.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Trade Repository - Spring Data JPA
 * 
 * Provides database access for Trade entities
 */
@Repository
public interface TradeRepository extends JpaRepository<Trade, UUID> {
    
    /**
     * Find trades by order ID
     */
    List<Trade> findByBuyOrderIdOrSellOrderId(UUID buyOrderId, UUID sellOrderId);
    
    /**
     * Find trades by asset
     */
    List<Trade> findByAssetOrderByTimestampDesc(String asset);
    
    /**
     * Find recent trades for an asset (limited)
     */
    List<Trade> findTop100ByAssetOrderByTimestampDesc(String asset);
    
    /**
     * Find trades by time range
     */
    List<Trade> findByAssetAndTimestampBetweenOrderByTimestampDesc(
        String asset,
        Instant start,
        Instant end
    );
    
    /**
     * Count trades by asset
     */
    long countByAsset(String asset);
    
    /**
     * Get trade statistics for an asset
     */
    @Query("SELECT COUNT(t), SUM(t.quantity), AVG(t.price), MIN(t.price), MAX(t.price) " +
           "FROM Trade t WHERE t.asset = :asset AND t.timestamp >= :since")
    Object[] getTradeStatistics(@Param("asset") String asset, @Param("since") Instant since);
}
