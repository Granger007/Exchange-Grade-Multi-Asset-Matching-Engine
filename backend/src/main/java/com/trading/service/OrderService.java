package com.trading.service;

import com.trading.dto.OrderRequest;
import com.trading.dto.OrderResponse;
import com.trading.dto.OrderResponse.TradeResponse;
import com.trading.model.Order;
import com.trading.model.OrderSide;
import com.trading.model.OrderStatus;
import com.trading.model.Trade;
import com.trading.repository.OrderRepository;
import com.trading.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Order Service - Business Logic Layer
 * 
 * Handles order operations and delegates matching to the engine
 * Follows SOLID principles with single responsibility
 */
@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private TradeRepository tradeRepository;
    
    @Autowired
    private MatchingService matchingService;
    
    /**
     * Create a new order
     * 
     * @param request Order creation request
     * @return Order response with execution details
     */
    public OrderResponse createOrder(OrderRequest request) {
        // Validate request
        validateOrderRequest(request);
        
        // Create order entity
        Order order = new Order();
        order.setAsset(request.getAsset());
        order.setSide(OrderSide.valueOf(request.getSide()));
        order.setPrice(request.isLimitOrder() ? request.getPrice() : null);
        order.setQuantity(request.getQuantity());
        order.setRemainingQuantity(request.getQuantity());
        
        // Save order to database
        order = orderRepository.save(order);
        
        // Process matching through matching service
        List<Trade> trades = matchingService.matchOrder(order);
        
        // Save trades
        for (Trade trade : trades) {
            tradeRepository.save(trade);
        }
        
        // Save updated order status
        order = orderRepository.save(order);
        
        // Build response
        return buildOrderResponse(order, trades);
    }
    
    /**
     * Cancel an order
     * 
     * @param orderId Order ID to cancel
     * @return True if cancelled successfully
     */
    public boolean cancelOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return false;
        }
        
        // Only allow cancellation of unfilled orders
        if (order.getStatus() == OrderStatus.FILLED) {
            return false;
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        // Remove from matching engine
        matchingService.removeOrder(order);
        
        return true;
    }
    
    /**
     * Get order status
     * 
     * @param orderId Order ID
     * @return Order response
     */
    public OrderResponse getOrderStatus(UUID orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            throw new IllegalArgumentException("Order not found: " + orderId);
        }
        
        // Get trades for this order
        List<Trade> trades = tradeRepository.findByBuyOrderIdOrSellOrderId(orderId, orderId);
        
        return buildOrderResponse(order, trades);
    }
    
    /**
     * Get all open orders
     * 
     * @return List of open orders
     */
    public List<OrderResponse> getOpenOrders() {
        List<Order> orders = orderRepository.findByStatus(OrderStatus.NEW);
        return orders.stream()
            .map(order -> buildOrderResponse(order, new ArrayList<>()))
            .collect(Collectors.toList());
    }
    
    /**
     * Get open orders for a specific asset
     * 
     * @param asset Trading asset
     * @return List of open orders for the asset
     */
    public List<OrderResponse> getOpenOrders(String asset) {
        List<Order> orders = orderRepository.findByAssetAndStatus(asset, OrderStatus.NEW);
        return orders.stream()
            .map(order -> buildOrderResponse(order, new ArrayList<>()))
            .collect(Collectors.toList());
    }
    
    /**
     * Validate order request
     */
    private void validateOrderRequest(OrderRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Order request cannot be null");
        }
        
        if (request.getAsset() == null || request.getAsset().trim().isEmpty()) {
            throw new IllegalArgumentException("Asset is required");
        }
        
        if (!"BUY".equalsIgnoreCase(request.getSide()) && !"SELL".equalsIgnoreCase(request.getSide())) {
            throw new IllegalArgumentException("Side must be BUY or SELL");
        }
        
        if (!"LIMIT".equalsIgnoreCase(request.getType()) && !"MARKET".equalsIgnoreCase(request.getType())) {
            throw new IllegalArgumentException("Type must be LIMIT or MARKET");
        }
        
        if (request.getQuantity() == null || request.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        
        if ("LIMIT".equalsIgnoreCase(request.getType()) && !request.isValidLimitOrder()) {
            throw new IllegalArgumentException("Limit orders require a valid price");
        }
    }
    
    /**
     * Build order response from entity and trades
     */
    private OrderResponse buildOrderResponse(Order order, List<Trade> trades) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getId());
        response.setAsset(order.getAsset());
        response.setSide(order.getSide().toString());
        response.setType(order.getPrice() != null ? "LIMIT" : "MARKET");
        response.setPrice(order.getPrice());
        response.setQuantity(order.getQuantity());
        response.setFilledQuantity(order.getQuantity().subtract(order.getRemainingQuantity()));
        response.setRemainingQuantity(order.getRemainingQuantity());
        response.setStatus(order.getStatus().toString());
        response.setTimestamp(order.getTimestamp());
        
        // Convert trades to DTOs
        List<TradeResponse> tradeResponses = trades.stream()
            .map(this::buildTradeResponse)
            .collect(Collectors.toList());
        response.setTrades(tradeResponses);
        
        return response;
    }
    
    /**
     * Build trade response from entity
     */
    private TradeResponse buildTradeResponse(Trade trade) {
        TradeResponse response = new TradeResponse();
        response.setId(trade.getId());
        response.setBuyOrderId(trade.getBuyOrderId());
        response.setSellOrderId(trade.getSellOrderId());
        response.setPrice(trade.getPrice());
        response.setQuantity(trade.getQuantity());
        response.setTimestamp(trade.getTimestamp());
        return response;
    }
}
