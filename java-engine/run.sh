#!/bin/bash

# Clean previous builds
rm -rf out
mkdir -p out

echo "Compiling the Multi-Asset Trading Engine (Crypto + Notifications)..."
javac -d out $(find src -name "*.java")

if [ $? -eq 0 ]; then
    echo "Compilation successful."
    echo "============================================"
    echo "Running Demonstration:"
    echo "============================================"
    java -cp out com.tradingengine.demo.Main
else
    echo "Compilation failed. Please check the errors above."
fi
