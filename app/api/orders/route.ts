import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth/server';
import { PaymentMethod } from '@/generated/prisma/client';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid checkout payload' }, { status: 400 });
  }

  const {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    items = [],
    paymentMethod = 'COD',
    notes = '',
  } = body;

  if (!customerName || !customerEmail || !customerPhone || items.length === 0) {
    return NextResponse.json(
      { error: 'Customer name, email, phone, and items are required.' },
      { status: 400 },
    );
  }

  // Check if customer is signed in
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id || null;

  const orderNumber = `MX-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    let subtotal = 0;
    const orderItemsData = items.map((it: {
      productId?: string;
      slug?: string;
      title?: string;
      price: number;
      quantity: number;
      size?: string;
      color?: string;
    }) => {
      const lineTotal = Number(it.price) * Number(it.quantity);
      subtotal += lineTotal;
      return {
        title: it.title || 'Medical Scrub Suit',
        sku: `${(it.slug || 'MX').toUpperCase()}-${it.size || 'M'}`,
        size: it.size || 'M',
        color: it.color || 'Standard',
        price: Number(it.price),
        quantity: Number(it.quantity) || 1,
        subtotal: lineTotal,
      };
    });

    const shippingFee = subtotal >= 10000 ? 0 : 250;
    const total = subtotal + shippingFee;

    const shipAddr = (shippingAddress as Record<string, string>) || {};

    const order = await db.order.create({
      data: {
        orderNumber,
        userId: userId ? String(userId) : null,
        email: customerEmail,
        phone: customerPhone,
        shipFullName: customerName,
        shipLine1: shipAddr.street || 'Pakistan Address',
        shipCity: shipAddr.city || 'Karachi',
        shipProvince: shipAddr.state || 'Sindh',
        status: 'PENDING',
        paymentMethod: (paymentMethod.toUpperCase() in PaymentMethod
          ? paymentMethod.toUpperCase()
          : 'COD') as PaymentMethod,
        paymentStatus: 'UNPAID',
        subtotal,
        shippingFee,
        total,
        notes,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: Number(order.total),
    });
  } catch (err) {
    console.error('Storefront order placement error:', err);
    return NextResponse.json({ error: 'Failed to place order. Please try again.' }, { status: 500 });
  }
}
