'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  CircleAlert,
  Edit3,
  Image as ImageIcon,
  Loader2,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  compareAt: number | null;
  badge: string | null;
  rating: number;
  reviewCount: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  image: string;
  features: string[];
  category: string;
  collection: string;
  stock: string;
  inventory: number;
  salesCount: number;
  createdAt: string;
}

export function ProductsManager({ onNotify }: { onNotify?: (msg: string) => void }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          setProducts(data.products || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error fetching products');
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.slug.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchCat = categoryFilter === 'ALL' || p.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchQuery && matchStatus && matchCat;
    });
  }, [products, query, statusFilter, categoryFilter]);

  async function handleDelete(product: AdminProduct) {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      onNotify?.(`Product "${product.title}" removed.`);
      fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting product');
    } finally {
      setActiveMenuId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Table Card */}
      <div className="rounded-2xl border border-[#e6ebe8] bg-white shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#edf1ee] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a29c]">
              Catalog / Products
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#173c35]">Product Catalog</h2>
            <p className="mt-1 text-xs text-[#81918a]">
              Manage scrub suits, sizing, variants, pricing, and live inventory.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProducts}
              disabled={loading}
              className="border-[#dfe8e3] text-[#557067]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#1f6b52] text-white hover:bg-[#185540] shadow-sm"
            >
              <Plus size={16} />
              <span>Add product</span>
            </Button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col gap-3 border-b border-[#edf1ee] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-[#9aa7a1]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by title, slug, or category…"
              className="h-9 w-full rounded-lg border border-[#dfe8e3] bg-[#fbfcfb] pl-9 pr-3 text-xs outline-none ring-[#b9d9ca] placeholder:text-[#aab5b0] focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                  statusFilter === st ? 'bg-[#e8f3ee] text-[#22674e]' : 'text-[#73857e] hover:bg-[#f3f6f4]',
                )}
              >
                {st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 rounded-lg border border-[#dfe8e3] bg-[#fbfcfb] px-2 text-xs font-medium text-[#49655c] outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Men's Scrubs">Men&apos;s Scrubs</option>
              <option value="Women's Scrubs">Women&apos;s Scrubs</option>
              <option value="Unisex Scrubs">Unisex Scrubs</option>
              <option value="Medical Accessories">Accessories</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <CircleAlert size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead>
              <tr className="border-b border-[#edf1ee] text-[10px] uppercase tracking-[0.12em] text-[#9aa7a1]">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="py-3 font-semibold">Category</th>
                <th className="py-3 font-semibold">Price</th>
                <th className="py-3 font-semibold">Inventory</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="pr-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#7d9089]">
                      <Loader2 size={24} className="animate-spin text-[#1f6b52]" />
                      <span>Loading products…</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8c9e97]">
                    No products match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#f1f4f2] last:border-0 hover:bg-[#fafbfb]">
                    {/* Title & Image */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-[#e1e9e4] bg-[#f5f8f6]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.title} className="size-full object-cover object-top" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-[#21433a]">{p.title}</span>
                            {p.badge && (
                              <span className="rounded-full bg-[#fdeeee] px-2 py-0.2 text-[9px] font-bold text-[#b53a3a]">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#7d9089] font-mono">/{p.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 text-xs text-[#688177]">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#2d5248]">{p.category}</span>
                        <span className="text-[10px] text-[#93a69f]">{p.collection}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#1e443b]">
                          PKR {p.price.toLocaleString()}
                        </span>
                        {p.compareAt && (
                          <span className="text-[10px] text-[#a1b0aa] line-through">
                            PKR {p.compareAt.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 text-xs">
                      <span
                        className={cn(
                          'font-medium',
                          p.inventory > 10 ? 'text-[#267b57]' : p.inventory > 0 ? 'text-[#b07823]' : 'text-rose-600',
                        )}
                      >
                        {p.stock}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                          p.status === 'PUBLISHED'
                            ? 'bg-[#eaf7f0] text-[#1b7a54]'
                            : p.status === 'DRAFT'
                              ? 'bg-[#fff5e5] text-[#b87823]'
                              : 'bg-[#f0f2f1] text-[#7c8f87]',
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            p.status === 'PUBLISHED' ? 'bg-[#1b7a54]' : p.status === 'DRAFT' ? 'bg-[#b87823]' : 'bg-[#7c8f87]',
                          )}
                        />
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="pr-5 py-3.5 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                          className="rounded-lg p-1 text-[#81918a] hover:bg-[#f1f5f3] hover:text-[#21433a]"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {activeMenuId === p.id && (
                          <div className="absolute right-5 z-20 mt-1 w-44 rounded-xl border border-[#dfe7e2] bg-white p-1 shadow-lg">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#2d5248] hover:bg-[#f4f7f5]"
                            >
                              <Edit3 size={14} className="text-[#1f6b52]" />
                              Edit details
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 size={14} />
                              Delete product
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#edf1ee] p-4 text-xs text-[#81918a]">
          <span>
            Showing {filtered.length} of {products.length} products
          </span>
          <span className="text-[11px] text-[#9aa8a1]">Live PostgreSQL & Storefront Sync</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          isOpen={showAddModal || Boolean(editingProduct)}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSuccess={(msg) => {
            fetchProducts();
            onNotify?.(msg);
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: {
  product: AdminProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const isEdit = Boolean(product);
  const [title, setTitle] = useState(product?.title || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [subtitle, setSubtitle] = useState(product?.subtitle || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product ? String(product.price) : '5490');
  const [compareAt, setCompareAt] = useState(product?.compareAt ? String(product.compareAt) : '');
  const [categoryName, setCategoryName] = useState(product?.category || "Men's Scrubs");
  const [collectionName, setCollectionName] = useState(product?.collection || 'Standard');
  const [inventory, setInventory] = useState(product ? String(product.inventory) : '50');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>(product?.status || 'PUBLISHED');
  const [badge, setBadge] = useState(product?.badge || '');
  const [image, setImage] = useState(product?.image || '/img/real-product-images/Forte/Forte-Naval-1.webp');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [libraryMedia, setLibraryMedia] = useState<Array<{ id: string; url: string; filename: string }>>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const catalogPresets = [
    { label: 'Forte Naval', url: '/img/real-product-images/Forte/Forte-Naval-1.webp' },
    { label: 'Forte Royal', url: '/img/real-product-images/Forte/Forte-Royal-1.webp' },
    { label: 'Regal Scrub', url: '/img/real-product-images/regal/regal-thumbnail.webp' },
    { label: 'Muse Scrub', url: '/img/real-product-images/muse/muse-thumbnail.webp' },
    { label: 'Rebel Scrub', url: '/img/real-product-images/rebel/rebel-thumbnail.webp' },
    { label: 'Standard Scrub', url: '/img/real-product-images/standard/standard-thumbnail.webp' },
  ];

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || 'Failed to upload image');
        return;
      }

      if (data.url) {
        setImage(data.url);
      }
    } catch {
      setUploadError('Network error uploading file');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function toggleMediaPicker() {
    if (!showMediaPicker && libraryMedia.length === 0) {
      setLoadingMedia(true);
      try {
        const res = await fetch('/api/admin/media');
        const data = await res.json();
        if (data.media) {
          setLibraryMedia(data.media);
        }
      } catch {
        // ignore
      } finally {
        setLoadingMedia(false);
      }
    }
    setShowMediaPicker((prev) => !prev);
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/products/${product!.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          subtitle,
          description,
          price: Number(price),
          compareAt: compareAt ? Number(compareAt) : null,
          categoryName,
          collectionName,
          inventory: Number(inventory),
          status,
          badge: badge || null,
          image,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save product');
        return;
      }

      onSuccess(isEdit ? `Product "${title}" updated successfully.` : `Product "${title}" created.`);
      onClose();
    } catch {
      setError('Network error saving product.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#143d36]/35 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#dfe7e2] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-[#edf2ef]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#eaf4ef] text-[#1f6b52]">
              <Package size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#173c35]">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-xs text-[#80918a]">Storefront catalog & pricing</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#889a93] hover:bg-[#f2f6f4] hover:text-[#2d564a]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <CircleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Product Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!isEdit) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                  }
                }}
                placeholder="e.g. Regal Scrub Suit"
                required
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="regal-scrub-suit"
                required
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 font-mono text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Price (PKR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={0}
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Compare Price (PKR)</label>
              <input
                type="number"
                value={compareAt}
                onChange={(e) => setCompareAt(e.target.value)}
                placeholder="e.g. 6990"
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Inventory Stock</label>
              <input
                type="number"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                required
                min={0}
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Category</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
              >
                <option value="Men's Scrubs">Men&apos;s Scrubs</option>
                <option value="Women's Scrubs">Women&apos;s Scrubs</option>
                <option value="Unisex Scrubs">Unisex Scrubs</option>
                <option value="Medical Accessories">Medical Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Collection</label>
              <select
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
              >
                <option value="Forte">Forte</option>
                <option value="Regal">Regal</option>
                <option value="Muse">Muse</option>
                <option value="Rebel">Rebel</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Catalog Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED')}
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
              >
                <option value="PUBLISHED">Published (Visible on site)</option>
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Badge (Optional)</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Hot, New, Popular, Best Seller"
              className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
            />
          </div>

          {/* Media / Product Image Section */}
          <div className="rounded-xl border border-[#e1e9e5] bg-[#f9fbfa] p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#294a41]">
                Product Image & Media
              </label>
              <span className="text-[11px] text-[#718880]">JPG, PNG, WEBP, AVIF (Max 15MB)</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Thumbnail Preview */}
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-[#dce5e0] bg-white flex items-center justify-center">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/img/real-product-images/Forte/Forte-Naval-1.webp';
                    }}
                  />
                ) : (
                  <ImageIcon size={24} className="text-[#a4b5ad]" />
                )}
              </div>

              {/* Action buttons & URL input */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#206f55] bg-[#206f55] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#185944] disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      <>
                        <UploadCloud size={13} />
                        Upload New Image
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMediaPicker}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#dce5e0] bg-white px-3 py-1.5 text-xs font-medium text-[#294a41] shadow-sm transition hover:bg-[#f2f6f4]"
                  >
                    <ImageIcon size={13} />
                    {showMediaPicker ? 'Hide Library' : 'Choose from Library'}
                  </button>
                </div>

                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or enter direct image URL / path..."
                  required
                  className="h-8.5 w-full rounded-lg border border-[#dce5e0] bg-white px-2.5 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:ring-1 focus:ring-[#206f55]/15"
                />
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <CircleAlert size={12} /> {uploadError}
              </p>
            )}

            {/* Expandable Media Library / Preset Picker */}
            {showMediaPicker && (
              <div className="mt-2 rounded-xl border border-[#dfe7e2] bg-white p-3 space-y-3">
                <div>
                  <p className="text-[11px] font-semibold text-[#5c736b] mb-1.5 uppercase tracking-wider">
                    Quick Brand Presets
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {catalogPresets.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={cn(
                          'rounded-md px-2.5 py-1 text-xs border transition',
                          image === preset.url
                            ? 'border-[#206f55] bg-[#eaf4ef] font-semibold text-[#1a5b46]'
                            : 'border-[#dfe7e2] bg-[#f9fbfa] text-[#425d54] hover:bg-[#edf2ef]'
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold text-[#5c736b] mb-1.5 uppercase tracking-wider">
                    Uploaded Media Library
                  </p>
                  {loadingMedia ? (
                    <div className="flex items-center justify-center py-4 text-xs text-[#718880] gap-2">
                      <Loader2 size={14} className="animate-spin" /> Loading assets…
                    </div>
                  ) : libraryMedia.length === 0 ? (
                    <p className="text-xs text-[#718880] py-2">
                      No uploaded media found yet. Upload a file above or pick a preset.
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                      {libraryMedia.map((media) => (
                        <button
                          key={media.id}
                          type="button"
                          onClick={() => setImage(media.url)}
                          className={cn(
                            'group relative aspect-square overflow-hidden rounded-lg border transition hover:border-[#206f55]',
                            image === media.url ? 'border-2 border-[#206f55] ring-2 ring-[#206f55]/20' : 'border-[#dce5e0]'
                          )}
                          title={media.filename}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={media.url}
                            alt={media.filename}
                            className="h-full w-full object-cover"
                          />
                          {image === media.url && (
                            <div className="absolute inset-0 bg-[#206f55]/25 flex items-center justify-center text-white">
                              <Check size={16} className="drop-shadow" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Subtitle / Short description</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. 4-Way Stretch Performance Scrub Suit"
              className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Detailed Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Premium tailored medical scrubs engineered with antibacterial and breathable fabric..."
              className="w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] p-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#edf2ef]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={onClose}
              className="border-[#dfe7e2] text-[#556e66]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-[#1f6b52] text-white hover:bg-[#175440]"
            >
              {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

