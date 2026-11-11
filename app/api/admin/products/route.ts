import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { ProductStatus } from '@/generated/prisma/client';

export async function GET(request: NextRequest) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const category = searchParams.get('category') || '';

  try {
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'ALL') {
      whereClause.status = status as ProductStatus;
    }

    if (category && category !== 'ALL') {
      whereClause.category = {
        name: { equals: category, mode: 'insensitive' },
      };
    }

    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          collection: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { select: { id: true, size: true, color: true, inventory: true, price: true } },
          _count: { select: { orderItems: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.product.count({ where: whereClause }),
    ]);

    const formatted = products.map((p) => {
      const totalInventory = p.variants.reduce((acc, v) => acc + (v.inventory || 0), 0);
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        price: Number(p.price),
        compareAt: p.compareAt ? Number(p.compareAt) : null,
        badge: p.badge,
        rating: p.rating,
        reviewCount: p.reviewCount,
        status: p.status,
        image: p.image,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder,
        })),
        features: p.features,
        category: p.category?.name || 'General',
        categoryId: p.categoryId,
        collection: p.collection?.name || 'Standard',
        collectionId: p.collectionId,
        stock: totalInventory > 0 ? `${totalInventory} in stock` : 'Out of stock',
        inventory: totalInventory,
        salesCount: p._count.orderItems,
        createdAt: p.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ products: formatted, totalCount });
  } catch (err) {
    console.error('Failed to fetch admin products:', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    title,
    slug: rawSlug,
    subtitle = '',
    description = '',
    price,
    compareAt,
    badge,
    status = 'PUBLISHED',
    categoryName = "Men's Scrubs",
    collectionName = 'Standard',
    image = '',
    images = [],
    features = [],
    inventory = 50,
  } = body;

  if (!title || price === undefined) {
    return NextResponse.json({ error: 'Product title and price are required' }, { status: 400 });
  }

  const slug =
    rawSlug?.trim() ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  try {
    // 1. Ensure Category exists
    let category = await db.category.findFirst({
      where: { name: { equals: categoryName, mode: 'insensitive' } },
    });
    if (!category) {
      category = await db.category.create({
        data: {
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        },
      });
    }

    // 2. Ensure Collection exists
    let collection = await db.collection.findFirst({
      where: { name: { equals: collectionName, mode: 'insensitive' } },
    });
    if (!collection) {
      collection = await db.collection.create({
        data: {
          name: collectionName,
          slug: collectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        },
      });
    }

    // 3. Normalize images and determine primary featured image
    const rawImagesList = Array.isArray(images) ? images : [];
    const normalizedImages = rawImagesList
      .map((item: unknown, index: number) => {
        if (typeof item === 'string') return { url: item, alt: title, sortOrder: index };
        if (item && typeof item === 'object' && 'url' in item) {
          const typed = item as { url: string; alt?: string; sortOrder?: number };
          return { url: typed.url, alt: typed.alt || title, sortOrder: typed.sortOrder ?? index };
        }
        return null;
      })
      .filter((item): item is { url: string; alt: string; sortOrder: number } => Boolean(item && item.url));

    let featuredImage = image?.trim();
    if (!featuredImage) {
      featuredImage = normalizedImages[0]?.url || '/img/real-product-images/Forte/Forte-Naval-1.webp';
    }

    // Ensure the featured image is part of normalizedImages at index 0 if not present
    const existingIndex = normalizedImages.findIndex((img) => img.url === featuredImage);
    if (existingIndex > 0) {
      // Move to top
      const [item] = normalizedImages.splice(existingIndex, 1);
      normalizedImages.unshift(item);
    } else if (existingIndex === -1 && featuredImage) {
      normalizedImages.unshift({ url: featuredImage, alt: title, sortOrder: 0 });
    }

    // Re-index sortOrder
    const finalImagesToCreate = normalizedImages.map((img, idx) => ({
      url: img.url,
      alt: img.alt || title,
      sortOrder: idx,
    }));

    // 4. Create Product
    const product = await db.product.create({
      data: {
        title,
        slug,
        subtitle,
        description,
        price: Number(price),
        compareAt: compareAt ? Number(compareAt) : null,
        badge: badge || null,
        status: status as ProductStatus,
        image: featuredImage,
        features: Array.isArray(features) ? features : [features].filter(Boolean),
        categoryId: category.id,
        collectionId: collection.id,
        images: {
          create: finalImagesToCreate,
        },
        variants: {
          create: [
            {
              sku: `${slug.toUpperCase()}-STD`,
              price: Number(price),
              inventory: Number(inventory) || 50,
            },
          ],
        },
      },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: unknown) {
    console.error('Create product error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create product';
    return NextResponse.json(
      { error: message.includes('Unique constraint') ? 'A product with this slug already exists' : message },
      { status: 500 },
    );
  }
}
