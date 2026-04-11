import { NextResponse } from 'next/server';

type Trade = {
  id: string;
  symbol: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  timestamp: string;
};

// In-memory store
let trades: Trade[] = [];

export async function GET() {
  return NextResponse.json(trades);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newTrade: Trade = {
      id: `trd-${Math.random().toString(36).substring(2, 8)}`,
      symbol: body.symbol || 'UNKNOWN',
      price: body.price || 0,
      quantity: body.quantity || 0,
      side: body.side === 'BUY' ? 'BUY' : 'SELL',
      timestamp: new Date().toISOString(),
    };
    
    // Add to beginning of array
    trades = [newTrade, ...trades].slice(0, 100); // Keep max 100 trades in memory
    
    return NextResponse.json(newTrade);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
