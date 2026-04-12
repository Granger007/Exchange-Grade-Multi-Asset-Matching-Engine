import { NextResponse } from 'next/server';
import { query, execute } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const notifications = await query(
      'SELECT * FROM Notification WHERE userId = ? ORDER BY createdAt DESC LIMIT 20',
      [userId]
    );
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch notifications: ' + error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { notificationId } = body;

    await execute(
      'UPDATE Notification SET isRead = true WHERE id = ?',
      [notificationId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update notification: ' + error.message }, { status: 500 });
  }
}
