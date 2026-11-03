import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUserId = session.user.id ? String(session.user.id) : null;
    const sessionEmail = session.user.email ? String(session.user.email).toLowerCase().trim() : null;

    let dbUser = null;
    if (sessionUserId) {
      dbUser = await db.user.findUnique({
        where: { id: sessionUserId },
        select: { id: true, email: true },
      });
    }

    if (!dbUser && sessionEmail) {
      dbUser = await db.user.findUnique({
        where: { email: sessionEmail },
        select: { id: true, email: true },
      });
    }

    const targetUserId = dbUser?.id || sessionUserId;
    const targetEmail = dbUser?.email || sessionEmail;

    const whereConditions: Array<Record<string, unknown>> = [];
    if (targetUserId) {
      whereConditions.push({ userId: targetUserId });
    }
    if (targetEmail) {
      whereConditions.push({ email: { equals: targetEmail, mode: 'insensitive' } });
    }

    if (whereConditions.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await db.order.findMany({
      where: {
        OR: whereConditions,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    const sanitized = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      createdAt: o.createdAt,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      total: Number(o.total),
      subtotal: Number(o.subtotal),
      shippingFee: Number(o.shippingFee),
      shipFullName: o.shipFullName,
      shipCity: o.shipCity,
      shipProvince: o.shipProvince,
      items: o.items.map((it) => ({
        id: it.id,
        title: it.title,
        sku: it.sku,
        size: it.size,
        color: it.color,
        image: it.image,
        price: Number(it.price),
        quantity: it.quantity,
      })),
    }));

    return NextResponse.json({ orders: sanitized });
  } catch (err) {
    console.error('Fetch customer orders error:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
