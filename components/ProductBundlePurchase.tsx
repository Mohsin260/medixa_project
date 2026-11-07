'use client';

import { useState } from 'react';
import NativeBundleWidget, { type NativeBundleSelection } from './NativeBundleWidget';
import ProductPurchasePanel, { type ProductBundleSelection } from './ProductPurchasePanel';
import type { Product } from '@/lib/products';

export interface SerializedBundleTier {
  id: number;
  quantityRequired: number;
  discountValue: number;
  discountType: string;
  label: string | null;
}

export interface SerializedBundleOffer {
  id: number;
  title: string;
  badgeText: string | null;
  tiers: SerializedBundleTier[];
}

interface ProductBundlePurchaseProps {
  product: Product;
  offer: SerializedBundleOffer | null;
}

export function ProductBundlePurchase({ product, offer }: ProductBundlePurchaseProps) {
  const [selection, setSelection] = useState<NativeBundleSelection | null>(null);

  if (!offer || offer.tiers.length === 0) {
    return <ProductPurchasePanel product={product} />;
  }

  const bundle: ProductBundleSelection | null =
    selection && selection.tierId !== null
      ? {
          offerId: offer.id,
          tierId: selection.tierId,
          quantity: selection.quantity,
          unitPrice:
            selection.quantity > 0
              ? selection.totalPrice / selection.quantity
              : selection.unitPrice,
          totalPrice: selection.totalPrice,
        }
      : null;

  return (
    <>
      <NativeBundleWidget
        productPrice={product.price}
        tiers={offer.tiers}
        title={offer.title || 'Bundle & save'}
        onSelectionChange={setSelection}
      />
      <ProductPurchasePanel product={product} bundle={bundle} />
    </>
  );
}
