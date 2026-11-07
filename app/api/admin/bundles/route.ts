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

function prismaErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : null;
  }
  return null;
}

const includeBundle = {
  product: { select: { id: true, title: true, slug: true, price: true } },
  tiers: { orderBy: { quantityRequired: 'asc' as const } },
};

export async function GET(request: NextRequest) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId')?.trim();
  const activeOnly = searchParams.get('activeOnly') === 'true';

  try {
    const offers = await db.bundleOffer.findMany({
      where: {
        ...(productId ? { productId } : {}),
        ...(activeOnly ? { isActive: true } : {}),
      },
      include: includeBundle,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      offers: offers.map((offer) => serializeOffer(offer as BundleOfferRecord)),
      totalCount: offers.length,
    });
  } catch (error) {
    console.error('Failed to fetch bundle offers:', error);
    return NextResponse.json({ error: 'Failed to fetch bundle offers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
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
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Atomic write: the offer and all of its tiers either commit together or
    // not at all. No orphaned offers or partial tier sets are possible.
    const created = await db.$transaction(async (tx) => {
      const offer = await tx.bundleOffer.create({
        data: {
          productId,
          title,
          badgeText: badgeText?.trim() || null,
          isActive,
        },
      });

      await tx.bundleTier.createMany({
        data: tiers.map((tier) => ({
          bundleOfferId: offer.id,
          quantityRequired: tier.quantityRequired,
          discountValue: tier.discountValue,
          discountType: tier.discountType,
          label: tier.label?.trim() || null,
        })),
      });

      return tx.bundleOffer.findUnique({
        where: { id: offer.id },
        include: includeBundle,
      });
    });

    if (!created) {
      return NextResponse.json({ error: 'Bundle offer could not be created' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, offer: serializeOffer(created as BundleOfferRecord) },
      { status: 201 },
    );
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

    console.error('Create bundle offer error:', error);
    return NextResponse.json({ error: 'Failed to create bundle offer' }, { status: 500 });
  }
}
