import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/generated/prisma/client';

export async function GET(request: NextRequest) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  try {
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { shipFullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'ALL') {
      whereClause.status = status as OrderStatus;
    }

    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.shipFullName,
      customerEmail: o.email,
      customerPhone: o.phone,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      total: Number(o.total),
      subtotal: Number(o.subtotal),
      shippingFee: Number(o.shippingFee),
      discount: Number(o.discount),
      itemCount: o.items.reduce((acc, it) => acc + it.quantity, 0),
      items: o.items.map((it) => ({
        id: it.id,
        title: it.title,
        sku: it.sku,
        size: it.size || 'M',
        color: it.color || 'Standard',
        price: Number(it.price),
        quantity: it.quantity,
        total: Number(it.subtotal),
      })),
      shippingAddress: {
        street: o.shipLine1,
        city: o.shipCity,
        state: o.shipProvince,
      },
      trackingNumber: null,
      notes: o.notes,
      createdAt: o.createdAt.toISOString(),
    }));

    return NextResponse.json({ orders: formatted });
  } catch (err) {
    console.error('Failed to list admin orders:', err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const {
    customerName,
    customerEmail,
    customerPhone = '03001234567',
    paymentMethod = 'COD',
    paymentStatus = 'UNPAID',
    status = 'CONFIRMED',
    items = [],
    shippingFee = 250,
    notes = '',
    shippingAddress = {},
  } = body;

  if (!customerName || !customerEmail || items.length === 0) {
    return NextResponse.json(
      { error: 'Customer name, email, and at least one item are required.' },
      { status: 400 },
    );
  }

  const orderNumber = `MX-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    let subtotal = 0;
    const orderItemsData = items.map((it: {
      productId?: string;
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
        sku: `MX-SCRUB-${it.size || 'M'}`,
        size: it.size || 'M',
        color: it.color || 'Navy',
        price: Number(it.price),
        quantity: Number(it.quantity) || 1,
        subtotal: lineTotal,
      };
    });

    const total = subtotal + Number(shippingFee);

    const order = await db.order.create({
      data: {
        orderNumber,
        email: customerEmail,
        phone: customerPhone,
        shipFullName: customerName,
        shipLine1: (shippingAddress as Record<string, string>)?.street || 'Pakistan Address',
        shipCity: (shippingAddress as Record<string, string>)?.city || 'Karachi',
        shipProvince: (shippingAddress as Record<string, string>)?.state || 'Sindh',
        status: status as OrderStatus,
        paymentMethod: paymentMethod as PaymentMethod,
        paymentStatus: paymentStatus as PaymentStatus,
        subtotal,
        shippingFee: Number(shippingFee),
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

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err) {
    console.error('Create manual order error:', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
