'use client';

import { useCart } from '@/lib/cart';
import { formatPrice, type Product } from '@/lib/products';
import { useEffect, useRef, useState } from 'react';
import { useProductSelection } from './ProductSelection';
import styles from './ProductPurchasePanel.module.css';

export interface ProductBundleSelection {
  offerId: number;
  tierId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ProductPurchasePanelProps {
  product: Product;
  bundle?: ProductBundleSelection | null;
}

export default function ProductPurchasePanel({
  product,
  bundle = null,
}: ProductPurchasePanelProps) {
  const selection = useProductSelection();
  const [localColor, setLocalColor] = useState(product.colors[0]?.name || '');
  const color = selection?.color ?? localColor;
  const setColor = selection?.setColor ?? setLocalColor;
  const [size, setSize] = useState(
    product.sizes.includes('M') ? 'M' : product.sizes[0] || '',
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (addedTimer.current) {
        clearTimeout(addedTimer.current);
      }
    },
    [],
  );

  const isBundle = Boolean(bundle);
  const effectiveQuantity = bundle ? bundle.quantity : quantity;
  const effectiveUnitPrice = bundle ? bundle.unitPrice : product.price;
  const total = bundle ? bundle.totalPrice : product.price * quantity;

  const resetAdded = () => {
    setAdded(false);
    if (addedTimer.current) {
      clearTimeout(addedTimer.current);
      addedTimer.current = null;
    }
  };

  const handleAdd = (goToCheckout = false) => {
    addToCart({
      slug: product.slug,
      title: product.title,
      image: product.image,
      price: effectiveUnitPrice,
      compareAt: product.compareAt,
      color,
      size,
      quantity: effectiveQuantity,
      bundleOfferId: bundle?.offerId ?? null,
      bundleTierId: bundle?.tierId ?? null,
    });

    if (goToCheckout) {
      window.location.href = '/checkout';
      return;
    }

    setAdded(true);
    if (addedTimer.current) {
      clearTimeout(addedTimer.current);
    }
    addedTimer.current = setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.optionGroup}>
        <div className={styles.optionHead}>
          <span className={styles.optionLabel}>Colour</span>
          <span className={styles.optionValue}>{color}</span>
        </div>
        <div className={styles.colorList}>
          {product.colors.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`${styles.colorButton} ${color === item.name ? styles.colorActive : ''}`}
              onClick={() => {
                setColor(item.name);
                resetAdded();
              }}
              aria-label={`Colour ${item.name}`}
              aria-pressed={color === item.name}
              title={item.name}
            >
              <span className={styles.swatch} style={{ backgroundColor: item.value }} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.optionGroup}>
        <div className={styles.optionHead}>
          <span className={styles.optionLabel}>Size</span>
          <span className={styles.optionValue}>{size}</span>
        </div>
        <div className={styles.sizeList}>
          {product.sizes.map((item) => (
            <button
              key={item}
              type="button"
              className={`${styles.sizeButton} ${size === item ? styles.sizeActive : ''}`}
              onClick={() => {
                setSize(item);
                resetAdded();
              }}
              aria-pressed={size === item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.optionGroup}>
        <div className={styles.optionHead}>
          <span className={styles.optionLabel}>Quantity</span>
          <span className={styles.optionValue}>{formatPrice(total)}</span>
        </div>
        <div className={styles.quantityRow}>
          <div
            className={styles.quantity}
            title={isBundle ? 'Quantity is set by the selected bundle' : undefined}
          >
            <button
              type="button"
              onClick={() => {
                setQuantity((value) => Math.max(1, value - 1));
                resetAdded();
              }}
              disabled={isBundle || quantity <= 1}
              aria-label="Decrease quantity"
            >
              <i className="fa fa-minus" aria-hidden="true" />
            </button>
            <span aria-live="polite">{effectiveQuantity}</span>
            <button
              type="button"
              onClick={() => {
                setQuantity((value) => Math.min(10, value + 1));
                resetAdded();
              }}
              disabled={isBundle || quantity >= 10}
              aria-label="Increase quantity"
            >
              <i className="fa fa-plus" aria-hidden="true" />
            </button>
          </div>
          <p className={styles.stock}>
            <i className="fa fa-check-circle" aria-hidden="true" /> In stock
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => handleAdd(false)}
          aria-live="polite"
        >
          <i className={`fa ${added ? 'fa-check' : 'fa-shopping-bag'}`} aria-hidden="true" />
          {added ? 'Added to Cart' : 'Add to Cart'}
        </button>
        <button type="button" className={styles.buyButton} onClick={() => handleAdd(true)}>
          Buy Now
        </button>
      </div>

      <p className={styles.summary} aria-live="polite">
        {color} · Size {size} · Qty {effectiveQuantity}
        {isBundle ? ' · Bundle pricing' : ''}
      </p>
    </div>
  );
}
