import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mapStorefrontProduct } from '@/lib/server/products';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const p = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { sortOrder: 'asc' } },
        colors: { orderBy: { sortOrder: 'asc' } },
        sizes: true,
      },
    });

    if (!p) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const formatted = mapStorefrontProduct(p, undefined);

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
