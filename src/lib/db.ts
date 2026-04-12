// Database bridge to Java backend via HTTP
// This connects to the Java Spring Boot backend instead of directly to MySQL
import { query, execute } from './db-bridge';

// Re-export for backward compatibility
export { query, execute };
export default { query, execute };
