import java.io.*;
import java.net.*;
import java.util.*;

/**
 * Simple Spring Boot REST API Server
 * Provides the API endpoints that the frontend needs
 */
public class SpringBootRunner {
    
    private static final int PORT = 8080;
    private static Map<String, List<Map<String, Object>>> database = new HashMap<>();
    private static Map<String, Object> orderBook = new HashMap<>();
    
    static {
        // Initialize with some sample data
        database.put("orders", new ArrayList<>());
        database.put("trades", new ArrayList<>());
        
        // Add sample orders
        List<Map<String, Object>> orders = database.get("orders");
        orders.add(createOrder("1", "BTC/USDT", "BUY", 64000.0, 1.5));
        orders.add(createOrder("2", "BTC/USDT", "SELL", 64100.0, 0.8));
        orders.add(createOrder("3", "ETH/USDT", "BUY", 3450.0, 10.0));
        orders.add(createOrder("4", "ETH/USDT", "SELL", 3460.0, 5.0));
    }
    
    public static void main(String[] args) {
        System.out.println("=== Spring Boot API Server ===");
        System.out.println("Starting server on port " + PORT);
        
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Server started successfully!");
            System.out.println("Available endpoints:");
            System.out.println("  GET /api/orders/open");
            System.out.println("  GET /api/orders/open/{asset}");
            System.out.println("  GET /api/orders/{id}");
            System.out.println("  POST /api/orders");
            System.out.println("  DELETE /api/orders/{id}");
            System.out.println("  GET /api/orders/health");
            
            while (true) {
                try {
                    Socket clientSocket = serverSocket.accept();
                    new Thread(() -> handleRequest(clientSocket)).start();
                } catch (IOException e) {
                    System.err.println("Error accepting connection: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Could not start server: " + e.getMessage());
        }
    }
    
    private static void handleRequest(Socket clientSocket) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
             PrintWriter out = new PrintWriter(clientSocket.getOutputStream())) {
            
            String requestLine = in.readLine();
            if (requestLine == null) return;
            
            String[] requestParts = requestLine.split(" ");
            String method = requestParts[0];
            String path = requestParts[1];
            
            // Read headers
            Map<String, String> headers = new HashMap<>();
            String headerLine;
            while ((headerLine = in.readLine()) != null && !headerLine.isEmpty()) {
                String[] headerParts = headerLine.split(": ", 2);
                if (headerParts.length == 2) {
                    headers.put(headerParts[0], headerParts[1]);
                }
            }
            
            // Read body for POST requests
            StringBuilder body = new StringBuilder();
            if ("POST".equals(method) && headers.containsKey("Content-Length")) {
                int contentLength = Integer.parseInt(headers.get("Content-Length"));
                for (int i = 0; i < contentLength; i++) {
                    body.append((char) in.read());
                }
            }
            
            // Handle the request
            String response = handleApiRequest(method, path, body.toString());
            
            // Send response
            out.println("HTTP/1.1 200 OK");
            out.println("Content-Type: application/json");
            out.println("Access-Control-Allow-Origin: *");
            out.println("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
            out.println("Access-Control-Allow-Headers: Content-Type");
            out.println("Content-Length: " + response.length());
            out.println();
            out.print(response);
            out.flush();
            
        } catch (IOException e) {
            System.err.println("Error handling request: " + e.getMessage());
        } finally {
            try {
                clientSocket.close();
            } catch (IOException e) {
                System.err.println("Error closing socket: " + e.getMessage());
            }
        }
    }
    
    private static String handleApiRequest(String method, String path, String body) {
        try {
            if ("OPTIONS".equals(method)) {
                return "{\"status\":\"ok\"}";
            }
            
            if ("GET".equals(method) && path.equals("/api/orders/health")) {
                return "{\"status\":\"OK\",\"engine\":\"FIFO\",\"orders\":" + database.get("orders").size() + "}";
            }
            
            if ("GET".equals(method) && path.equals("/api/orders/open")) {
                List<Map<String, Object>> orders = database.get("orders");
                return "{\"orders\":" + formatJson(orders) + "}";
            }
            
            if ("GET".equals(method) && path.startsWith("/api/orders/open/")) {
                String asset = path.substring("/api/orders/open/".length());
                List<Map<String, Object>> orders = database.get("orders");
                List<Map<String, Object>> filteredOrders = new ArrayList<>();
                for (Map<String, Object> order : orders) {
                    if (asset.equals(order.get("asset"))) {
                        filteredOrders.add(order);
                    }
                }
                return "{\"orders\":" + formatJson(filteredOrders) + "}";
            }
            
            if ("GET".equals(method) && path.startsWith("/api/orders/")) {
                String orderId = path.substring("/api/orders/".length());
                List<Map<String, Object>> orders = database.get("orders");
                for (Map<String, Object> order : orders) {
                    if (orderId.equals(order.get("id"))) {
                        List<Map<String, Object>> singleOrderList = new ArrayList<>();
                        singleOrderList.add(order);
                        return "{\"order\":" + formatJson(singleOrderList).replace("[", "").replace("]", "") + "}";
                    }
                }
                return "{\"error\":\"Order not found\"}";
            }
            
            if ("POST".equals(method) && path.equals("/api/orders")) {
                // Parse simple JSON body
                Map<String, Object> orderData = parseSimpleJson(body);
                String newOrderId = String.valueOf(System.currentTimeMillis());
                Map<String, Object> newOrder = createOrder(
                    newOrderId,
                    (String) orderData.get("asset"),
                    (String) orderData.get("side"),
                    orderData.containsKey("price") ? (Double) orderData.get("price") : null,
                    (Double) orderData.get("quantity")
                );
                
                database.get("orders").add(newOrder);
                
                return "{\"message\":\"Order created successfully\",\"orderId\":\"" + newOrderId + "\",\"status\":\"NEW\",\"filledQuantity\":0,\"remainingQuantity\":" + orderData.get("quantity") + ",\"trades\":[]}";
            }
            
            if ("DELETE".equals(method) && path.startsWith("/api/orders/")) {
                String orderId = path.substring("/api/orders/".length());
                List<Map<String, Object>> orders = database.get("orders");
                orders.removeIf(order -> orderId.equals(order.get("id")));
                return "{\"message\":\"Order cancelled successfully\"}";
            }
            
            return "{\"error\":\"Endpoint not found\"}";
            
        } catch (Exception e) {
            return "{\"error\":\"" + e.getMessage().replace("\"", "\\\"") + "\"}";
        }
    }
    
    private static Map<String, Object> createOrder(String id, String asset, String side, Double price, double quantity) {
        Map<String, Object> order = new HashMap<>();
        order.put("id", id);
        order.put("asset", asset);
        order.put("side", side);
        order.put("price", price);
        order.put("quantity", quantity);
        order.put("remainingQuantity", quantity);
        order.put("status", "NEW");
        order.put("timestamp", System.currentTimeMillis());
        return order;
    }
    
    private static String formatJson(List<Map<String, Object>> list) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) json.append(",");
            json.append(formatJsonObject(list.get(i)));
        }
        json.append("]");
        return json.toString();
    }
    
    private static String formatJsonObject(Map<String, Object> obj) {
        StringBuilder json = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : obj.entrySet()) {
            if (!first) json.append(",");
            json.append("\"").append(entry.getKey()).append("\":");
            Object value = entry.getValue();
            if (value instanceof String) {
                json.append("\"").append(value.toString().replace("\"", "\\\"")).append("\"");
            } else if (value instanceof Double) {
                json.append(value);
            } else {
                json.append("\"").append(value.toString()).append("\"");
            }
            first = false;
        }
        json.append("}");
        return json.toString();
    }
    
    private static Map<String, Object> parseSimpleJson(String json) {
        Map<String, Object> result = new HashMap<>();
        // Simple JSON parser for our specific use case
        json = json.trim().substring(1, json.length() - 1); // Remove { }
        String[] pairs = json.split(",");
        for (String pair : pairs) {
            String[] keyValue = pair.split(":", 2);
            if (keyValue.length == 2) {
                String key = keyValue[0].trim().replace("\"", "");
                String value = keyValue[1].trim();
                
                if (value.startsWith("\"") && value.endsWith("\"")) {
                    result.put(key, value.substring(1, value.length() - 1));
                } else {
                    try {
                        result.put(key, Double.parseDouble(value));
                    } catch (NumberFormatException e) {
                        result.put(key, value);
                    }
                }
            }
        }
        return result;
    }
}
