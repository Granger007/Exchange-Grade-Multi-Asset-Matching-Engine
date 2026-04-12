package com.exchange;

import com.exchange.domain.Order;
import com.exchange.domain.OrderBook;
import com.exchange.domain.OrderSide;
import com.exchange.domain.TradeExecution;
import com.exchange.engine.MatchingEngine;
import com.exchange.strategy.FIFOMatching;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

public class WebServer {

    private static MatchingEngine matchingEngine;
    private static OrderBook orderBook;

    public static void main(String[] args) throws IOException {
        // Initialize components
        orderBook = new OrderBook();
        matchingEngine = new MatchingEngine(orderBook, new FIFOMatching());

        // Create HTTP server
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // Add endpoints
        server.createContext("/api/status", new StatusHandler());
        server.createContext("/api/order", new OrderHandler());
        server.createContext("/api/orderbook", new OrderBookHandler());
        server.createContext("/api/trades", new TradesHandler());
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("🚀 FIFO Order Matching Engine started on http://localhost:8080");
        System.out.println("📊 Available endpoints:");
        System.out.println("   GET  /api/status    - Engine status");
        System.out.println("   POST /api/order    - Place order");
        System.out.println("   GET  /api/orderbook - View order book");
        System.out.println("   GET  /api/trades   - Recent trades");
        System.out.println("\n🎯 Ready for trading!");
    }

    static class StatusHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response = "{\"status\":\"running\",\"engine\":\"FIFO\",\"timestamp\":" + System.currentTimeMillis() + "}";
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

    static class OrderHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                // Simple order parsing (in real app, use proper JSON parsing)
                String orderId = "ORD-" + System.currentTimeMillis();
                double price = 64000.00 + Math.random() * 100;
                long quantity = (long) (100 + Math.random() * 1000);
                OrderSide side = Math.random() > 0.5 ? OrderSide.BUY : OrderSide.SELL;
                
                Order order = new Order(orderId, price, quantity, side, System.currentTimeMillis());
                List<TradeExecution> executions = matchingEngine.processOrder(order);
                
                Map<String, Object> result = new HashMap<>();
                result.put("orderId", orderId);
                result.put("status", order.isFilled() ? "FILLED" : "QUEUED");
                result.put("executions", executions.size());
                result.put("timestamp", System.currentTimeMillis());
                
                String response = mapToJson(result);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }

    static class OrderBookHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Map<String, Object> result = new HashMap<>();
            result.put("bestBid", orderBook.getBestBid() != null ? orderBook.getBestBid().getPrice() : null);
            result.put("bestAsk", orderBook.getBestAsk() != null ? orderBook.getBestAsk().getPrice() : null);
            result.put("timestamp", System.currentTimeMillis());
            
            String response = mapToJson(result);
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

    static class TradesHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response = "{\"trades\":[],\"timestamp\":" + System.currentTimeMillis() + "}";
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

    private static String mapToJson(Map<String, Object> map) {
        return map.entrySet().stream()
            .map(entry -> {
                if (entry.getValue() instanceof String) {
                    return "\"" + entry.getKey() + "\":\"" + entry.getValue() + "\"";
                } else if (entry.getValue() == null) {
                    return "\"" + entry.getKey() + "\":null";
                } else {
                    return "\"" + entry.getKey() + "\":" + entry.getValue();
                }
            })
            .collect(Collectors.joining(",", "{", "}"));
    }
}
