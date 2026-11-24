import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildColorImages } from '@/lib/server/products';

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
      const formatted = dbProducts.map((p) => {
        const imageList = p.images.length > 0 ? p.images.map((img) => img.url) : (p.image ? [p.image] : []);
        const featuredImage = p.image || imageList[0] || '';
        const finalImages = imageList.includes(featuredImage)
          ? [featuredImage, ...imageList.filter((url) => url !== featuredImage)]
          : [featuredImage, ...imageList].filter(Boolean);

        return {
          slug: p.slug,
          title: p.title,
          subtitle: p.subtitle,
          category: (p.category?.name?.includes('Women') ? 'Women' : p.category?.name?.includes('Men') ? 'Men' : 'Unisex') as 'Men' | 'Women' | 'Unisex',
          collection: p.collection?.name || 'Standard',
          price: Number(p.price),
          compareAt: p.compareAt ? Number(p.compareAt) : Number(p.price),
          rating: p.rating || 0,
          reviews: p.reviewCount || 0,
          badge: p.badge,
          sku: `${p.slug.toUpperCase()}-STD`,
          image: featuredImage,
          images: finalImages.length > 0 ? finalImages : [featuredImage].filter(Boolean),
          colorImages: buildColorImages(p.colors),
          colors: p.colors.map((c) => ({ name: c.name, value: c.hex })),
          sizes: p.sizes.map((s) => s.name),
          description: p.description || '',
          features: p.features || [],
          care: p.care || '',
          shipping: p.shipping || '',
        };
      });
      return NextResponse.json(formatted);
    }
    return NextResponse.json([]);
  } catch (err) {
    console.error('Error fetching public products:', err);
    return NextResponse.json([]);
  }
}
