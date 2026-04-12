import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, pair, type, side, price, quantity } = body;

    if (!userId || !pair || !type || !side || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure the test user exists (upsert pattern)
    const existingUsers = await query('SELECT id FROM User WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      await execute(
        'INSERT INTO User (id, email, username, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [userId, `${userId}@exchange.local`, `user-${userId}`, 'demo-hash']
      );
    }

    // Insert the trade order
    const orderId = uuidv4();
    const parsedPrice = price ? parseFloat(price) : null;
    const parsedQty = parseFloat(quantity);

    await execute(
      `INSERT INTO TradeOrder (id, userId, pair, type, side, price, quantity, filledQty, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'NEW', NOW(), NOW())`,
      [orderId, userId, pair, type, side, parsedPrice, parsedQty]
    );

    // Create a notification
    const notifId = uuidv4();
    await execute(
      `INSERT INTO Notification (id, userId, title, message, type, isRead, createdAt)
       VALUES (?, ?, 'Order Placed', ?, 'ORDER_OPEN', false, NOW())`,
      [notifId, userId, `Successfully placed ${side} order for ${quantity} of ${pair}`]
    );

    return NextResponse.json({
      message: 'Order submitted successfully',
      order: { id: orderId, userId, pair, type, side, price: parsedPrice, quantity: parsedQty, status: 'NEW' }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const orders = await query(
      'SELECT * FROM TradeOrder WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch orders: ' + error.message }, { status: 500 });
  }
}
