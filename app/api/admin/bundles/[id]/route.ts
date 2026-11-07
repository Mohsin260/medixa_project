import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/require-admin';
import { bundleOfferInputSchema } from '@/lib/bundle-offer-schema';
import { db } from '@/lib/db';

interface BundleOfferRecord {
  id: number;
  productId: string;
  title: string;
  badgeText: string | null;
  isActive: boolean;
  createdAt: Date;
  product: { id: string; title: string; slug: string; price: unknown };
  tiers: Array<{
    id: number;
    quantityRequired: number;
    discountValue: unknown;
    discountType: string;
    label: string | null;
  }>;
}

const includeBundle = {
  product: { select: { id: true, title: true, slug: true, price: true } },
  tiers: { orderBy: { quantityRequired: 'asc' as const } },
};

function serializeOffer(offer: BundleOfferRecord) {
  return {
    id: offer.id,
    productId: offer.productId,
    product: {
      id: offer.product.id,
      title: offer.product.title,
      slug: offer.product.slug,
      price: Number(offer.product.price),
    },
    title: offer.title,
    badgeText: offer.badgeText,
    isActive: offer.isActive,
    createdAt: offer.createdAt.toISOString(),
    tiers: [...offer.tiers]
      .sort((a, b) => a.quantityRequired - b.quantityRequired)
      .map((tier) => ({
        id: tier.id,
        quantityRequired: tier.quantityRequired,
        discountValue: Number(tier.discountValue),
        discountType: tier.discountType,
        label: tier.label,
      })),
  };
}

function parseOfferId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function prismaErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : null;
  }
  return null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id: rawId } = await params;
  const id = parseOfferId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'Invalid bundle offer id' }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }

  const parsed = bundleOfferInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  const { productId, title, badgeText, isActive, tiers } = parsed.data;

  try {
    const [existing, product] = await Promise.all([
      db.bundleOffer.findUnique({ where: { id }, select: { id: true } }),
      db.product.findUnique({ where: { id: productId }, select: { id: true } }),
    ]);

    if (!existing) {
      return NextResponse.json({ error: 'Bundle offer not found' }, { status: 404 });
    }
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated = await db.$transaction(async (tx) => {
      await tx.bundleOffer.update({
        where: { id },
        data: {
          productId,
          title,
          badgeText: badgeText?.trim() || null,
          isActive,
        },
      });

      await tx.bundleTier.deleteMany({ where: { bundleOfferId: id } });

      await tx.bundleTier.createMany({
        data: tiers.map((tier) => ({
          bundleOfferId: id,
          quantityRequired: tier.quantityRequired,
          discountValue: tier.discountValue,
          discountType: tier.discountType,
          label: tier.label?.trim() || null,
        })),
      });

      return tx.bundleOffer.findUnique({
        where: { id },
        include: includeBundle,
      });
    });

    if (!updated) {
      return NextResponse.json({ error: 'Bundle offer could not be updated' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      offer: serializeOffer(updated as BundleOfferRecord),
    });
  } catch (error) {
    const code = prismaErrorCode(error);
    if (code === 'P2002') {
      return NextResponse.json(
        { error: 'A tier with the same quantity already exists for this bundle.' },
        { status: 409 },
      );
    }
    if (code === 'P2003') {
      return NextResponse.json({ error: 'Invalid product reference.' }, { status: 400 });
    }
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Bundle offer not found' }, { status: 404 });
    }

    console.error('Update bundle offer error:', error);
    return NextResponse.json({ error: 'Failed to update bundle offer' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id: rawId } = await params;
  const id = parseOfferId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'Invalid bundle offer id' }, { status: 400 });
  }

  try {
    const existing = await db.bundleOffer.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
      return NextResponse.json({ error: 'Bundle offer not found' }, { status: 404 });
    }

    await db.bundleOffer.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Bundle offer deleted' });
  } catch (error) {
    const code = prismaErrorCode(error);
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Bundle offer not found' }, { status: 404 });
    }

    console.error('Delete bundle offer error:', error);
    return NextResponse.json({ error: 'Failed to delete bundle offer' }, { status: 500 });
  }
}
