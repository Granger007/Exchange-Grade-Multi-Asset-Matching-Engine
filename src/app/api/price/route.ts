import { NextResponse } from 'next/server';

let prices = {
  BTC: 64000,
  ETH: 3500
};

// Simulate random price movements every time it's called
const updatePrices = () => {
    prices.BTC = prices.BTC + (Math.random() * 200 - 100);
    prices.ETH = prices.ETH + (Math.random() * 20 - 10);
};

export async function GET() {
  updatePrices();
  return NextResponse.json(prices);
}
