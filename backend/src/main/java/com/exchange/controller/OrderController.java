package com.exchange.controller;

import com.exchange.domain.*;
import com.exchange.engine.FIFOEngine;
import com.exchange.engine.MatchingEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * Order Controller - Backend Layer
 * 
 * MVC Pattern: Controller handles request processing
 * Clean Architecture: Delegates to matching engine
 * SOLID: Single responsibility for order processing
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final MatchingEngine matchingEngine;
    
    public OrderController() {
        this.matchingEngine = new FIFOEngine(); // Use FIFO by default
    }
    
    /**
     * Match a new order
     * 
     * @param orderRequest Order details
     * @return Matching result with trades and order status
     */
    @PostMapping("/match")
    public ResponseEntity<Map<String, Object>> matchOrder(@RequestBody Map<String, Object> orderRequest) {
        try {
            // Extract order details
            String asset = (String) orderRequest.get("asset");
            String side = (String) orderRequest.get("side");
            Double price = orderRequest.get("price") != null ? ((Number) orderRequest.get("price")).doubleValue() : null;
            Double quantity = ((Number) orderRequest.get("quantity")).doubleValue();
            String type = (String) orderRequest.get("type");
            String userId = (String) orderRequest.get("userId");
            
            // Validate input
            if (asset == null || side == null || quantity == null || type == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing required fields: asset, side, quantity, type"
                ));
            }
            
            if (!("BUY".equals(side) || "SELL".equals(side))) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid side. Must be BUY or SELL"
                ));
            }
            
            if (!("LIMIT".equals(type) || "MARKET".equals(type))) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid type. Must be LIMIT or MARKET"
                ));
            }
            
            if ("LIMIT".equals(type) && (price == null || price <= 0)) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Limit orders require a valid price"
                ));
            }
            
            if (quantity <= 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Quantity must be greater than 0"
                ));
            }
            
            // Create order
            Order order = new Order(
                generateOrderId(),
                asset,
                OrderSide.valueOf(side),
                price,
                quantity.longValue(),
                quantity.longValue(),
                OrderStatus.NEW,
                System.currentTimeMillis()
            );
            
            // Match order using FIFO engine
            MatchingResult result = matchingEngine.match(order);
            
            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("status", order.getStatus().toString());
            response.put("filledQuantity", order.getQuantity() - order.getRemainingQuantity());
            response.put("remainingQuantity", order.getRemainingQuantity());
            response.put("trades", result.getTrades().stream().map(trade -> Map.of(
                "id", trade.getId(),
                "price", trade.getPrice(),
                "quantity", trade.getQuantity(),
                "buyOrderId", trade.getBuyOrderId(),
                "sellOrderId", trade.getSellOrderId(),
                "timestamp", trade.getTimestamp()
            )).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Internal server error",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Get order book for a specific asset
     * 
     * @param asset Trading asset
     * @return Order book data
     */
    @GetMapping("/{asset}/orderbook")
    public ResponseEntity<Map<String, Object>> getOrderBook(@PathVariable String asset) {
        try {
            OrderBook orderBook = matchingEngine.getOrderBook(asset);
            
            Map<String, Object> response = new HashMap<>();
            response.put("asset", asset);
            response.put("bestBid", orderBook.getBestBid() != null ? orderBook.getBestBid().getPrice() : null);
            response.put("bestAsk", orderBook.getBestAsk() != null ? orderBook.getBestAsk().getPrice() : null);
            response.put("buyOrders", orderBook.getBuyOrders().stream().map(this::orderToMap).toList());
            response.put("sellOrders", orderBook.getSellOrders().stream().map(this::orderToMap).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Internal server error",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Get all orders for a specific asset
     * 
     * @param asset Trading asset
     * @param userId Optional user filter
     * @return Orders data
     */
    @GetMapping("/{asset}")
    public ResponseEntity<Map<String, Object>> getOrders(
            @PathVariable String asset,
            @RequestParam(required = false) String userId) {
        try {
            List<Order> allOrders = matchingEngine.getAllOrders(asset);
            
            // Filter by user if specified
            List<Order> filteredOrders = userId != null 
                ? allOrders.stream().filter(order -> order.getUserId().equals(userId)).toList()
                : allOrders;
            
            Map<String, Object> response = new HashMap<>();
            response.put("asset", asset);
            response.put("orders", filteredOrders.stream().map(this::orderToMap).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Internal server error",
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Convert Order to Map for JSON response
     */
    private Map<String, Object> orderToMap(Order order) {
        return Map.of(
            "id", order.getId(),
            "asset", order.getPair(),
            "side", order.getSide().toString(),
            "type", order.getPrice() != null ? "LIMIT" : "MARKET",
            "price", order.getPrice() != null ? order.getPrice() : null,
            "quantity", order.getQuantity(),
            "filledQuantity", order.getQuantity() - order.getRemainingQuantity(),
            "remainingQuantity", order.getRemainingQuantity(),
            "status", order.getStatus().toString(),
            "timestamp", order.getTimestamp()
        );
    }
    
    /**
     * Generate unique order ID
     */
    private String generateOrderId() {
        return String.format("ORD-%d-%s", System.currentTimeMillis(), 
            Integer.toHexString((int) (Math.random() * 0xFFFF)).toUpperCase());
    }
}
