#!/bin/bash

# Database Setup Script for FIFO Order Matching System
# This script sets up MySQL database and creates the schema

echo "=== FIFO Order Matching System - Database Setup ==="

# Database configuration
DB_NAME="trading_system"
DB_USER="root"
DB_PASSWORD="password"
DB_HOST="localhost"
DB_PORT="3306"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if MySQL is running
print_status "Checking MySQL connection..."
if ! mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD -e "SELECT 1;" &>/dev/null; then
    print_error "Cannot connect to MySQL server"
    echo "Please ensure MySQL is running and credentials are correct:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  User: $DB_USER"
    echo "  Password: [configured in script]"
    exit 1
fi

print_status "MySQL connection successful!"

# Create database if it doesn't exist
print_status "Creating database: $DB_NAME"
mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if [ $? -eq 0 ]; then
    print_status "Database created successfully!"
else
    print_error "Failed to create database"
    exit 1
fi

# Import schema
print_status "Importing database schema..."
if [ -f "src/main/resources/schema.sql" ]; then
    mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME < src/main/resources/schema.sql
    
    if [ $? -eq 0 ]; then
        print_status "Schema imported successfully!"
    else
        print_error "Failed to import schema"
        exit 1
    fi
else
    print_error "Schema file not found: src/main/resources/schema.sql"
    exit 1
fi

# Verify tables were created
print_status "Verifying table creation..."
TABLE_COUNT=$(mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" -s -N)

if [ "$TABLE_COUNT" -gt 0 ]; then
    print_status "Successfully created $TABLE_COUNT tables"
    
    # List created tables
    print_status "Created tables:"
    mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME -e "SHOW TABLES;" -s
else
    print_error "No tables were created"
    exit 1
fi

# Create application user (optional)
print_warning "Creating application database user..."
mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE USER IF NOT EXISTS 'trading_app'@'%' IDENTIFIED BY 'trading_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON $DB_NAME.* TO 'trading_app'@'%';
FLUSH PRIVILEGES;
"

if [ $? -eq 0 ]; then
    print_status "Application user created successfully!"
    print_warning "Application user credentials:"
    echo "  Username: trading_app"
    echo "  Password: trading_password"
    echo "  You can update these in application.properties"
else
    print_warning "Failed to create application user (may already exist)"
fi

# Test database connection with application user
print_status "Testing application user connection..."
if mysql -h$DB_HOST -P$DB_PORT -u'trading_app' -p'trading_password' $DB_NAME -e "SELECT 1;" &>/dev/null; then
    print_status "Application user connection successful!"
else
    print_warning "Application user connection failed (using root user instead)"
fi

# Display configuration summary
echo ""
echo "=== Database Setup Complete ==="
echo "Database Configuration:"
echo "  Database: $DB_NAME"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Root User: $DB_USER"
echo "  Application User: trading_app"
echo ""
echo "Next Steps:"
echo "1. Update application.properties with your database credentials"
echo "2. Start the Spring Boot application"
echo "3. The application will automatically create/update tables"
echo ""
echo "Connection String:"
echo "jdbc:mysql://$DB_HOST:$DB_PORT/$DB_NAME?useSSL=false&serverTimezone=UTC"
echo ""
print_status "Database setup completed successfully!"
