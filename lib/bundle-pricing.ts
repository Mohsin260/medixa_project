/**
 * Pure, dependency-free bundling math shared by the storefront widget and the
 * server-side cart validator. Keep this module free of Prisma / server imports
 * so it is safe to use from client components.
 */

export type BundleDiscountType = 'percentage' | 'flat_amount';

export interface BundleTierInput {
  id: number;
  quantityRequired: number;
  discountValue: number;
  discountType: string;
  label?: string | null;
}

export interface BundlePricing {
  baseUnitPrice: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  savings: number;
  discountAmount: number;
  discountType: BundleDiscountType | null;
  discountValue: number;
  tier: BundleTierInput | null;
}

export function normalizeDiscountType(value: string): BundleDiscountType | null {
  return value === 'percentage' || value === 'flat_amount' ? value : null;
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Returns the best (highest qualifying) tier for the supplied quantity.
 * Tiers with invalid discount types or quantities are ignored.
 */
export function pickBestTier(
  tiers: BundleTierInput[],
  quantity: number,
): BundleTierInput | null {
  const safeQuantity = Math.floor(Number(quantity) || 0);
  if (safeQuantity < 1) return null;

  const eligible = tiers
    .filter((tier) => normalizeDiscountType(tier.discountType) !== null)
    .filter((tier) => {
      const required = Math.floor(Number(tier.quantityRequired));
      return Number.isFinite(required) && required > 0 && required <= safeQuantity;
    })
    .sort((a, b) => b.quantityRequired - a.quantityRequired);

  return eligible[0] ?? null;
}

/**
 * Calculates a line's pricing.
 *
 * - `percentage`: the percentage is taken off each unit.
 * - `flat_amount`: a flat PKR amount is taken off the whole bundle line.
 *
 * The result is always derived from the database price, never from client input.
 */
export function calculateBundlePricing(
  baseUnitPrice: number,
  quantity: number,
  tier: BundleTierInput | null,
): BundlePricing {
  const safeBase = Math.max(0, roundCurrency(Number(baseUnitPrice) || 0));
  const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  const gross = roundCurrency(safeBase * safeQuantity);

  const discountType = tier ? normalizeDiscountType(tier.discountType) : null;
  const discountValue = tier ? Math.max(0, Number(tier.discountValue) || 0) : 0;

  let discountAmount = 0;

  if (tier && discountType === 'percentage') {
    const percentage = Math.min(100, discountValue);
    discountAmount = roundCurrency((safeBase * percentage) / 100) * safeQuantity;
  } else if (tier && discountType === 'flat_amount') {
    discountAmount = Math.min(discountValue, gross);
  }

  discountAmount = roundCurrency(Math.min(discountAmount, gross));

  const totalPrice = roundCurrency(Math.max(0, gross - discountAmount));
  const unitPrice = roundCurrency(totalPrice / safeQuantity);

  return {
    baseUnitPrice: safeBase,
    quantity: safeQuantity,
    unitPrice,
    totalPrice,
    savings: roundCurrency(gross - totalPrice),
    discountAmount,
    discountType,
    discountValue,
    tier: tier && discountType ? tier : null,
  };
}
