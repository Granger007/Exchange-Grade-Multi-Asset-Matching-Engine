import java.util.*;

/**
 * FIFO Order Matching System - Simple Runner
 * Demonstrates the core functionality without database dependencies
 */
public class RunApplicationSimple {
    
    // In-memory order book
    private static Map<String, List<Map<String, Object>>> orderBook = new HashMap<>();
    
    public static void main(String[] args) {
        System.out.println("=== FIFO Order Matching System ===");
        System.out.println("Starting application...");
        
        try {
            // Initialize order book
            initializeOrderBook();
            
            // Demonstrate FIFO matching
            demonstrateFIFOMatching();
            
            // Start API simulation
            startAPISimulation();
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void initializeOrderBook() {
        System.out.println("\n--- Initializing Order Book ---");
        orderBook.put("BTC/USDT", new ArrayList<>());
        orderBook.put("ETH/USDT", new ArrayList<>());
        System.out.println("Order book initialized for BTC/USDT and ETH/USDT");
    }
    
    private static void demonstrateFIFOMatching() {
        System.out.println("\n--- FIFO Matching Demonstration ---");
        
        // Create sample orders
        List<Map<String, Object>> orders = new ArrayList<>();
        orders.add(createOrder("BTC/USDT", "BUY", 64000.0, 1.5));
        orders.add(createOrder("BTC/USDT", "SELL", 64100.0, 0.8));
        orders.add(createOrder("BTC/USDT", "BUY", 63950.0, 2.0));
        orders.add(createOrder("BTC/USDT", "SELL", 64050.0, 1.0));
        
        System.out.println("Created orders:");
        for (int i = 0; i < orders.size(); i++) {
            System.out.println((i + 1) + ". " + formatOrder(orders.get(i)));
        }
        
        // Add orders to order book
        for (Map<String, Object> order : orders) {
            String asset = (String) order.get("asset");
            orderBook.get(asset).add(order);
        }
        
        // Perform FIFO matching
        List<Map<String, Object>> trades = performFIFOMatching("BTC/USDT");
        
        System.out.println("\n--- Generated Trades ---");
        for (int i = 0; i < trades.size(); i++) {
            Map<String, Object> trade = trades.get(i);
            System.out.println((i + 1) + ". " + formatTrade(trade));
        }
        
        System.out.println("\n--- Final Order States ---");
        List<Map<String, Object>> btcOrders = orderBook.get("BTC/USDT");
        for (int i = 0; i < btcOrders.size(); i++) {
            System.out.println((i + 1) + ". " + formatOrder(btcOrders.get(i)));
        }
    }
    
    private static List<Map<String, Object>> performFIFOMatching(String asset) {
        List<Map<String, Object>> trades = new ArrayList<>();
        List<Map<String, Object>> orders = orderBook.get(asset);
        
        // Separate buy and sell orders
        List<Map<String, Object>> buyOrders = new ArrayList<>();
        List<Map<String, Object>> sellOrders = new ArrayList<>();
        
        for (Map<String, Object> order : orders) {
            if ("BUY".equals(order.get("side"))) {
                buyOrders.add(order);
            } else {
                sellOrders.add(order);
            }
        }
        
        // Sort buy orders by price descending (highest first), then time ascending
        buyOrders.sort((a, b) -> {
            int priceCompare = Double.compare((Double) b.get("price"), (Double) a.get("price"));
            if (priceCompare != 0) return priceCompare;
            return Long.compare((Long) a.get("timestamp"), (Long) b.get("timestamp"));
        });
        
        // Sort sell orders by price ascending (lowest first), then time ascending
        sellOrders.sort((a, b) -> {
            int priceCompare = Double.compare((Double) a.get("price"), (Double) b.get("price"));
            if (priceCompare != 0) return priceCompare;
            return Long.compare((Long) a.get("timestamp"), (Long) b.get("timestamp"));
        });
        
        // Perform matching
        int buyIndex = 0, sellIndex = 0;
        
        while (buyIndex < buyOrders.size() && sellIndex < sellOrders.size()) {
            Map<String, Object> buyOrder = buyOrders.get(buyIndex);
            Map<String, Object> sellOrder = sellOrders.get(sellIndex);
            
            double buyPrice = (Double) buyOrder.get("price");
            double sellPrice = (Double) sellOrder.get("price");
            
            // Check if orders can match
            if (buyPrice >= sellPrice) {
                // Create trade
                double tradePrice = sellPrice; // Use sell price
                double tradeQuantity = Math.min(
                    (Double) buyOrder.get("remainingQuantity"),
                    (Double) sellOrder.get("remainingQuantity")
                );
                
                Map<String, Object> trade = new HashMap<>();
                trade.put("buyOrderId", buyOrder.get("id"));
                trade.put("sellOrderId", sellOrder.get("id"));
                trade.put("price", tradePrice);
                trade.put("quantity", tradeQuantity);
                trade.put("timestamp", System.currentTimeMillis());
                trades.add(trade);
                
                // Update order quantities
                buyOrder.put("remainingQuantity", (Double) buyOrder.get("remainingQuantity") - tradeQuantity);
                sellOrder.put("remainingQuantity", (Double) sellOrder.get("remainingQuantity") - tradeQuantity);
                
                // Update statuses
                updateOrderStatus(buyOrder);
                updateOrderStatus(sellOrder);
                
                // Remove fully filled orders
                if ((Double) buyOrder.get("remainingQuantity") == 0) {
                    buyIndex++;
                }
                if ((Double) sellOrder.get("remainingQuantity") == 0) {
                    sellIndex++;
                }
                
                System.out.println("Match: BUY " + buyPrice + " with SELL " + sellPrice + " at " + tradePrice + " for " + tradeQuantity);
            } else {
                // No match possible, break
                break;
            }
        }
        
        return trades;
    }
    
    private static void updateOrderStatus(Map<String, Object> order) {
        double remaining = (Double) order.get("remainingQuantity");
        if (remaining == 0) {
            order.put("status", "FILLED");
        } else if (remaining < (Double) order.get("quantity")) {
            order.put("status", "PARTIALLY_FILLED");
        }
    }
    
    private static void startAPISimulation() {
        System.out.println("\n--- API Simulation ---");
        System.out.println("Spring Boot application would start on: http://localhost:8080");
        System.out.println("Available endpoints:");
        System.out.println("  POST /api/orders - Create order");
        System.out.println("  GET /api/orders/{id} - Get order status");
        System.out.println("  DELETE /api/orders/{id} - Cancel order");
        System.out.println("  GET /api/orders/open - List open orders");
        System.out.println("  GET /api/orders/open/{asset} - Asset-specific orders");
        System.out.println("  GET /api/orders/health - Health check");
        
        // Simulate some API calls
        simulateAPICalls();
        
        System.out.println("\n--- System Ready ---");
        System.out.println("FIFO Order Matching System is operational!");
        System.out.println("Matching Engine: FIFO");
        System.out.println("Order Book: In-memory");
        System.out.println("API: REST endpoints available");
        
        // Keep the application running
        System.out.println("\nApplication is running... (Simulated)");
        try {
            Thread.sleep(10000); // Run for 10 seconds
        } catch (InterruptedException e) {
            // Application stopped
        }
        
        System.out.println("Application stopped.");
    }
    
    private static void simulateAPICalls() {
        System.out.println("\n--- Simulating API Calls ---");
        
        // Simulate creating an order
        System.out.println("POST /api/orders - Creating new order...");
        Map<String, Object> newOrder = createOrder("ETH/USDT", "BUY", 3450.0, 5.0);
        orderBook.get("ETH/USDT").add(newOrder);
        System.out.println("Order created: " + formatOrder(newOrder));
        
        // Simulate getting order book
        System.out.println("GET /api/orders/open/BTC/USDT - Getting open orders...");
        List<Map<String, Object>> openOrders = orderBook.get("BTC/USDT").stream()
            .filter(order -> !"FILLED".equals(order.get("status")))
            .toList();
        System.out.println("Open orders: " + openOrders.size());
        
        // Simulate health check
        System.out.println("GET /api/orders/health - Health check...");
        System.out.println("Status: OK");
        System.out.println("Engine: FIFO");
        System.out.println("Orders in book: " + orderBook.values().stream().mapToInt(List::size).sum());
    }
    
    private static Map<String, Object> createOrder(String asset, String side, double price, double quantity) {
        Map<String, Object> order = new HashMap<>();
        order.put("id", UUID.randomUUID().toString());
        order.put("asset", asset);
        order.put("side", side);
        order.put("price", price);
        order.put("quantity", quantity);
        order.put("remainingQuantity", quantity);
        order.put("status", "NEW");
        order.put("timestamp", System.currentTimeMillis());
        return order;
    }
    
    private static String formatOrder(Map<String, Object> order) {
        return String.format("%s %s %.2f (%.2f/%.2f) - %s [ID: %s]",
            order.get("side"),
            order.get("asset"),
            order.get("price"),
            order.get("remainingQuantity"),
            order.get("quantity"),
            order.get("status"),
            order.get("id").toString().substring(0, 8)
        );
    }
    
    private static String formatTrade(Map<String, Object> trade) {
        return String.format("TRADE: %s @ %.2f x %.2f = %.2f (Buy: %s..., Sell: %s...)",
            trade.get("quantity"),
            trade.get("price"),
            trade.get("quantity"),
            (Double) trade.get("price") * (Double) trade.get("quantity"),
            trade.get("buyOrderId").toString().substring(0, 8),
            trade.get("sellOrderId").toString().substring(0, 8)
        );
    }
}
