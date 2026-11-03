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
    billingAddress,
    newsletter = false,
    items = [],
    paymentMethod = 'COD',
    notes = '',
  } = body;

  const trimmedName = String(customerName || '').trim();
  const trimmedEmail = String(customerEmail || '').trim().toLowerCase();
  const trimmedPhone = String(customerPhone || '').trim();

  if (!trimmedName || !trimmedEmail || !trimmedPhone || items.length === 0) {
    return NextResponse.json(
      { error: 'Customer name, email, phone, and items are required.' },
      { status: 400 },
    );
  }

  // 1. Resolve user ID safely and ensure it genuinely exists in Prisma User table
  let validUserId: string | null = null;

  try {
    const { data: session } = await auth.getSession();
    const sessionUserId = session?.user?.id ? String(session.user.id) : null;
    const sessionEmail = session?.user?.email ? String(session.user.email).toLowerCase().trim() : null;

    // Check if user exists in db.user by session id
    if (sessionUserId) {
      const userById = await db.user.findUnique({
        where: { id: sessionUserId },
        select: { id: true, role: true },
      });
      if (userById && userById.role === 'CUSTOMER') {
        validUserId = userById.id;
      }
    }

    // Fallback: check db.user by session email
    if (!validUserId && sessionEmail && sessionEmail !== 'admin@medixa.pk') {
      const userBySessionEmail = await db.user.findUnique({
        where: { email: sessionEmail },
        select: { id: true, role: true },
      });
      if (userBySessionEmail && userBySessionEmail.role === 'CUSTOMER') {
        validUserId = userBySessionEmail.id;
      }
    }

    // Fallback: check db.user by checkout customer email
    if (!validUserId && trimmedEmail && trimmedEmail !== 'admin@medixa.pk') {
      const userByEmail = await db.user.findUnique({
        where: { email: trimmedEmail },
        select: { id: true, name: true, phone: true, role: true },
      });
      if (userByEmail && userByEmail.role === 'CUSTOMER') {
        validUserId = userByEmail.id;
        if (!userByEmail.name || !userByEmail.phone) {
          await db.user.update({
            where: { id: userByEmail.id },
            data: {
              name: userByEmail.name || trimmedName,
              phone: userByEmail.phone || trimmedPhone,
            },
          }).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.warn('Safe user resolution warning during checkout:', err);
    validUserId = null;
  }

  const orderNumber = `MX-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    let subtotal = 0;
    const orderItemsData = items.map((it: {
      productId?: string;
      slug?: string;
      title?: string;
      image?: string;
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
        image: it.image || null,
        price: Number(it.price),
        quantity: Number(it.quantity) || 1,
        subtotal: lineTotal,
      };
    });

    const shippingFee = subtotal >= 10000 ? 0 : 250;
    const total = subtotal + shippingFee;

    const shipAddr = (shippingAddress as Record<string, string>) || {};
    const billAddr = (billingAddress as Record<string, string>) || shipAddr;

    const normalizedMethod = String(paymentMethod || 'COD').toUpperCase();
    let dbPaymentMethod: PaymentMethod = PaymentMethod.COD;
    if (normalizedMethod === 'JAZZCASH') {
      dbPaymentMethod = PaymentMethod.JAZZCASH;
    } else if (normalizedMethod === 'EASYPAISA') {
      dbPaymentMethod = PaymentMethod.EASYPAISA;
    } else {
      dbPaymentMethod = PaymentMethod.COD;
    }

    const combinedNotes = normalizedMethod === 'BANK_DEPOSIT'
      ? `[Payment: Bank Deposit (Meezan Bank - PK14MEZN0003200115070230)] ${notes}`.trim()
      : notes;

    const order = await db.order.create({
      data: {
        orderNumber,
        userId: validUserId,
        email: trimmedEmail,
        phone: trimmedPhone,
        shipFullName: trimmedName,
        shipLine1: shipAddr.street || 'Pakistan Address',
        shipCity: shipAddr.city || 'Karachi',
        shipProvince: shipAddr.state || 'Sindh',
        billFullName: trimmedName,
        billLine1: billAddr.street || shipAddr.street || 'Pakistan Address',
        billCity: billAddr.city || shipAddr.city || 'Karachi',
        billProvince: billAddr.state || shipAddr.state || 'Sindh',
        status: 'PENDING',
        paymentMethod: dbPaymentMethod,
        paymentStatus: 'UNPAID',
        subtotal,
        shippingFee,
        total,
        notes: combinedNotes,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // 3. Persist shipping address for this user if registered
    if (validUserId && shipAddr.street) {
      try {
        const existingAddress = await db.address.findFirst({
          where: {
            userId: validUserId,
            line1: shipAddr.street,
            city: shipAddr.city,
          },
        });

        if (!existingAddress) {
          const hasDefault = await db.address.findFirst({
            where: { userId: validUserId, isDefaultShipping: true },
          });

          await db.address.create({
            data: {
              userId: validUserId,
              fullName: trimmedName,
              phone: trimmedPhone,
              line1: shipAddr.street,
              city: shipAddr.city || 'Karachi',
              province: shipAddr.state || 'Sindh',
              isDefaultShipping: !hasDefault,
              isDefaultBilling: !hasDefault,
            },
          });
        }
      } catch (addrErr) {
        console.warn('Address persistence non-fatal error:', addrErr);
      }
    }

    // 4. Save newsletter subscriber if opted in
    if (newsletter && trimmedEmail) {
      try {
        await db.newsletterSubscriber.upsert({
          where: { email: trimmedEmail },
          update: {},
          create: { email: trimmedEmail },
        });
      } catch (newsErr) {
        console.warn('Newsletter subscriber non-fatal error:', newsErr);
      }
    }

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
