import { z } from 'zod';

export const bundleTierSchema = z.object({
  quantityRequired: z.coerce.number().int().positive().max(9999),
  discountValue: z.coerce.number().min(0),
  discountType: z.enum(['percentage', 'flat_amount']),
  label: z.string().trim().max(255).optional().nullable(),
});

export const bundleOfferInputSchema = z.object({
  productId: z.string().trim().min(1).max(255),
  title: z.string().trim().min(1).max(255),
  badgeText: z.string().trim().max(100).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  tiers: z
    .array(bundleTierSchema)
    .min(1, 'At least one quantity tier is required.')
    .max(20, 'A bundle can have at most 20 tiers.')
    .superRefine((tiers, ctx) => {
      const seen = new Set<number>();

      tiers.forEach((tier, index) => {
        if (seen.has(tier.quantityRequired)) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'quantityRequired'],
            message: `Duplicate quantity tier (${tier.quantityRequired}).`,
          });
        }
        seen.add(tier.quantityRequired);

        if (tier.discountType === 'percentage' && tier.discountValue > 100) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'discountValue'],
            message: 'Percentage discounts cannot exceed 100%.',
          });
        }
      });
    }),
});

export type BundleOfferInput = z.infer<typeof bundleOfferInputSchema>;
