package com.trading.controller;

import com.trading.dto.OrderRequest;
import com.trading.dto.OrderResponse;
import com.trading.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Order Controller - REST API Layer
 * 
 * Handles HTTP requests for order operations
 * Follows MVC pattern with clean separation of concerns
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    /**
     * Create a new order
     * 
     * @param orderRequest Order creation request
     * @return Order response with execution details
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        try {
            OrderResponse response = orderService.createOrder(orderRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get order status by ID
     * 
     * @param orderId Order ID
     * @return Order response
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderStatus(@PathVariable UUID orderId) {
        try {
            OrderResponse response = orderService.getOrderStatus(orderId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Cancel an order
     * 
     * @param orderId Order ID to cancel
     * @return Success response
     */
    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID orderId) {
        try {
            boolean cancelled = orderService.cancelOrder(orderId);
            if (cancelled) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get all open orders
     * 
     * @return List of open orders
     */
    @GetMapping("/open")
    public ResponseEntity<List<OrderResponse>> getOpenOrders() {
        try {
            List<OrderResponse> orders = orderService.getOpenOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get open orders for a specific asset
     * 
     * @param asset Trading asset
     * @return List of open orders for the asset
     */
    @GetMapping("/open/{asset}")
    public ResponseEntity<List<OrderResponse>> getOpenOrdersByAsset(@PathVariable String asset) {
        try {
            List<OrderResponse> orders = orderService.getOpenOrders(asset);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Health check endpoint
     * 
     * @return Health status
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Order service is running");
    }
}
