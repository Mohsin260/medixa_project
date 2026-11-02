import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { OrderStatus, PaymentStatus } from '@/generated/prisma/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { status, paymentStatus, trackingNumber, notes } = body;

  try {
    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status as OrderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus as PaymentStatus;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await db.order.update({
      where: { id },
      data: updateData,
      include: { items: true },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error('Update order error:', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = await params;

  try {
    await db.$transaction([
      db.orderItem.deleteMany({ where: { orderId: id } }),
      db.order.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    console.error('Delete order error:', err);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

