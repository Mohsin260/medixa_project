/**
 * Server-side cart & bundle pricing validation.
 *
 * SECURITY: never trust prices, totals, or discounts sent by the browser.
 * Every value returned here is recomputed from the Neon/PostgreSQL database.
 *
 * This module imports Prisma and must only be used from server code
 * (API routes, server components, server actions).
 */

import { db } from '@/lib/db';
import {
  calculateBundlePricing,
  normalizeDiscountType,
  pickBestTier,
  roundCurrency,
  type BundlePricing,
  type BundleTierInput,
} from '@/lib/bundle-pricing';

const MAX_CART_LINES = 100;
const MAX_LINE_QUANTITY = 9999;
const PRICE_TOLERANCE = 0.01;

export interface CartLineInput {
  /** Preferred: the database product id. */
  productId?: string | null;
  /** Fallback lookup key when only a slug is available. */
  slug?: string | null;
  quantity: number;
  /** Optional claimed bundle (validated against the active offer). */
  bundleOfferId?: number | null;
  /** Optional claimed tier (only applied if the quantity qualifies). */
  bundleTierId?: number | null;
  /** Optional client-claimed prices, used only to detect tampering. */
  claimedUnitPrice?: number | null;
  claimedTotal?: number | null;
}

export interface ValidatedCartLine extends BundlePricing {
  productId: string;
  productTitle: string;
  bundleOfferId: number | null;
  bundleTierId: number | null;
  tierApplied: boolean;
  priceMismatch: boolean;
}

export interface CartValidationResult {
  valid: boolean;
  lines: ValidatedCartLine[];
  subtotal: number;
  totalSavings: number;
  errors: string[];
}

export type BundleLineResult =
  | { ok: true; line: ValidatedCartLine }
  | { ok: false; error: string };

function toInteger(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.floor(parsed);
}

function toTierInput(tier: {
  id: number;
  quantityRequired: number;
  discountValue: unknown;
  discountType: string;
  label: string | null;
}): BundleTierInput {
  return {
    id: tier.id,
    quantityRequired: tier.quantityRequired,
    discountValue: Number(tier.discountValue),
    discountType: tier.discountType,
    label: tier.label,
  };
}

/**
 * Loads the single active offer for a product (optionally a specific offer)
 * together with its tiers.
 */
export async function getActiveBundleOffer(productId: string, bundleOfferId?: number | null) {
  return db.bundleOffer.findFirst({
    where: {
      productId,
      isActive: true,
      ...(bundleOfferId ? { id: bundleOfferId } : {}),
    },
    include: {
      tiers: { orderBy: { quantityRequired: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Resolves a single cart line against the database.
 *
 * - Fetches the authoritative product price.
 * - Finds the active bundle offer and applies the best qualifying tier.
 * - Ignores claimed tiers that the quantity does not qualify for.
 * - Flags (and rejects) client-claimed prices that do not match the database.
 */
export async function resolveBundleLine(input: CartLineInput): Promise<BundleLineResult> {
  const quantity = toInteger(input.quantity);

  if (quantity === null || quantity < 1 || quantity > MAX_LINE_QUANTITY) {
    return {
      ok: false,
      error: `Invalid quantity${quantity === null ? '' : ` (${quantity})`}. Quantity must be between 1 and ${MAX_LINE_QUANTITY}.`,
    };
  }

  const productId = input.productId?.trim();
  const slug = input.slug?.trim();

  if (!productId && !slug) {
    return { ok: false, error: 'Each cart line must include a productId or slug.' };
  }

  const product = await db.product.findFirst({
    where: productId ? { id: productId } : { slug: slug as string },
    select: { id: true, title: true, price: true },
  });

  if (!product) {
    return { ok: false, error: `Product not found (${productId || slug}).` };
  }

  const offer = await getActiveBundleOffer(
    product.id,
    Number.isFinite(input.bundleOfferId) ? Number(input.bundleOfferId) : null,
  );

  const tiers: BundleTierInput[] = (offer?.tiers ?? [])
    .map(toTierInput)
    .filter((tier) => normalizeDiscountType(tier.discountType) !== null);

  let appliedTier: BundleTierInput | null = null;

  if (input.bundleTierId != null && Number.isFinite(input.bundleTierId)) {
    const claimed = tiers.find((tier) => tier.id === Number(input.bundleTierId)) ?? null;
    // Only honour the claimed tier when the quantity actually qualifies.
    if (claimed && quantity >= claimed.quantityRequired) {
      appliedTier = claimed;
    }
  }

  if (!appliedTier) {
    appliedTier = pickBestTier(tiers, quantity);
  }

  const pricing = calculateBundlePricing(Number(product.price), quantity, appliedTier);

  const claimedUnitPrice =
    input.claimedUnitPrice != null && Number.isFinite(input.claimedUnitPrice)
      ? Number(input.claimedUnitPrice)
      : null;
  const claimedTotal =
    input.claimedTotal != null && Number.isFinite(input.claimedTotal)
      ? Number(input.claimedTotal)
      : null;

  const priceMismatch =
    (claimedUnitPrice !== null && Math.abs(claimedUnitPrice - pricing.unitPrice) > PRICE_TOLERANCE) ||
    (claimedTotal !== null && Math.abs(claimedTotal - pricing.totalPrice) > PRICE_TOLERANCE);

  return {
    ok: true,
    line: {
      ...pricing,
      productId: product.id,
      productTitle: product.title,
      bundleOfferId: offer?.id ?? null,
      bundleTierId: appliedTier?.id ?? null,
      tierApplied: Boolean(appliedTier),
      priceMismatch,
    },
  };
}

/**
 * Validates an entire cart and returns authoritative totals.
 * Returns `valid: false` if any line is invalid or any client price is tampered.
 */
export async function validateCartPricing(
  items: CartLineInput[],
): Promise<CartValidationResult> {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      valid: false,
      lines: [],
      subtotal: 0,
      totalSavings: 0,
      errors: ['Cart is empty.'],
    };
  }

  if (items.length > MAX_CART_LINES) {
    return {
      valid: false,
      lines: [],
      subtotal: 0,
      totalSavings: 0,
      errors: [`Cart exceeds the maximum of ${MAX_CART_LINES} line items.`],
    };
  }

  const results = await Promise.all(items.map((item) => resolveBundleLine(item)));

  const lines: ValidatedCartLine[] = [];
  const errors: string[] = [];

  results.forEach((result, index) => {
    if (!result.ok) {
      errors.push(`Item ${index + 1}: ${result.error}`);
      return;
    }

    if (result.line.priceMismatch) {
      errors.push(
        `Item ${index + 1}: price mismatch for "${result.line.productTitle}". Prices are recalculated on the server.`,
      );
    }

    lines.push(result.line);
  });

  const subtotal = roundCurrency(lines.reduce((sum, line) => sum + line.totalPrice, 0));
  const totalSavings = roundCurrency(lines.reduce((sum, line) => sum + line.savings, 0));

  return {
    valid: errors.length === 0,
    lines,
    subtotal,
    totalSavings,
    errors,
  };
}

/**
 * Convenience wrapper that throws when a cart is invalid. Useful inside an
 * order-creation transaction or server action.
 */
export async function assertValidCartPricing(items: CartLineInput[]): Promise<CartValidationResult> {
  const result = await validateCartPricing(items);
  if (!result.valid) {
    throw new Error(result.errors.join(' '));
  }
  return result;
}
