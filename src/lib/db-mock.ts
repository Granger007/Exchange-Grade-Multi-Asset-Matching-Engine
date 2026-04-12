// Mock database for development - bypasses mysql2 dependency
interface MockRow {
  [key: string]: any;
}

interface MockResultSetHeader {
  affectedRows: number;
  insertId: number;
}

// Mock data storage
const mockData = {
  orders: [
    { id: '1', asset: 'BTC/USDT', side: 'BUY', price: 64000, quantity: 1.5, remaining_quantity: 1.5, status: 'NEW', timestamp: new Date() },
    { id: '2', asset: 'BTC/USDT', side: 'SELL', price: 64100, quantity: 0.8, remaining_quantity: 0.8, status: 'NEW', timestamp: new Date() },
    { id: '3', asset: 'ETH/USDT', side: 'BUY', price: 3450, quantity: 10, remaining_quantity: 10, status: 'NEW', timestamp: new Date() },
  ],
  trades: [
    { id: '1', buy_order_id: '1', sell_order_id: '2', asset: 'BTC/USDT', price: 64050, quantity: 0.5, timestamp: new Date() },
  ],
  notifications: [
    { id: '1', type: 'trade', message: 'Trade executed: 0.5 BTC at $64,050', timestamp: new Date(), read: false },
  ]
};

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  console.log('Mock DB Query:', sql, params);
  
  // Simple mock query simulation
  if (sql.includes('orders')) {
    return mockData.orders as T[];
  }
  if (sql.includes('trades')) {
    return mockData.trades as T[];
  }
  if (sql.includes('notifications')) {
    return mockData.notifications as T[];
  }
  
  return [] as T[];
}

export async function execute(sql: string, params?: any[]): Promise<MockResultSetHeader> {
  console.log('Mock DB Execute:', sql, params);
  
  // Mock execute result
  return {
    affectedRows: 1,
    insertId: Math.floor(Math.random() * 1000)
  } as MockResultSetHeader;
}

export default { query, execute };
