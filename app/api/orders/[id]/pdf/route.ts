import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateInvoicePdfBuffer } from '@/lib/invoice-pdf';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Order reference is required' }, { status: 400 });
  }

  const normalizedId = decodeURIComponent(id).trim();

  try {
    const order = await db.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: normalizedId, mode: 'insensitive' } },
          { id: normalizedId },
        ],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const pdfBuffer = generateInvoicePdfBuffer({
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      customerName: order.shipFullName,
      customerEmail: order.email,
      customerPhone: order.phone,
      shippingAddress: {
        street: order.shipLine1,
        city: order.shipCity,
        province: order.shipProvince,
      },
      subtotal: Number(order.subtotal),
      shippingFee: Number(order.shippingFee),
      total: Number(order.total),
      items: order.items.map((it) => ({
        title: it.title,
        sku: it.sku,
        size: it.size || 'M',
        color: it.color || 'Standard',
        quantity: it.quantity,
        price: Number(it.price),
      })),
    });

    const isInline = request.nextUrl.searchParams.get('inline') === '1';
    const disposition = isInline
      ? `inline; filename="Medixa-Order-${order.orderNumber}.pdf"`
      : `attachment; filename="Medixa-Order-${order.orderNumber}.pdf"`;

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': disposition,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err) {
    console.error('Invoice PDF generation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate order PDF. Please try again.' },
      { status: 500 },
    );
  }
}
