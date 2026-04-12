# FIFO Order Matching Engine Backend

## Overview
This is a Java Spring Boot backend implementing a FIFO (First-In-First-Out) order matching system for a multi-asset trading platform.

## Architecture
The backend follows clean architecture principles with clear separation of concerns:

```
backend/
└── src/
    └── main/
        └── java/
            └── com/
                └── exchange/
                    ├── domain/          # Domain models and core business logic
                    ├── strategy/        # Matching strategy implementations
                    └── engine/          # Core matching engine
```

## Components

### Domain Layer (`domain/`)
- **Order.java**: Order entity with status management
- **TradeExecution.java**: Trade execution records
- **OrderBook.java**: Order book with FIFO queue management

### Strategy Layer (`strategy/`)
- **MatchingStrategy.java**: Interface for matching algorithms
- **FIFOMatching.java**: FIFO order matching implementation

### Engine Layer (`engine/`)
- **MatchingEngine.java**: Core matching engine orchestrator

## Features
- ✅ Price-time priority matching (FIFO)
- ✅ Partial fill support
- ✅ Real-time order book management
- ✅ Trade execution generation
- ✅ SOLID and GRASP principles

## Usage
The engine can be integrated into a Spring Boot application by creating beans for:
- OrderBook
- FIFOMatching (as MatchingStrategy)
- MatchingEngine

## FIFO Matching Logic
1. Orders are matched by price priority first
2. Within same price, orders are matched by time priority (FIFO)
3. Supports partial fills and order status updates
4. Generates trade executions for all matches
