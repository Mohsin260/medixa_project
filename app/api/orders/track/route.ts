import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber')?.trim();
  const query = searchParams.get('query')?.trim();

  const target = orderNumber || query;
  if (!target) {
    return NextResponse.json({ error: 'Order number is required.' }, { status: 400 });
  }

  try {
    const order = await db.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: target, mode: 'insensitive' } },
          { id: target },
        ],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'No order found with this tracking ID.' }, { status: 404 });
    }

    // Return sanitized public tracking info
    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      total: order.total,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      shipCity: order.shipCity,
      shipProvince: order.shipProvince,
      customerName: order.shipFullName,
      items: order.items.map((item) => ({
        title: item.title,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'Failed to look up order status.' }, { status: 500 });
  }
}

