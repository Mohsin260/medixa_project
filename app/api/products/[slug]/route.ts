import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getProductBySlug as fallbackGetProduct } from '@/lib/products';

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
        colors: true,
        sizes: true,
      },
    });

    if (!p) {
      const fallback = fallbackGetProduct(slug);
      if (fallback) return NextResponse.json(fallback);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const formatted = {
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      category: (p.category?.name?.includes('Women') ? 'Women' : p.category?.name?.includes('Men') ? 'Men' : 'Unisex') as 'Men' | 'Women' | 'Unisex',
      collection: p.collection?.name || 'Standard',
      price: Number(p.price),
      compareAt: p.compareAt ? Number(p.compareAt) : Number(p.price) + 1000,
      rating: p.rating,
      reviews: p.reviewCount,
      badge: p.badge || undefined,
      sku: `${p.slug.toUpperCase()}-STD`,
      image: p.image,
      images: p.images.length > 0 ? p.images.map((img) => img.url) : [p.image],
      colors: p.colors.length > 0 ? p.colors.map((c) => ({ name: c.name, value: c.hex })) : [{ name: 'Navy', value: '#1e3a5f' }],
      sizes: p.sizes.length > 0 ? p.sizes.map((s) => s.name) : ['XS', 'S', 'M', 'L', 'XL'],
      description: p.description,
      features: p.features,
      care: p.care || 'Machine wash cold with like colors.',
      shipping: p.shipping || 'Nationwide delivery in 3-5 working days.',
    };

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    const fallback = fallbackGetProduct(slug);
    if (fallback) return NextResponse.json(fallback);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
