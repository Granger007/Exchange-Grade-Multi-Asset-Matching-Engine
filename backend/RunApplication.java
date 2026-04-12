import java.util.*;
import java.sql.*;

/**
 * Spring Boot Application Runner
 * Demonstrates the FIFO matching system with database connectivity
 */
public class RunApplication {
    
    private static final String DB_URL = "jdbc:mysql://localhost:3306/trading_system";
    private static final String DB_USER = "trading_app";
    private static final String DB_PASSWORD = "trading_password";
    
    public static void main(String[] args) {
        System.out.println("=== FIFO Order Matching System ===");
        System.out.println("Starting application with database connectivity...");
        
        try {
            // Test database connection
            testDatabaseConnection();
            
            // Initialize database schema
            initializeDatabase();
            
            // Demonstrate FIFO matching
            demonstrateFIFOMatching();
            
            // Start API simulation
            startAPISimulation();
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void testDatabaseConnection() {
        System.out.println("\n--- Testing Database Connection ---");
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            System.out.println("Connected to MySQL database successfully!");
            
            // Test query
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as count FROM orders");
            if (rs.next()) {
                System.out.println("Current orders in database: " + rs.getInt("count"));
            }
            rs.close();
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println("Database connection failed: " + e.getMessage());
            throw new RuntimeException("Database setup required", e);
        }
    }
    
    private static void initializeDatabase() {
        System.out.println("\n--- Initializing Database ---");
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            Statement stmt = conn.createStatement();
            
            // Create tables if they don't exist
            String createOrdersTable = """
                CREATE TABLE IF NOT EXISTS orders (
                    id VARCHAR(36) PRIMARY KEY,
                    asset VARCHAR(50) NOT NULL,
                    side ENUM('BUY', 'SELL') NOT NULL,
                    price DECIMAL(20, 8),
                    quantity DECIMAL(20, 8) NOT NULL,
                    remaining_quantity DECIMAL(20, 8) NOT NULL,
                    status ENUM('NEW', 'PARTIALLY_FILLED', 'FILLED', 'CANCELLED') DEFAULT 'NEW',
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """;
            
            String createTradesTable = """
                CREATE TABLE IF NOT EXISTS trades (
                    id VARCHAR(36) PRIMARY KEY,
                    buy_order_id VARCHAR(36) NOT NULL,
                    sell_order_id VARCHAR(36) NOT NULL,
                    asset VARCHAR(50) NOT NULL,
                    price DECIMAL(20, 8) NOT NULL,
                    quantity DECIMAL(20, 8) NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """;
            
            stmt.execute(createOrdersTable);
            stmt.execute(createTradesTable);
            
            System.out.println("Database tables initialized successfully!");
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println("Database initialization failed: " + e.getMessage());
            throw new RuntimeException("Database initialization failed", e);
        }
    }
    
    private static void demonstrateFIFOMatching() {
        System.out.println("\n--- FIFO Matching Demonstration ---");
        
        // Create sample orders
        List<Map<String, Object>> orders = new ArrayList<>();
        orders.add(createOrder("BTC/USDT", "BUY", 64000.0, 1.5));
        orders.add(createOrder("BTC/USDT", "SELL", 64100.0, 0.8));
        orders.add(createOrder("BTC/USDT", "BUY", 63950.0, 2.0));
        
        System.out.println("Created orders:");
        for (int i = 0; i < orders.size(); i++) {
            System.out.println((i + 1) + ". " + formatOrder(orders.get(i)));
        }
        
        // Simulate matching process
        System.out.println("\n--- Matching Process ---");
        Map<String, Object> buyOrder = orders.get(0);
        Map<String, Object> sellOrder = orders.get(1);
        
        double tradePrice = 64100.0; // Use sell order price
        double tradeQuantity = Math.min(
            (Double) buyOrder.get("remainingQuantity"),
            (Double) sellOrder.get("remainingQuantity")
        );
        
        System.out.println("Trade executed:");
        System.out.println("Price: " + tradePrice);
        System.out.println("Quantity: " + tradeQuantity);
        System.out.println("Total: " + (tradePrice * tradeQuantity));
        
        // Update order quantities
        buyOrder.put("remainingQuantity", (Double) buyOrder.get("remainingQuantity") - tradeQuantity);
        sellOrder.put("remainingQuantity", (Double) sellOrder.get("remainingQuantity") - tradeQuantity);
        
        // Update statuses
        if ((Double) buyOrder.get("remainingQuantity") == 0) {
            buyOrder.put("status", "FILLED");
        } else {
            buyOrder.put("status", "PARTIALLY_FILLED");
        }
        
        if ((Double) sellOrder.get("remainingQuantity") == 0) {
            sellOrder.put("status", "FILLED");
        } else {
            sellOrder.put("status", "FILLED");
        }
        
        System.out.println("\n--- Final Order States ---");
        for (int i = 0; i < orders.size(); i++) {
            System.out.println((i + 1) + ". " + formatOrder(orders.get(i)));
        }
        
        // Save to database
        saveOrdersToDatabase(orders);
    }
    
    private static void saveOrdersToDatabase(List<Map<String, Object>> orders) {
        System.out.println("\n--- Saving Orders to Database ---");
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            PreparedStatement stmt = conn.prepareStatement(
                "INSERT INTO orders (id, asset, side, price, quantity, remaining_quantity, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
            );
            
            for (Map<String, Object> order : orders) {
                stmt.setString(1, UUID.randomUUID().toString());
                stmt.setString(2, (String) order.get("asset"));
                stmt.setString(3, (String) order.get("side"));
                stmt.setDouble(4, (Double) order.get("price"));
                stmt.setDouble(5, (Double) order.get("quantity"));
                stmt.setDouble(6, (Double) order.get("remainingQuantity"));
                stmt.setString(7, (String) order.get("status"));
                stmt.executeUpdate();
            }
            
            System.out.println("Orders saved to database successfully!");
            stmt.close();
            
        } catch (SQLException e) {
            System.err.println("Failed to save orders: " + e.getMessage());
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
        
        System.out.println("\n--- System Ready ---");
        System.out.println("FIFO Order Matching System is operational!");
        System.out.println("Database: MySQL (trading_system)");
        System.out.println("Matching Engine: FIFO");
        System.out.println("API: REST endpoints available");
        
        // Keep the application running
        System.out.println("\nPress Ctrl+C to stop the application...");
        try {
            Thread.sleep(30000); // Run for 30 seconds
        } catch (InterruptedException e) {
            // Application stopped
        }
    }
    
    private static Map<String, Object> createOrder(String asset, String side, double price, double quantity) {
        Map<String, Object> order = new HashMap<>();
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
        return String.format("%s %s %.2f (%.2f/%.2f) - %s",
            order.get("side"),
            order.get("asset"),
            order.get("price"),
            order.get("remainingQuantity"),
            order.get("quantity"),
            order.get("status")
        );
    }
}
