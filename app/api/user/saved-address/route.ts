import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false, address: null });
    }

    const userId = String(session.user.id);
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    // Do not pre-fill storefront checkout with admin credentials
    if (user?.role === 'ADMIN' || user?.email?.toLowerCase() === 'admin@medixa.pk') {
      return NextResponse.json({ authenticated: false, address: null, user: null });
    }

    const savedAddress = await db.address.findFirst({
      where: { userId },
      orderBy: [{ isDefaultShipping: 'desc' }, { updatedAt: 'desc' }],
    });

    if (savedAddress) {
      return NextResponse.json({
        authenticated: true,
        address: {
          name: savedAddress.fullName,
          phone: savedAddress.phone,
          email: user?.email || session.user.email || '',
          street: savedAddress.line1,
          city: savedAddress.city,
          state: savedAddress.province,
          newsletter: false,
          shipToDifferent: false,
          shipping: null,
          notes: '',
        },
        user,
      });
    }

    // Fallback: check latest order for this user
    const latestOrder = await db.order.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (latestOrder) {
      return NextResponse.json({
        authenticated: true,
        address: {
          name: latestOrder.shipFullName,
          phone: latestOrder.phone,
          email: latestOrder.email,
          street: latestOrder.shipLine1,
          city: latestOrder.shipCity,
          state: latestOrder.shipProvince,
          newsletter: false,
          shipToDifferent: false,
          shipping: null,
          notes: latestOrder.notes || '',
        },
        user,
      });
    }

    return NextResponse.json({
      authenticated: true,
      address: null,
      user: {
        name: user?.name || session.user.name || '',
        email: user?.email || session.user.email || '',
        phone: user?.phone || '',
      },
    });
  } catch (err) {
    console.error('Failed to get saved address:', err);
    return NextResponse.json({ authenticated: false, address: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ authenticated: false, message: 'Not logged in' });
    }

    const userId = String(session.user.id);
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { name, phone, street, city, state } = body;
    if (!street || !city || !state) {
      return NextResponse.json({ error: 'Street, city and state are required' }, { status: 400 });
    }

    // Update user name/phone if empty
    if (name || phone) {
      await db.user.update({
        where: { id: userId },
        data: {
          ...(name ? { name } : {}),
          ...(phone ? { phone } : {}),
        },
      }).catch(() => {});
    }

    // Check existing address
    const existing = await db.address.findFirst({
      where: { userId },
    });

    if (existing) {
      const updated = await db.address.update({
        where: { id: existing.id },
        data: {
          fullName: name || existing.fullName,
          phone: phone || existing.phone,
          line1: street,
          city,
          province: state,
        },
      });
      return NextResponse.json({ success: true, address: updated });
    }

    const created = await db.address.create({
      data: {
        userId,
        fullName: name || 'Valued Customer',
        phone: phone || '',
        line1: street,
        city,
        province: state,
        isDefaultShipping: true,
        isDefaultBilling: true,
      },
    });

    return NextResponse.json({ success: true, address: created });
  } catch (err) {
    console.error('Failed to save address:', err);
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}
