import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products as fallbackProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const collection = searchParams.get('collection');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');
  const limit = Number(searchParams.get('limit')) || 50;

  try {
    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
    };

    if (category) {
      where.category = {
        name: { equals: category, mode: 'insensitive' },
      };
    }

    if (collection) {
      where.collection = {
        slug: { equals: collection, mode: 'insensitive' },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'popular') orderBy = { reviewCount: 'desc' };

    const dbProducts = await db.product.findMany({
      where,
      take: limit,
      orderBy,
      include: {
        category: true,
        collection: true,
        images: { orderBy: { sortOrder: 'asc' } },
        colors: true,
        sizes: true,
      },
    });

    if (dbProducts.length > 0) {
      const formatted = dbProducts.map((p) => ({
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
      }));
      return NextResponse.json(formatted);
    }

    // Fallback to static seed array if DB had 0 matching products
    return NextResponse.json(fallbackProducts);
  } catch (err) {
    console.error('Error fetching public products:', err);
    return NextResponse.json(fallbackProducts);
  }
}
