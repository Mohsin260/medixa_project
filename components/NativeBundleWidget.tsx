'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  calculateBundlePricing,
  normalizeDiscountType,
  type BundleTierInput,
} from '@/lib/bundle-pricing';
import styles from './NativeBundleWidget.module.css';

export interface NativeBundleTier {
  id: number;
  quantityRequired: number;
  discountValue: number;
  discountType: string;
  label?: string | null;
}

export interface NativeBundleSelection {
  tierId: number | null;
  quantity: number;
  baseUnitPrice: number;
  unitPrice: number;
  totalPrice: number;
  savings: number;
}

export interface NativeBundleWidgetProps {
  productPrice: number;
  tiers: NativeBundleTier[];
  title?: string;
  currency?: string;
  className?: string;
  onSelectionChange?: (selection: NativeBundleSelection) => void;
}

function formatMoney(value: number, currency: string): string {
  const formatted = value.toLocaleString('en-PK', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `${currency} ${formatted}`;
}

function tierDiscountLabel(tier: BundleTierInput, currency: string): string {
  if (tier.discountType === 'percentage') {
    return `${Number(tier.discountValue)}% off`;
  }
  return `${formatMoney(Number(tier.discountValue), currency)} off`;
}

function joinClasses(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export default function NativeBundleWidget({
  productPrice,
  tiers,
  title = 'Bundle & save',
  currency = 'Rs',
  className,
  onSelectionChange,
}: NativeBundleWidgetProps) {
  const normalizedTiers = useMemo<BundleTierInput[]>(() => {
    return [...(Array.isArray(tiers) ? tiers : [])]
      .filter((tier) => normalizeDiscountType(tier.discountType) !== null)
      .filter((tier) => Number.isFinite(Number(tier.quantityRequired)) && Number(tier.quantityRequired) > 0)
      .map((tier) => ({
        id: Number(tier.id),
        quantityRequired: Math.floor(Number(tier.quantityRequired)),
        discountValue: Math.max(0, Number(tier.discountValue) || 0),
        discountType: tier.discountType,
        label: tier.label ?? null,
      }))
      .sort((a, b) => a.quantityRequired - b.quantityRequired);
  }, [tiers]);

  const [selectedTierId, setSelectedTierId] = useState<number | null>(null);

  const activeTier = useMemo(() => {
    if (selectedTierId === null) return null;
    return normalizedTiers.find((tier) => tier.id === selectedTierId) ?? null;
  }, [normalizedTiers, selectedTierId]);

  const quantity = activeTier?.quantityRequired ?? 1;

  const pricing = useMemo(
    () => calculateBundlePricing(productPrice, quantity, activeTier),
    [productPrice, quantity, activeTier],
  );

  const onChangeRef = useRef(onSelectionChange);
  useEffect(() => {
    onChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  useEffect(() => {
    onChangeRef.current?.({
      tierId: activeTier?.id ?? null,
      quantity: pricing.quantity,
      baseUnitPrice: pricing.baseUnitPrice,
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
      savings: pricing.savings,
    });
  }, [activeTier, pricing]);

  if (normalizedTiers.length === 0) return null;

  const savingsPercent =
    pricing.savings > 0 && pricing.baseUnitPrice > 0
      ? Math.round((pricing.savings / (pricing.baseUnitPrice * pricing.quantity)) * 100)
      : 0;

  return (
    <section className={joinClasses(styles.widget, className)} aria-label={title}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>Buy more, pay less. Select a bundle below.</p>
        </div>
        {pricing.savings > 0 ? (
          <span className={styles.badge}>Save {savingsPercent}%</span>
        ) : null}
      </div>

      <div className={styles.grid} role="group" aria-label="Bundle quantity options">
        {normalizedTiers.map((tier) => {
          const isSelected = activeTier?.id === tier.id;
          const tierPricing = calculateBundlePricing(productPrice, tier.quantityRequired, tier);

          return (
            <button
              key={tier.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedTierId(isSelected ? null : tier.id)}
              className={joinClasses(styles.tier, isSelected && styles.tierActive)}
            >
              <span className={styles.tierMain}>
                <span className={styles.tierTop}>
                  <span className={joinClasses(styles.qty, isSelected && styles.qtyActive)}>
                    {tier.quantityRequired}
                  </span>
                  <span className={styles.tierLabel}>
                    {tier.label?.trim() || `Buy ${tier.quantityRequired}`}
                  </span>
                </span>
                <span className={styles.tierDiscount}>{tierDiscountLabel(tier, currency)}</span>
              </span>

              <span className={styles.tierPrice}>
                <span className={styles.tierUnit}>{formatMoney(tierPricing.unitPrice, currency)}</span>
                <span className={styles.tierPer}>/unit</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.summary}>
        <div className={styles.row}>
          <span>Base price</span>
          <span className={joinClasses(styles.rowValue, styles.strike)}>
            {formatMoney(pricing.baseUnitPrice * pricing.quantity, currency)}
          </span>
        </div>
        <div className={styles.row}>
          <span>
            Unit price <span>× {pricing.quantity}</span>
          </span>
          <span className={styles.rowValue}>{formatMoney(pricing.unitPrice, currency)}</span>
        </div>
        {pricing.savings > 0 ? (
          <div className={joinClasses(styles.row, styles.savings)}>
            <span>You save</span>
            <span className={styles.rowValue}>{formatMoney(pricing.savings, currency)}</span>
          </div>
        ) : null}
        <div className={joinClasses(styles.row, styles.totalRow)}>
          <span className={styles.totalLabel}>Bundle total</span>
          <span className={styles.totalValue}>{formatMoney(pricing.totalPrice, currency)}</span>
        </div>

        {pricing.savings > 0 && pricing.tier ? (
          <p className={joinClasses(styles.hint, styles.hintActive)}>
            {pricing.tier.label?.trim() || `${pricing.tier.quantityRequired}-item bundle`} applied automatically.
          </p>
        ) : (
          <p className={styles.hint}>Select a bundle above to unlock quantity-break pricing.</p>
        )}
      </div>
    </section>
  );
}
