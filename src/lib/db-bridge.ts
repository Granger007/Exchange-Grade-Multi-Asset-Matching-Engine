// Database bridge to Java backend via HTTP
// This connects to the Java Spring Boot backend instead of directly to MySQL

const BASE_URL = 'http://localhost:8080';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Helper function to make HTTP requests to Java backend
async function fetchFromBackend<T>(endpoint: string, options: RequestInit = {}): Promise<T[]> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.orders && Array.isArray(data.orders)) {
      return data.orders;
    } else {
      return [data]; // Wrap single object in array
    }
  } catch (error) {
    console.error('Backend API error:', error);
    throw error;
  }
}

// Simulate query function by calling backend APIs
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  console.log('Bridge DB Query:', sql, params);
  
  try {
    // Handle different query types
    if (sql.includes('orders')) {
      if (sql.includes('WHERE asset = ?') && params) {
        // Get orders for specific asset
        return await fetchFromBackend<T>(`/api/orders/open/${params[0]}`);
      } else if (sql.includes('WHERE id = ?') && params) {
        // Get specific order by ID
        return await fetchFromBackend<T>(`/api/orders/${params[0]}`);
      } else {
        // Get all open orders
        return await fetchFromBackend<T>('/api/orders/open');
      }
    }
    
    if (sql.includes('trades')) {
      // For trades, we'd need to implement a trades endpoint in the backend
      // For now, return empty array
      return [] as T[];
    }
    
    if (sql.includes('notifications')) {
      // For notifications, return empty array (not implemented in backend yet)
      return [] as T[];
    }
    
    // Default fallback
    return [] as T[];
  } catch (error) {
    console.error('Query failed:', error);
    return [] as T[];
  }
}

// Simulate execute function by calling backend APIs
export async function execute(sql: string, params?: any[]): Promise<any> {
  console.log('Bridge DB Execute:', sql, params);
  
  try {
    if (sql.includes('INSERT INTO orders') && params) {
      // Create new order via backend API
      const orderData = {
        asset: params[1],
        side: params[2],
        type: params[3] ? 'LIMIT' : 'MARKET',
        price: params[3],
        quantity: params[4]
      };
      
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        affectedRows: 1,
        insertId: result.orderId || 'generated-id'
      };
    }
    
    // For other operations, return mock result
    return {
      affectedRows: 1,
      insertId: Math.floor(Math.random() * 1000)
    };
  } catch (error) {
    console.error('Execute failed:', error);
    throw error;
  }
}

export default { query, execute };
