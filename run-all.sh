#!/bin/bash

echo "=============================================="
echo " Starting Full-Stack Trading Platform "
echo "=============================================="

# 1. Start Java Backend Engine (Simulated backend worker)
echo "[1/2] Booting up Java Matching Engine..."
cd java-engine || exit
mkdir -p out
javac -d out $(find src -name "*.java")
if [ $? -eq 0 ]; then
    java -cp out com.tradingengine.demo.Main &
    JAVA_PID=$!
    echo "✅ Java Engine started (PID $JAVA_PID)"
else
    echo "❌ Failed to compile Java Engine."
fi

# 2. Go back to root and start Next.js Frontend/API
cd ..
echo "[2/2] Starting Next.js App (Frontend UI + API Routes)..."
echo "✅ Server will be available at http://localhost:3000"
echo "----------------------------------------------"

npm run dev &
NEXT_PID=$!

function cleanup {
    echo ""
    echo "🛑 Shutting down platform..."
    kill $JAVA_PID 2>/dev/null
    kill $NEXT_PID 2>/dev/null
    echo "✅ All services successfully stopped."
    exit
}

# Catch Ctrl+C to trap and kill both processes
trap cleanup SIGINT SIGTERM

wait
