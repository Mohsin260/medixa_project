import { db } from '@/lib/db';
import type { Product } from '@/lib/products';
import { ProductBundlePurchase, type SerializedBundleOffer } from './ProductBundlePurchase';

async function getActiveBundleOfferForSlug(slug: string): Promise<SerializedBundleOffer | null> {
  try {
    const dbProduct = await db.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!dbProduct) return null;

    const offer = await db.bundleOffer.findFirst({
      where: { productId: dbProduct.id, isActive: true },
      include: { tiers: { orderBy: { quantityRequired: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });

    if (!offer || offer.tiers.length === 0) return null;

    return {
      id: offer.id,
      title: offer.title,
      badgeText: offer.badgeText,
      tiers: offer.tiers.map((tier) => ({
        id: tier.id,
        quantityRequired: tier.quantityRequired,
        discountValue: Number(tier.discountValue),
        discountType: tier.discountType,
        label: tier.label,
      })),
    };
  } catch (error) {
    console.error('Failed to load bundle offer for product:', slug, error);
    return null;
  }
}

interface ProductBundleSectionProps {
  product: Product;
  slug: string;
}

export async function ProductBundleSection({ product, slug }: ProductBundleSectionProps) {
  const offer = await getActiveBundleOfferForSlug(slug);

  return <ProductBundlePurchase product={product} offer={offer} />;
}
