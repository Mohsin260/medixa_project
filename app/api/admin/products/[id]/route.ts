import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireStaff } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { ProductStatus } from '@/generated/prisma/client';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = await params;

  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        collection: true,
        variants: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.error('Fetch product by id error:', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    title,
    subtitle,
    description,
    price,
    compareAt,
    badge,
    status,
    image,
    features,
    inventory,
    categoryName,
    collectionName,
  } = body;

  try {
    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (compareAt !== undefined) updateData.compareAt = compareAt ? Number(compareAt) : null;
    if (badge !== undefined) updateData.badge = badge || null;
    if (status !== undefined) updateData.status = status as ProductStatus;
    if (image !== undefined) updateData.image = image;
    if (features !== undefined) {
      updateData.features = Array.isArray(features) ? features : [features].filter(Boolean);
    }

    if (categoryName) {
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
      updateData.categoryId = category.id;
    }

    if (collectionName) {
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
      updateData.collectionId = collection.id;
    }

    const updated = await db.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        collection: true,
        variants: true,
      },
    });

    // Update inventory on first variant if specified
    if (inventory !== undefined && updated.variants.length > 0) {
      await db.productVariant.update({
        where: { id: updated.variants[0].id },
        data: { inventory: Number(inventory) || 0 },
      });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err) {
    console.error('Update product error:', err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
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
    // Delete variants, colors, sizes, images cascade or explicitly
    await db.$transaction([
      db.productVariant.deleteMany({ where: { productId: id } }),
      db.productImage.deleteMany({ where: { productId: id } }),
      db.productColor.deleteMany({ where: { productId: id } }),
      db.productSize.deleteMany({ where: { productId: id } }),
      db.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

