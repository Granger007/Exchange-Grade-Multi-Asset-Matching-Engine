import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { v4 as uuidv4 } from '@/lib/uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, pair, type, side, price, quantity } = body;

    if (!userId || !pair || !type || !side || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert the order using our existing schema
    const orderId = uuidv4();
    const parsedPrice = price ? parseFloat(price) : null;
    const parsedQty = parseFloat(quantity);

    await execute(
      `INSERT INTO orders (id, asset, side, price, quantity, remaining_quantity, status, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, 'NEW', NOW())`,
      [orderId, pair, side, parsedPrice, parsedQty, parsedQty]
    );

    // Create a notification (using mock data)
    const notifId = uuidv4();
    console.log('Notification created:', notifId, 'Order placed successfully');

    return NextResponse.json({
      message: 'Order submitted successfully',
      orderId,
      status: 'NEW',
      filledQuantity: 0,
      remainingQuantity: parsedQty,
      trades: []
    }, { status: 201 });

  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const asset = searchParams.get('asset');

  try {
    let orders;
    if (asset) {
      orders = await query(
        'SELECT * FROM orders WHERE asset = ? ORDER BY timestamp DESC',
        [asset]
      );
    } else {
      orders = await query(
        'SELECT * FROM orders ORDER BY timestamp DESC LIMIT 50'
      );
    }
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch orders: ' + error.message }, { status: 500 });
  }
}
