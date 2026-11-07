'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  Check,
  CircleAlert,
  Layers,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminProductOption {
  id: string;
  title: string;
  slug: string;
  price: number;
}

interface AdminBundleTier {
  id: number;
  quantityRequired: number;
  discountValue: number;
  discountType: string;
  label: string | null;
}

interface AdminBundleOffer {
  id: number;
  productId: string;
  title: string;
  badgeText: string | null;
  isActive: boolean;
  createdAt: string;
  product: { id: string; title: string; slug: string; price: number };
  tiers: AdminBundleTier[];
}

interface TierDraft {
  key: string;
  quantityRequired: string;
  discountValue: string;
  discountType: 'percentage' | 'flat_amount';
  label: string;
}

const inputClass =
  'h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15';

const labelClass = 'mb-1.5 block text-xs font-semibold text-[#293447]';

function createEmptyTier(index: number): TierDraft {
  return {
    key: `tier-initial-${index}`,
    quantityRequired: index === 0 ? '2' : '',
    discountValue: '',
    discountType: 'percentage',
    label: '',
  };
}

function describeTier(tier: AdminBundleTier): string {
  const discount =
    tier.discountType === 'percentage'
      ? `${tier.discountValue}% off`
      : `Rs ${tier.discountValue.toLocaleString('en-PK')} off`;
  return `${tier.quantityRequired}+ → ${discount}`;
}

export function BundleOfferManager({
  onNotify,
  productId: fixedProductId,
  productTitle: fixedProductTitle,
  embedded = false,
}: {
  onNotify?: (message: string) => void;
  productId?: string;
  productTitle?: string;
  embedded?: boolean;
}) {
  const [products, setProducts] = useState<AdminProductOption[]>([]);
  const [offers, setOffers] = useState<AdminBundleOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null);
  const [deletingOfferId, setDeletingOfferId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [productId, setProductId] = useState(fixedProductId ?? '');
  const [title, setTitle] = useState(
    fixedProductTitle ? `${fixedProductTitle} — Bundle` : '',
  );
  const effectiveProductId = fixedProductId ?? productId;
  const [badgeText, setBadgeText] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [tiers, setTiers] = useState<TierDraft[]>([createEmptyTier(0)]);

  const fetchBundlingData = useCallback(async () => {
    const offersUrl = fixedProductId
      ? `/api/admin/bundles?productId=${encodeURIComponent(fixedProductId)}`
      : '/api/admin/bundles';

    const [productsRes, offersRes] = await Promise.all([
      fixedProductId ? Promise.resolve(null) : fetch('/api/admin/products'),
      fetch(offersUrl),
    ]);

    if (productsRes && !productsRes.ok) throw new Error('Failed to load products');
    if (!offersRes.ok) throw new Error('Failed to load bundle offers');

    const productsData = productsRes
      ? ((await productsRes.json()) as { products?: AdminProductOption[] })
      : null;
    const offersData = (await offersRes.json()) as { offers?: AdminBundleOffer[] };

    return {
      products: productsData?.products ?? [],
      offers: offersData.offers ?? [],
    };
  }, [fixedProductId]);

  const load = useCallback(async () => {
    try {
      const data = await fetchBundlingData();
      setProducts(data.products);
      setOffers(data.offers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load bundling data.');
    } finally {
      setLoading(false);
    }
  }, [fetchBundlingData]);

  useEffect(() => {
    let ignore = false;

    fetchBundlingData()
      .then((data) => {
        if (ignore) return;
        setProducts(data.products);
        setOffers(data.offers);
        setError(null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : 'Could not load bundling data.');
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [fetchBundlingData]);

  function handleProductChange(nextProductId: string) {
    setProductId(nextProductId);
    if (title.trim()) return;

    const product = products.find((item) => item.id === nextProductId);
    if (product) setTitle(`${product.title} — Bundle`);
  }

  function addTier() {
    setTiers((current) => [
      ...current,
      {
        key: `tier-${Date.now()}-${current.length}`,
        quantityRequired: '',
        discountValue: '',
        discountType: 'percentage',
        label: '',
      },
    ]);
  }

  function removeTier(key: string) {
    setTiers((current) => (current.length <= 1 ? current : current.filter((tier) => tier.key !== key)));
  }

  function updateTier(key: string, patch: Partial<TierDraft>) {
    setTiers((current) => current.map((tier) => (tier.key === key ? { ...tier, ...patch } : tier)));
  }

  function resetForm() {
    setProductId(fixedProductId ?? '');
    setTitle(fixedProductTitle ? `${fixedProductTitle} — Bundle` : '');
    setBadgeText('');
    setIsActive(true);
    setTiers([createEmptyTier(0)]);
    setEditingOfferId(null);
  }

  function startEditing(offer: AdminBundleOffer) {
    setEditingOfferId(offer.id);
    setProductId(offer.productId);
    setTitle(offer.title);
    setBadgeText(offer.badgeText ?? '');
    setIsActive(offer.isActive);
    setTiers(
      offer.tiers.map((tier) => ({
        key: `tier-${offer.id}-${tier.id}`,
        quantityRequired: String(tier.quantityRequired),
        discountValue: String(tier.discountValue),
        discountType: tier.discountType === 'flat_amount' ? 'flat_amount' : 'percentage',
        label: tier.label ?? '',
      })),
    );
    setError(null);
    setSuccess(null);
  }

  async function handleDelete(offer: AdminBundleOffer) {
    if (!window.confirm(`Delete bundle "${offer.title}"? This cannot be undone.`)) return;

    setDeletingOfferId(offer.id);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/bundles/${offer.id}`, { method: 'DELETE' });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to delete bundle offer.');
      }

      const message = `Bundle "${offer.title}" deleted.`;
      setSuccess(message);
      onNotify?.(message);
      setOffers((current) => current.filter((item) => item.id !== offer.id));

      if (editingOfferId === offer.id) resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete bundle offer.');
    } finally {
      setDeletingOfferId(null);
    }
  }

  function validate(): string | null {
    if (!effectiveProductId) return 'Select a product for this bundle.';
    if (!title.trim()) return 'Give the bundle offer a title.';
    if (tiers.length === 0) return 'Add at least one quantity tier.';

    const seenQuantities = new Set<number>();

    for (const [index, tier] of tiers.entries()) {
      const quantity = Number(tier.quantityRequired);
      const discount = Number(tier.discountValue);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return `Tier ${index + 1}: quantity must be a whole number of at least 1.`;
      }
      if (seenQuantities.has(quantity)) {
        return `Tier ${index + 1}: quantity ${quantity} is used more than once.`;
      }
      seenQuantities.add(quantity);

      if (!Number.isFinite(discount) || discount < 0) {
        return `Tier ${index + 1}: discount must be zero or greater.`;
      }
      if (tier.discountType === 'percentage' && discount > 100) {
        return `Tier ${index + 1}: percentage discount cannot exceed 100%.`;
      }
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    const isEditing = editingOfferId !== null;

    try {
      const res = await fetch(isEditing ? `/api/admin/bundles/${editingOfferId}` : '/api/admin/bundles', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: effectiveProductId,
          title: title.trim(),
          badgeText: badgeText.trim() || null,
          isActive,
          tiers: tiers.map((tier) => ({
            quantityRequired: Number(tier.quantityRequired),
            discountValue: Number(tier.discountValue),
            discountType: tier.discountType,
            label: tier.label.trim() || null,
          })),
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { error?: string; issues?: Array<{ path: string; message: string }>; offer?: AdminBundleOffer }
        | null;

      if (!res.ok) {
        const issueText = data?.issues?.map((issue) => issue.message).join(' ');
        throw new Error(issueText || data?.error || 'Failed to save bundle offer.');
      }

      const tierText = `${tiers.length} tier${tiers.length === 1 ? '' : 's'}`;
      const message = isEditing
        ? `Bundle "${title.trim()}" updated with ${tierText}.`
        : `Bundle "${title.trim()}" created with ${tierText}.`;
      setSuccess(message);
      onNotify?.(message);

      const savedOffer = data?.offer;
      if (savedOffer) {
        setOffers((current) =>
          isEditing
            ? current.map((offer) => (offer.id === savedOffer.id ? savedOffer : offer))
            : [savedOffer, ...current],
        );
      } else {
        void load();
      }

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save bundle offer.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={embedded ? 'space-y-4' : 'space-y-6'}>
      {embedded ? null : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#939fa9]">
              Catalog / Bundles
            </p>
            <h1 className="mt-1 text-xl font-semibold text-[#131b2e]">Native Bundling &amp; Quantity Breaks</h1>
            <p className="mt-1 text-xs text-[#7e8a96]">
              Create bundle offers and tiered discounts. Pricing is always recalculated on the server.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              void load();
            }}
            disabled={loading}
            className="border-[#dee7ee] text-[#556572]"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-[#dde5ec] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)] sm:p-6"
      >
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#e9ecf4] text-[#052263]">
            <Layers size={18} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[#131b2e]">
              {editingOfferId ? 'Edit bundle offer' : 'New bundle offer'}
            </h2>
            <p className="text-[11px] text-[#8b98a4]">
              {editingOfferId
                ? 'Changes replace the offer and all of its tiers in one transaction.'
                : 'Offer and tiers are saved atomically in one transaction.'}
            </p>
          </div>
        </div>

        {error ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <CircleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        ) : null}

        {success ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
            <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="bundle-product">
              Product
            </label>
            {fixedProductId ? (
              <input
                id="bundle-product"
                type="text"
                value={fixedProductTitle || fixedProductId}
                readOnly
                className={cn(inputClass, 'cursor-not-allowed bg-[#f1f4f7] text-[#6f7d8a]')}
              />
            ) : (
              <select
                id="bundle-product"
                value={productId}
                onChange={(event) => handleProductChange(event.target.value)}
                className={inputClass}
                required
                disabled={loading}
              >
                <option value="">{loading ? 'Loading products…' : 'Select a product'}</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title} — Rs {product.price.toLocaleString('en-PK')}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="bundle-title">
              Offer title
            </label>
            <input
              id="bundle-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Regal 3-Pack"
              maxLength={255}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="bundle-badge">
              Badge text (optional)
            </label>
            <input
              id="bundle-badge"
              type="text"
              value={badgeText}
              onChange={(event) => setBadgeText(event.target.value)}
              placeholder="e.g. Most popular"
              maxLength={100}
              className={inputClass}
            />
          </div>

          <label className="flex items-end gap-2.5 pb-2.5 text-xs font-medium text-[#293447]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) => setIsActive(event.target.checked)}
              className="size-4 rounded border-[#c7d1dc] text-[#052263] focus:ring-[#052263]/25"
            />
            Active on storefront
          </label>
        </div>

        <div className="rounded-xl border border-[#e1e8ee] bg-[#f9fafc] p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-[#293447]">Quantity tiers</h3>
              <p className="text-[11px] text-[#8b98a4]">
                Percentage = off each unit. Flat amount = off the entire bundle.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addTier} className="border-[#dee7ee]">
              <Plus size={14} />
              Add tier
            </Button>
          </div>

          <div className="mt-3 space-y-3">
            {tiers.map((tier, index) => (
              <div
                key={tier.key}
                className="grid gap-2 rounded-xl border border-[#e4ebf1] bg-white p-3 sm:grid-cols-[80px_1fr_1fr_1fr_auto] sm:items-end"
              >
                <div>
                  <label className={cn(labelClass, 'text-[10px]')} htmlFor={`tier-qty-${tier.key}`}>
                    Qty
                  </label>
                  <input
                    id={`tier-qty-${tier.key}`}
                    type="number"
                    min={1}
                    step={1}
                    value={tier.quantityRequired}
                    onChange={(event) => updateTier(tier.key, { quantityRequired: event.target.value })}
                    className={inputClass}
                    placeholder={String(index + 2)}
                    required
                  />
                </div>

                <div>
                  <label className={cn(labelClass, 'text-[10px]')} htmlFor={`tier-type-${tier.key}`}>
                    Type
                  </label>
                  <select
                    id={`tier-type-${tier.key}`}
                    value={tier.discountType}
                    onChange={(event) =>
                      updateTier(tier.key, {
                        discountType: event.target.value as TierDraft['discountType'],
                      })
                    }
                    className={inputClass}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat_amount">Flat amount (Rs)</option>
                  </select>
                </div>

                <div>
                  <label className={cn(labelClass, 'text-[10px]')} htmlFor={`tier-value-${tier.key}`}>
                    {tier.discountType === 'percentage' ? 'Discount %' : 'Discount Rs'}
                  </label>
                  <input
                    id={`tier-value-${tier.key}`}
                    type="number"
                    min={0}
                    step="0.01"
                    value={tier.discountValue}
                    onChange={(event) => updateTier(tier.key, { discountValue: event.target.value })}
                    className={inputClass}
                    placeholder={tier.discountType === 'percentage' ? '10' : '500'}
                    required
                  />
                </div>

                <div>
                  <label className={cn(labelClass, 'text-[10px]')} htmlFor={`tier-label-${tier.key}`}>
                    Label (optional)
                  </label>
                  <input
                    id={`tier-label-${tier.key}`}
                    type="text"
                    value={tier.label}
                    onChange={(event) => updateTier(tier.key, { label: event.target.value })}
                    className={inputClass}
                    placeholder="e.g. 3-Pack"
                    maxLength={255}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeTier(tier.key)}
                  disabled={tiers.length <= 1}
                  aria-label={`Remove tier ${index + 1}`}
                  className="text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {editingOfferId ? (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={submitting}
              className="border-[#dee7ee] text-[#556572]"
            >
              <X size={15} />
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={submitting || loading}
            className="bg-[#052263] text-white shadow-sm hover:bg-[#031849]"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {submitting ? 'Saving…' : editingOfferId ? 'Save changes' : 'Create bundle offer'}
          </Button>
        </div>
      </form>

      <div className="rounded-2xl border border-[#e7ecf0] bg-white shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        <div className="border-b border-[#edf1f5] p-5">
          <h2 className="text-sm font-semibold text-[#131b2e]">Existing bundle offers</h2>
          <p className="mt-1 text-[11px] text-[#8b98a4]">
            {offers.length} offer{offers.length === 1 ? '' : 's'} configured.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-xs text-[#7c8996]">
            <Loader2 size={18} className="animate-spin text-[#052263]" />
            Loading bundle offers…
          </div>
        ) : offers.length === 0 ? (
          <p className="px-5 py-10 text-center text-xs text-[#8b98a4]">No bundle offers yet.</p>
        ) : (
          <ul className="divide-y divide-[#f1f4f7]">
            {offers.map((offer) => (
              <li
                key={offer.id}
                className={cn(
                  'flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between',
                  editingOfferId === offer.id ? 'bg-[#f7f9fd]' : null,
                )}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#202a3c]">{offer.title}</span>
                    {offer.badgeText ? (
                      <span className="rounded-full bg-[#eef2f9] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#052263]">
                        {offer.badgeText}
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                        offer.isActive ? 'bg-[#eaf7f0] text-[#1b7a54]' : 'bg-[#f1f3f6] text-[#7e8a96]',
                      )}
                    >
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {fixedProductId ? null : (
                    <p className="mt-1 truncate text-[11px] text-[#7c8996]">
                      {offer.product.title} · /{offer.product.slug}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <div className="flex flex-wrap gap-1.5">
                    {offer.tiers.map((tier) => (
                      <span
                        key={tier.id}
                        className="rounded-lg border border-[#e0e7ee] bg-[#fbfcfd] px-2 py-1 text-[10px] font-medium text-[#556371]"
                      >
                        {describeTier(tier)}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(offer)}
                      disabled={deletingOfferId === offer.id}
                      className="border-[#dee7ee] text-[#556572]"
                    >
                      <Pencil size={13} />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleDelete(offer)}
                      disabled={deletingOfferId === offer.id}
                      className="text-rose-600 hover:bg-rose-50"
                    >
                      {deletingOfferId === offer.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
