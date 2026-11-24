'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpToLine,
  Check,
  CircleAlert,
  Edit3,
  GripVertical,
  Image as ImageIcon,
  Loader2,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AdminFullPage } from '@/components/admin/admin-full-page';
import { BundleOfferManager } from '@/components/admin/bundle-offer-form';
import { getProductBySlug, getStandardColorHex, STANDARD_COLORS } from '@/lib/products';

export interface AdminProductImage {
  id?: string;
  url: string;
  alt?: string | null;
  sortOrder?: number;
}

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
  images?: AdminProductImage[] | string[];
  colors?: Array<{ name: string; hex: string }>;
  features: string[];
  category: string;
  collection: string;
  stock: string;
  inventory: number;
  salesCount: number;
  createdAt: string;
}

/** Filter tab key for images that have no colour tag yet. */
const UNTAGGED_FILTER = '__UNTAGGED';

/**
 * Seeds colour tags from the static catalogue when a product has no DB
 * colours yet, so editors see the existing tagging as a starting point.
 */
function buildInitialImageTags(product: AdminProduct | null): Record<string, string> {
  const tags: Record<string, string> = {};
  const staticProduct = product?.slug ? getProductBySlug(product.slug) : undefined;
  if (staticProduct?.colorImages) {
    for (const [name, urls] of Object.entries(staticProduct.colorImages)) {
      for (const url of urls) {
        tags[url] = name;
      }
    }
  }
  return tags;
}

export function ProductsManager({
  onNotify,
  canDelete = true,
  onToggleSidebar,
}: {
  onNotify?: (msg: string) => void;
  canDelete?: boolean;
  onToggleSidebar?: () => void;
}) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const [showCreateForm, setShowCreateForm] = useState(false);
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
    if (!canDelete) {
      onNotify?.('Only administrators can delete products.');
      return;
    }
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

  if (showCreateForm || editingProduct) {
    return (
      <ProductFormPage
        product={editingProduct}
        onClose={() => {
          setShowCreateForm(false);
          setEditingProduct(null);
        }}
        onToggleSidebar={onToggleSidebar}
        onSuccess={(msg) => {
          fetchProducts();
          onNotify?.(msg);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Table Card */}
      <div className="rounded-2xl border border-[#e7ecf0] bg-white shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#edf1f5] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#939fa9]">
              Catalog / Products
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#131b2e]">Product Catalog</h2>
            <p className="mt-1 text-xs text-[#7e8a96]">
              Manage scrub suits, sizing, variants, pricing, and live inventory.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProducts}
              disabled={loading}
              className="border-[#dee7ee] text-[#556572]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#052263] text-white hover:bg-[#031849] shadow-sm"
            >
              <Plus size={16} />
              <span>Add product</span>
            </Button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col gap-3 border-b border-[#edf1f5] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-[#99a5af]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by title, slug, or category…"
              className="h-9 w-full rounded-lg border border-[#dee7ee] bg-[#fbfcfd] pl-9 pr-3 text-xs outline-none ring-[#bcc7de] placeholder:text-[#a9b4be] focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'PUBLISHED', 'DRAFT', 'ARCHIVED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                  statusFilter === st ? 'bg-[#e9ecf4] text-[#041d52]' : 'text-[#72808d] hover:bg-[#f3f5f8]',
                )}
              >
                {st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 rounded-lg border border-[#dee7ee] bg-[#fbfcfd] px-2 text-xs font-medium text-[#49616e] outline-none"
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
              <tr className="border-b border-[#edf1f5] text-[10px] uppercase tracking-[0.12em] text-[#99a5af]">
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
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#7c8996]">
                      <Loader2 size={24} className="animate-spin text-[#052263]" />
                      <span>Loading products…</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8b98a4]">
                    No products match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#f1f4f7] last:border-0 hover:bg-[#fafbfb]">
                    {/* Title & Image */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-[#e1e8ee] bg-[#f5f8fa]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.title} className="size-full object-cover object-top" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-[#202a3c]">{p.title}</span>
                            {p.badge && (
                              <span className="rounded-full bg-[#fdeeee] px-2 py-0.2 text-[9px] font-bold text-[#b53a3a]">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#7c8996] font-mono">/{p.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 text-xs text-[#688177]">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#2c3851]">{p.category}</span>
                        <span className="text-[10px] text-[#92a0ab]">{p.collection}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#1a2438]">
                          PKR {p.price.toLocaleString()}
                        </span>
                        {p.compareAt && (
                          <span className="text-[10px] text-[#a0abb6] line-through">
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
                          p.inventory > 10 ? 'text-[#041d52]' : p.inventory > 0 ? 'text-[#b07823]' : 'text-rose-600',
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
                              : 'bg-[#f0f2f5] text-[#7c8a98]',
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            p.status === 'PUBLISHED' ? 'bg-[#1b7a54]' : p.status === 'DRAFT' ? 'bg-[#b87823]' : 'bg-[#7c8a98]',
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
                          className="rounded-lg p-1 text-[#7e8a96] hover:bg-[#f1f4f7] hover:text-[#202a3c]"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {activeMenuId === p.id && (
                          <div className="absolute right-5 z-20 mt-1 w-44 rounded-xl border border-[#dde5ec] bg-white p-1 shadow-lg">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#2c3851] hover:bg-[#f4f6f9]"
                            >
                              <Edit3 size={14} className="text-[#052263]" />
                              Edit details
                            </button>
                            {canDelete ? (
                              <button
                                onClick={() => handleDelete(p)}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50"
                              >
                                <Trash2 size={14} />
                                Delete product
                              </button>
                            ) : null}
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

        <div className="flex items-center justify-between border-t border-[#edf1f5] p-4 text-xs text-[#7e8a96]">
          <span>
            Showing {filtered.length} of {products.length} products
          </span>
          <span className="text-[11px] text-[#99a5af]">Live PostgreSQL & Storefront Sync</span>
        </div>
      </div>

    </div>
  );
}

function ProductFormPage({
  product,
  onClose,
  onToggleSidebar,
  onSuccess,
}: {
  product: AdminProduct | null;
  onClose: () => void;
  onToggleSidebar?: () => void;
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
  const initialImages = useMemo(() => {
    const list: string[] = [];
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      for (const img of product.images) {
        const url = typeof img === 'string' ? img : img.url;
        if (url && !list.includes(url)) list.push(url);
      }
    }
    if (list.length === 0 && product?.slug) {
      const fallback = getProductBySlug(product.slug);
      if (fallback?.images && Array.isArray(fallback.images)) {
        for (const url of fallback.images) {
          if (url && !list.includes(url)) list.push(url);
        }
      }
    }
    if (product?.image && !list.includes(product.image)) {
      list.unshift(product.image);
    }
    return list;
  }, [product]);

  const [images, setImages] = useState<string[]>(initialImages);
  const [image, setImage] = useState<string>(
    product?.image || initialImages[0] || '/img/real-product-images/Forte/Forte-Naval-1.webp'
  );
  const [directUrlInput, setDirectUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // --- Colour palette + per-image colour tagging (Shopify-style media) ---
  // enabledColors: which of the standard colours this product is sold in.
  // imageTags:     image URL -> colour name it is tagged to (untagged = absent).
  const [enabledColors, setEnabledColors] = useState<string[]>(() =>
    product?.colors?.length
      ? product.colors.map((color) => color.name)
      : STANDARD_COLORS.map((color) => color.name),
  );
  const [imageTags, setImageTags] = useState<Record<string, string>>(() =>
    buildInitialImageTags(product),
  );
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(() => new Set());
  const [colorFilter, setColorFilter] = useState<string>('ALL');
  // Once the admin picks a colour tab manually, auto-defaulting must not
  // override their choice when the fresh DB payload lands.
  const filterTouchedRef = useRef(false);
  const [dragUrl, setDragUrl] = useState<string | null>(null);
  const [dropTargetUrl, setDropTargetUrl] = useState<string | null>(null);

  // Auto-fetch fresh images + colour tagging from DB on edit
  useEffect(() => {
    if (!product?.id) return;
    let ignore = false;
    fetch(`/api/admin/products/${product.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (ignore || !data?.product) return;
        const fetchedList: string[] = [];
        if (Array.isArray(data.product.images) && data.product.images.length > 0) {
          for (const img of data.product.images) {
            const url = typeof img === 'string' ? img : img.url;
            if (url && !fetchedList.includes(url)) fetchedList.push(url);
          }
        }
        if (data.product.image && !fetchedList.includes(data.product.image)) {
          fetchedList.unshift(data.product.image);
        }

        // Colour palette + per-image tags stored on the product's colours.
        const colorRows: Array<{ name?: string; hex?: string; images?: string[] }> =
          Array.isArray(data.product.colors) ? data.product.colors : [];
        const tags: Record<string, string> = {};
        let enabledNames: string[] = [];

        if (colorRows.length > 0) {
          enabledNames = colorRows
            .map((row) => row.name)
            .filter((name): name is string => Boolean(name));
          setEnabledColors(enabledNames);
          for (const row of colorRows) {
            if (!row.name || !Array.isArray(row.images)) continue;
            for (const url of row.images) {
              if (typeof url === 'string') tags[url] = row.name;
            }
          }
        } else {
          // Products created before colour support: start from the static catalogue.
          const staticProduct = getProductBySlug(product.slug);
          if (staticProduct) {
            enabledNames = staticProduct.colors.map((color) => color.name);
            setEnabledColors(enabledNames);
            for (const [name, urls] of Object.entries(staticProduct.colorImages || {})) {
              for (const url of urls) tags[url] = name;
            }
          }
        }

        // A colour-tagged URL should always be reachable from the gallery list.
        for (const url of Object.keys(tags)) {
          if (!fetchedList.includes(url)) fetchedList.push(url);
        }

        if (fetchedList.length > 0) {
          setImages(fetchedList);
          if (data.product.image) setImage(data.product.image);
        }
        setImageTags(tags);
        setSelectedUrls(new Set());

        // Open the media grid on a single colour variant (the first one that
        // actually has photos) so images are tagged one colour at a time.
        // Falls back to "All" when nothing is tagged yet, and never overrides
        // a tab the admin already clicked.
        if (!filterTouchedRef.current && fetchedList.length > 0) {
          const firstColorWithImages = enabledNames.find((name) =>
            fetchedList.some((url) => tags[url] === name),
          );
          setColorFilter(firstColorWithImages ?? 'ALL');
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [product?.id, product?.slug]);

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

  async function handleFileUpload(files: FileList | File[] | null) {
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadError(null);

    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => {
          const next = [...prev];
          for (const url of uploadedUrls) {
            if (!next.includes(url)) next.push(url);
          }
          return next;
        });

        // Uploading while a colour filter is active tags the new images to
        // that colour (unless the "Untagged" filter is showing).
        const tagForUploads =
          colorFilter !== 'ALL' &&
          colorFilter !== UNTAGGED_FILTER &&
          enabledColors.includes(colorFilter)
            ? colorFilter
            : '';
        if (tagForUploads) {
          setImageTags((prev) => {
            const updated = { ...prev };
            for (const url of uploadedUrls) updated[url] = tagForUploads;
            return updated;
          });
        }

        setImage((prev) => {
          if (!prev || prev.includes('/Forte-Naval-1.webp') || images.length === 0) {
            return uploadedUrls[0];
          }
          return prev;
        });
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Network error uploading file(s)');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleSetAsCover(url: string) {
    setImage(url);
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
  }

  // --- Colour filter, multi-select & ordering helpers ---

  const isVisibleImage = useCallback(
    (url: string) => {
      if (colorFilter === 'ALL') return true;
      const tag = imageTags[url];
      const validTag = tag && enabledColors.includes(tag) ? tag : '';
      if (colorFilter === UNTAGGED_FILTER) return validTag === '';
      return validTag === colorFilter;
    },
    [colorFilter, imageTags, enabledColors],
  );

  const visibleImages = useMemo(
    () => images.filter((url) => isVisibleImage(url)),
    [images, isVisibleImage],
  );

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let untagged = 0;
    for (const url of images) {
      const tag = imageTags[url];
      if (tag && enabledColors.includes(tag)) {
        counts[tag] = (counts[tag] || 0) + 1;
      } else {
        untagged += 1;
      }
    }
    return { counts, untagged };
  }, [images, imageTags, enabledColors]);

  const allVisibleSelected =
    visibleImages.length > 0 && visibleImages.every((url) => selectedUrls.has(url));

  /**
   * Moves every ticked image as one batch inside the currently visible
   * (colour-filtered) list: `up`/`down` shift each image one slot past its
   * neighbour, `top`/`bottom` lift the whole block to the ends.
   */
  function moveSelectedImages(target: 'up' | 'down' | 'top' | 'bottom') {
    const list = visibleImages;
    const group = list.filter((url) => selectedUrls.has(url));
    if (group.length === 0) return;
    const groupSet = new Set(group);

    if (target === 'up' || target === 'down') {
      // Shift each ticked image one slot past its neighbour, skipping over
      // other ticked images so a contiguous block travels together.
      const visible = [...list];
      if (target === 'up') {
        for (let i = 0; i < visible.length; i += 1) {
          if (groupSet.has(visible[i]) && i > 0 && !groupSet.has(visible[i - 1])) {
            const temp = visible[i - 1];
            visible[i - 1] = visible[i];
            visible[i] = temp;
          }
        }
      } else {
        for (let i = visible.length - 1; i >= 0; i -= 1) {
          if (
            groupSet.has(visible[i]) &&
            i < visible.length - 1 &&
            !groupSet.has(visible[i + 1])
          ) {
            const temp = visible[i + 1];
            visible[i + 1] = visible[i];
            visible[i] = temp;
          }
        }
      }
      commitVisibleOrder(visible);
      return;
    }

    // top / bottom — lift the whole ticked block to either end.
    const next = list.filter((url) => !groupSet.has(url));
    if (target === 'top') next.splice(0, 0, ...group);
    else next.push(...group);
    commitVisibleOrder(next);
  }

  /**
   * Writes a reordered visible subset back into the full gallery, so images
   * outside the current colour filter keep their positions (Shopify-style
   * ordering that works both globally and per colour view).
   */
  function commitVisibleOrder(nextVisible: string[]) {
    const visibleSet = new Set(nextVisible);
    let cursor = 0;
    const next = images.map((url) => (visibleSet.has(url) ? nextVisible[cursor++] : url));
    setImages(next);
    // Position 0 is always the main upfront cover image (Shopify behaviour)
    if (next.length > 0) {
      setImage(next[0]);
    }
  }

  function handleMoveImage(url: string, direction: 'left' | 'right') {
    const currentIndex = visibleImages.indexOf(url);
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= visibleImages.length) return;

    const nextVisible = [...visibleImages];
    const temp = nextVisible[currentIndex];
    nextVisible[currentIndex] = nextVisible[targetIndex];
    nextVisible[targetIndex] = temp;
    commitVisibleOrder(nextVisible);
  }

  function handleDropImage(sourceUrl: string | null, targetUrl: string) {
    setDragUrl(null);
    setDropTargetUrl(null);
    if (!sourceUrl || sourceUrl === targetUrl) return;

    const from = visibleImages.indexOf(sourceUrl);
    const to = visibleImages.indexOf(targetUrl);
    if (from < 0 || to < 0) return;

    // Dragging a ticked image grabs the whole ticked batch, so multiple
    // variant photos can be reordered in one go.
    const group =
      selectedUrls.has(sourceUrl) && selectedUrls.size > 1
        ? visibleImages.filter((url) => selectedUrls.has(url))
        : [sourceUrl];
    const groupSet = new Set(group);

    // Where the batch lands in the original list: dropping onto one of its
    // own members settles it just past that member; otherwise keep the usual
    // direction feel (rightward drops land after the target, leftward before).
    let insertIdx = to;
    if (groupSet.has(targetUrl)) {
      while (insertIdx < visibleImages.length && groupSet.has(visibleImages[insertIdx])) {
        insertIdx += 1;
      }
    } else if (from < to) {
      insertIdx = to + 1;
    }

    // Convert to an index inside the list with the batch removed.
    let insertAt = 0;
    for (let i = 0; i < insertIdx; i += 1) {
      if (!groupSet.has(visibleImages[i])) insertAt += 1;
    }

    const next = visibleImages.filter((url) => !groupSet.has(url));
    next.splice(insertAt, 0, ...group);
    commitVisibleOrder(next);
  }

  function handleRemoveImage(url: string) {
    const next = images.filter((item) => item !== url);
    setImages(next);

    setSelectedUrls((prev) => {
      if (!prev.has(url)) return prev;
      const updated = new Set(prev);
      updated.delete(url);
      return updated;
    });
    setImageTags((prev) => {
      if (!(url in prev)) return prev;
      const updated = { ...prev };
      delete updated[url];
      return updated;
    });

    if (image === url) {
      setImage(next[0] || '');
    }
  }

  function handleTagChange(url: string, colorName: string) {
    setImageTags((prev) => {
      const updated = { ...prev };
      if (!colorName) {
        delete updated[url];
      } else {
        updated[url] = colorName;
      }
      return updated;
    });
  }

  function toggleSelect(url: string) {
    setSelectedUrls((prev) => {
      const updated = new Set(prev);
      if (updated.has(url)) updated.delete(url);
      else updated.add(url);
      return updated;
    });
  }

  function toggleSelectAllVisible() {
    setSelectedUrls((prev) => {
      const updated = new Set(prev);
      if (allVisibleSelected) {
        for (const url of visibleImages) updated.delete(url);
      } else {
        for (const url of visibleImages) updated.add(url);
      }
      return updated;
    });
  }

  function changeColorFilter(key: string) {
    filterTouchedRef.current = true;
    setColorFilter(key);
    setSelectedUrls(new Set());
  }

  function toggleColor(name: string) {
    const isActive = enabledColors.includes(name);
    if (isActive) {
      // Always keep at least one colour available on the product.
      if (enabledColors.length <= 1) return;
      setEnabledColors(enabledColors.filter((color) => color !== name));
      // Images tagged to the removed colour become untagged again.
      setImageTags((prev) => {
        const updated: Record<string, string> = {};
        for (const [url, tag] of Object.entries(prev)) {
          if (tag !== name) updated[url] = tag;
        }
        return updated;
      });
      setColorFilter((prev) => (prev === name ? 'ALL' : prev));
    } else {
      setEnabledColors([...enabledColors, name]);
    }
  }

  function handleBulkTag(colorName: string) {
    if (!colorName || selectedUrls.size === 0) return;
    const batch = new Set(selectedUrls);
    setImageTags((prev) => {
      const updated = { ...prev };
      for (const url of batch) updated[url] = colorName;
      return updated;
    });
    // The batch is done — clear the ticks so the next selection starts
    // fresh instead of piling onto the same colour variant.
    setSelectedUrls(new Set());
  }

  function bulkClearTags() {
    if (selectedUrls.size === 0) return;
    const batch = new Set(selectedUrls);
    setImageTags((prev) => {
      const updated: Record<string, string> = {};
      for (const [url, tag] of Object.entries(prev)) {
        if (!batch.has(url)) updated[url] = tag;
      }
      return updated;
    });
    setSelectedUrls(new Set());
  }

  function bulkDeleteImages() {
    if (selectedUrls.size === 0) return;
    const next = images.filter((url) => !selectedUrls.has(url));
    setImages(next);
    setSelectedUrls(new Set());
    setImageTags((prev) => {
      const updated: Record<string, string> = {};
      for (const [url, tag] of Object.entries(prev)) {
        if (!selectedUrls.has(url)) updated[url] = tag;
      }
      return updated;
    });
    if (image && !next.includes(image)) {
      setImage(next[0] || '');
    }
  }

  function handleAddDirectUrl() {
    const trimmed = directUrlInput.trim();
    if (!trimmed) return;
    if (!images.includes(trimmed)) {
      setImages((prev) => [...prev, trimmed]);
      if (!image || images.length === 0) {
        setImage(trimmed);
      }
    }
    setDirectUrlInput('');
    setShowUrlInput(false);
  }

  function handleAddPresetOrLibrary(url: string) {
    if (!images.includes(url)) {
      setImages((prev) => [...prev, url]);
      if (!image || images.length === 0) {
        setImage(url);
      }
    } else {
      handleSetAsCover(url);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (enabledColors.length === 0) {
      setError('Select at least one colour for this product.');
      return;
    }

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
          image: image || images[0] || '',
          images,
          // Colours the product is offered in, in display order…
          colors: enabledColors.map((name) => ({
            name,
            hex: getStandardColorHex(name),
          })),
          // …and the ordered image URLs tagged to each of them.
          colorImages: Object.fromEntries(
            enabledColors.map((name) => [
              name,
              images.filter((url) => imageTags[url] === name),
            ]),
          ),
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

  // --- Bulk bar helpers: how far the ticked batch can travel, and whether
  // a drag is carrying the whole batch instead of a single photo ---
  const selectedVisible = visibleImages.filter((url) => selectedUrls.has(url));
  const canMoveUp =
    selectedVisible.length > 0 && visibleImages.indexOf(selectedVisible[0]) > 0;
  const canMoveDown =
    selectedVisible.length > 0 &&
    visibleImages.indexOf(selectedVisible[selectedVisible.length - 1]) <
      visibleImages.length - 1;
  const dragGroupSize =
    dragUrl && selectedUrls.has(dragUrl) && selectedUrls.size > 1 ? selectedUrls.size : 0;

  return (
    <AdminFullPage
      title={isEdit ? 'Edit Product' : 'Add New Product'}
      subtitle="Storefront catalog & pricing"
      icon={<Package size={20} />}
      onClose={onClose}
      onToggleSidebar={onToggleSidebar}
      backLabel="Back to products"
    >
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[#dde5ec] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)] sm:p-6">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <CircleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#293447] mb-1.5">Product Title</label>
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
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293447] mb-1.5">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="regal-scrub-suit"
                required
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 font-mono text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#293447] mb-1.5">Price (PKR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min={0}
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293447] mb-1.5">Compare Price (PKR)</label>
              <input
                type="number"
                value={compareAt}
                onChange={(e) => setCompareAt(e.target.value)}
                placeholder="e.g. 6990"
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293447] mb-1.5">Inventory Stock</label>
              <input
                type="number"
                value={inventory}
                onChange={(e) => setInventory(e.target.value)}
                required
                min={0}
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#293447] mb-1.5">Category</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              >
                <option value="Men's Scrubs">Men&apos;s Scrubs</option>
                <option value="Women's Scrubs">Women&apos;s Scrubs</option>
                <option value="Unisex Scrubs">Unisex Scrubs</option>
                <option value="Medical Accessories">Medical Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293447] mb-1.5">Collection</label>
              <select
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              >
                <option value="Forte">Forte</option>
                <option value="Regal">Regal</option>
                <option value="Muse">Muse</option>
                <option value="Rebel">Rebel</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293447] mb-1.5">Catalog Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED')}
                className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
              >
                <option value="PUBLISHED">Published (Visible on site)</option>
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#293447] mb-1.5">Badge (Optional)</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Hot, New, Popular, Best Seller"
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          {/* Colours the product is offered in */}
          <div className="rounded-2xl border border-[#dde5ec] bg-white p-4 sm:p-5 space-y-3.5">
            <div className="border-b border-[#edf1f5] pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#052263] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Step 1
                </span>
                <label className="text-sm font-bold text-[#131b2e]">Product Colours</label>
                <span className="rounded-full bg-[#052263]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#052263]">
                  {enabledColors.length} of {STANDARD_COLORS.length}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#637282]">
                Pick the colours this product is sold in. Each colour gets its own tab in
                Product Media below — shoppers only see the photos of the colour they select.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {STANDARD_COLORS.map((color) => {
                const isActive = enabledColors.includes(color.name);
                const isLastActive = isActive && enabledColors.length === 1;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleColor(color.name)}
                    disabled={isLastActive}
                    aria-pressed={isActive}
                    title={
                      isLastActive
                        ? 'A product needs at least one colour'
                        : isActive
                          ? `Remove ${color.name} from this product`
                          : `Offer this product in ${color.name}`
                    }
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                      isActive
                        ? 'border-[#052263] bg-[#052263] text-white shadow-sm'
                        : 'border-[#dbe4eb] bg-[#f9fafc] text-[#556371] hover:border-[#b4c3d4] hover:bg-white',
                      isLastActive && 'cursor-not-allowed opacity-60',
                    )}
                  >
                    <span
                      className="size-3 rounded-full border border-black/20"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                    {isActive && tagCounts.counts[color.name] ? (
                      <span className="rounded-full bg-white/20 px-1.5 py-px text-[10px] font-bold">
                        {tagCounts.counts[color.name]}
                      </span>
                    ) : null}
                    {isActive && <Check size={12} className="text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media / Product Media & Gallery Section (Shopify-Style) */}
          <div className="rounded-2xl border border-[#dde5ec] bg-[#f8fafc] p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#edf1f5] pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#052263] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Step 2
                  </span>
                  <label className="text-sm font-bold text-[#131b2e]">Product Media</label>
                  <span className="rounded-full bg-[#052263]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#052263]">
                    {images.length} {images.length === 1 ? 'image' : 'images'}
                  </span>
                </div>
                <p className="mt-0.5 max-w-xl text-xs text-[#637282]">
                  Work one colour at a time: open its tab, tick the photos, then press{' '}
                  <strong>Assign to</strong> — the ticks clear so you can start the next colour.
                  Tick several photos and use <strong>Move</strong> to reorder them as a group.
                  The first image is the <strong>Main Cover</strong> shown on collection grids.
                </p>
              </div>

              {/* Action buttons header */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#052263] bg-[#052263] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#031849] disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <UploadCloud size={13} />
                      Upload New
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleMediaPicker}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#dde5ec] bg-white px-3 py-1.5 text-xs font-medium text-[#293447] shadow-sm transition hover:bg-[#f1f4f8]"
                >
                  <ImageIcon size={13} />
                  {showMediaPicker ? 'Hide Library' : 'Select Existing'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#dde5ec] bg-white px-3 py-1.5 text-xs font-medium text-[#293447] shadow-sm transition hover:bg-[#f1f4f8]"
                >
                  <Plus size={13} />
                  Add URL
                </button>
              </div>
            </div>

            {/* Hidden multi-file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />

            {uploadError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
                <CircleAlert size={14} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Add Direct URL bar */}
            {showUrlInput && (
              <div className="flex items-center gap-2 rounded-xl border border-[#dbe4eb] bg-white p-2.5 shadow-sm">
                <input
                  type="text"
                  value={directUrlInput}
                  onChange={(e) => setDirectUrlInput(e.target.value)}
                  placeholder="Paste direct image URL (e.g. /img/... or https://...)"
                  className="h-8 flex-1 rounded-lg border border-[#dde5ec] bg-[#fafcfd] px-2.5 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDirectUrl();
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddDirectUrl}
                  className="h-8 bg-[#052263] px-3 text-xs text-white hover:bg-[#031849]"
                >
                  Add Image
                </Button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(false)}
                  className="rounded-lg p-1 text-[#71808f] hover:bg-[#f2f5f8]"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Colour filter tabs + multi-select controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: 'ALL', label: 'All', count: images.length },
                  // Keep the tab alive while it is the active view so the
                  // grid never sits on a filter that has vanished.
                  ...(tagCounts.untagged > 0 || colorFilter === UNTAGGED_FILTER
                    ? [{ key: UNTAGGED_FILTER, label: 'Untagged', count: tagCounts.untagged }]
                    : []),
                  ...enabledColors.map((name) => ({
                    key: name,
                    label: name,
                    count: tagCounts.counts[name] || 0,
                    hex: getStandardColorHex(name),
                  })),
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => changeColorFilter(tab.key)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition',
                      colorFilter === tab.key
                        ? 'bg-[#052263] text-white shadow-sm'
                        : 'border border-[#dde5ec] bg-white text-[#556371] hover:bg-[#f1f4f8]',
                    )}
                  >
                    {'hex' in tab && tab.hex ? (
                      <span
                        className="size-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: tab.hex }}
                      />
                    ) : null}
                    {tab.label}
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-px text-[10px]',
                        colorFilter === tab.key ? 'bg-white/20' : 'bg-[#eef2f6] text-[#7e8a96]',
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {visibleImages.length > 0 && (
                <button
                  type="button"
                  onClick={toggleSelectAllVisible}
                  className="text-[11px] font-semibold text-[#052263] hover:underline"
                >
                  {allVisibleSelected
                    ? 'Clear selection'
                    : `Select all visible (${visibleImages.length})`}
                </button>
              )}
            </div>

            {/* Bulk actions for multi-selected images */}
            {selectedUrls.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#052263]/25 bg-[#052263]/5 px-3 py-2">
                <span className="text-xs font-bold text-[#052263]">
                  {selectedUrls.size} selected
                </span>

                {/* One click tags the whole batch to a colour, then the ticks reset */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium text-[#637282]">Assign to</span>
                  {enabledColors.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleBulkTag(name)}
                      title={`Tag the ${selectedUrls.size} selected image${
                        selectedUrls.size === 1 ? '' : 's'
                      } as ${name}, then clear the selection`}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold transition',
                        colorFilter === name
                          ? 'border-[#052263] bg-[#052263] text-white shadow-sm'
                          : 'border-[#dbe4eb] bg-white text-[#41505f] hover:border-[#b4c3d4] hover:bg-[#f7f9fb]',
                      )}
                    >
                      <span
                        className="size-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: getStandardColorHex(name) }}
                      />
                      {name}
                    </button>
                  ))}
                </div>

                {/* Reorder the whole ticked batch in one go */}
                <div className="flex items-center gap-1 border-l border-[#052263]/15 pl-2">
                  <span className="mr-0.5 text-[11px] font-medium text-[#637282]">Move</span>
                  <button
                    type="button"
                    disabled={!canMoveUp}
                    onClick={() => moveSelectedImages('up')}
                    title="Move selection up"
                    className="rounded p-1 text-[#41505f] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={!canMoveDown}
                    onClick={() => moveSelectedImages('down')}
                    title="Move selection down"
                    className="rounded p-1 text-[#41505f] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={!canMoveUp}
                    onClick={() => moveSelectedImages('top')}
                    title="Move selection to top"
                    className="rounded p-1 text-[#41505f] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowUpToLine size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={!canMoveDown}
                    onClick={() => moveSelectedImages('bottom')}
                    title="Move selection to bottom"
                    className="rounded p-1 text-[#41505f] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ArrowDownToLine size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={bulkClearTags}
                    className="rounded-lg border border-[#dde5ec] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#556371] hover:bg-[#f1f4f8]"
                  >
                    Remove tags
                  </button>
                  <button
                    type="button"
                    onClick={bulkDeleteImages}
                    className="rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUrls(new Set())}
                  className="ml-auto rounded-lg p-1 text-[#71808f] hover:bg-[#e9eef4]"
                  title="Clear selection"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Drag & Drop Area / Grid */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileUpload(e.dataTransfer.files);
                }
              }}
              className={cn(
                'rounded-xl border-2 border-dashed p-3 transition-colors',
                isDraggingOver
                  ? 'border-[#052263] bg-[#052263]/5'
                  : 'border-[#d8e1e8] bg-white'
              )}
            >
              {images.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center py-10 cursor-pointer text-center"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-[#f0f4f8] text-[#052263] mb-3">
                    <UploadCloud size={28} />
                  </div>
                  <p className="text-xs font-semibold text-[#1e293b]">
                    Click or drag & drop product images here
                  </p>
                  <p className="mt-1 text-[11px] text-[#71808f]">
                    Supports JPG, PNG, WEBP, AVIF (select multiple files to bulk upload)
                  </p>
                </div>
              ) : visibleImages.length === 0 ? (
                <div className="py-9 text-center text-xs text-[#71808f]">
                  No photos in{' '}
                  <strong className="text-[#293447]">
                    {colorFilter === UNTAGGED_FILTER ? 'Untagged' : colorFilter}
                  </strong>{' '}
                  yet.{' '}
                  {colorFilter === UNTAGGED_FILTER ? (
                    <>
                      Every image already has a colour — switch to{' '}
                      <strong className="text-[#293447]">All</strong> to keep working.
                    </>
                  ) : (
                    <>
                      Open the <strong className="text-[#293447]">All</strong> or{' '}
                      <strong className="text-[#293447]">Untagged</strong> tab, tick the photos
                      you want, then press{' '}
                      <strong className="text-[#293447]">Assign to</strong>.
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {visibleImages.map((imgUrl) => {
                    const idx = images.indexOf(imgUrl);
                    const visibleIndex = visibleImages.indexOf(imgUrl);
                    const isCover = idx === 0 || imgUrl === image;
                    const rawTag = imageTags[imgUrl];
                    const tag = rawTag && enabledColors.includes(rawTag) ? rawTag : '';
                    const isSelected = selectedUrls.has(imgUrl);
                    const isDropTarget = Boolean(
                      dropTargetUrl === imgUrl && dragUrl && dragUrl !== imgUrl,
                    );
                    return (
                      <div
                        key={imgUrl}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', imgUrl);
                          e.dataTransfer.effectAllowed = 'move';
                          setDragUrl(imgUrl);
                        }}
                        onDragOver={(e) => {
                          // External/file drags keep bubbling to the container.
                          if (!dragUrl || dragUrl === imgUrl) return;
                          e.preventDefault();
                          e.stopPropagation();
                          e.dataTransfer.dropEffect = 'move';
                          setDropTargetUrl(imgUrl);
                        }}
                        onDragLeave={() => {
                          setDropTargetUrl((current) => (current === imgUrl ? null : current));
                        }}
                        onDrop={(e) => {
                          // File drops belong to the container's upload handler.
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) return;
                          e.preventDefault();
                          e.stopPropagation();
                          handleDropImage(e.dataTransfer.getData('text/plain') || dragUrl, imgUrl);
                        }}
                        onDragEnd={() => {
                          setDragUrl(null);
                          setDropTargetUrl(null);
                        }}
                        className={cn(
                          'group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition',
                          isCover
                            ? 'border-2 border-[#052263] ring-2 ring-[#052263]/15'
                            : isDropTarget
                              ? 'border-2 border-dashed border-[#052263] bg-[#052263]/5'
                              : 'border-[#dde5ec] hover:border-[#b4c3d4]',
                          // Highlight the rest of the batch while it travels together.
                          dragGroupSize > 1 && isSelected && dragUrl !== imgUrl
                            ? 'ring-2 ring-[#052263]/45'
                            : null,
                        )}
                      >
                        {/* Image Preview Container */}
                        <div className="relative aspect-square w-full overflow-hidden bg-[#f3f6f9]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={`Product image ${idx + 1}`}
                            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/img/real-product-images/Forte/Forte-Naval-1.webp';
                            }}
                          />

                          {/* Cover / Position Badge */}
                          {isCover ? (
                            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-[#052263] px-2 py-0.5 text-[10px] font-bold text-white shadow">
                              <Star size={10} className="fill-white" />
                              Main Cover
                            </span>
                          ) : (
                            <span className="absolute top-2 left-2 inline-flex items-center rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                              #{idx + 1}
                            </span>
                          )}

                          {/* Whole-batch drag indicator */}
                          {dragGroupSize > 1 && dragUrl === imgUrl && (
                            <span className="absolute inset-0 z-20 flex items-center justify-center bg-[#052263]/45">
                              <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-[#052263] shadow">
                                Moving {dragGroupSize} images
                              </span>
                            </span>
                          )}

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetAsCover(imgUrl)}
                                title="Set as Main Cover image"
                                className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-[#052263] shadow hover:bg-neutral-100"
                              >
                                <Star size={11} className="fill-[#052263]" />
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(imgUrl)}
                              title="Delete from product"
                              className="rounded-lg bg-white p-1 text-rose-600 shadow hover:bg-rose-50"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Multi-select checkbox (above the hover overlay) */}
                          <label
                            className="absolute top-2 right-2 z-10 flex size-5 cursor-pointer items-center justify-center rounded-md border border-black/10 bg-white/95 shadow"
                            title="Select image"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(imgUrl)}
                              className="size-3.5 cursor-pointer accent-[#052263]"
                              aria-label={`Select image ${idx + 1}`}
                            />
                          </label>
                        </div>

                        {/* Colour tag for this image */}
                        <div className="flex items-center gap-1.5 border-t border-[#edf1f5] bg-[#fafcfd] px-2 py-1">
                          <span
                            className="size-2.5 shrink-0 rounded-full border border-black/15"
                            style={{
                              backgroundColor: tag ? getStandardColorHex(tag) : '#cbd5e1',
                            }}
                          />
                          <select
                            value={tag}
                            onChange={(e) => handleTagChange(imgUrl, e.target.value)}
                            aria-label={`Colour tag for image ${idx + 1}`}
                            title={
                              tag ? `Tagged as ${tag} — click to change` : 'Tag this image to a colour'
                            }
                            className="h-6 min-w-0 flex-1 cursor-pointer rounded-md border border-[#dde5ec] bg-white px-1 text-[10px] font-semibold text-[#41505f] outline-none transition focus:border-[#052263]"
                          >
                            <option value="">All colours</option>
                            {enabledColors.map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Bottom reorder toolbar */}
                        <div className="flex items-center justify-between border-t border-[#edf1f5] bg-[#fafcfd] px-2 py-1 text-[11px]">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={visibleIndex === 0}
                              onClick={() => handleMoveImage(imgUrl, 'left')}
                              title="Move earlier"
                              className="rounded p-0.5 text-[#627383] hover:bg-[#edf2f7] disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <ArrowLeft size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={visibleIndex === visibleImages.length - 1}
                              onClick={() => handleMoveImage(imgUrl, 'right')}
                              title="Move later"
                              className="rounded p-0.5 text-[#627383] hover:bg-[#edf2f7] disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <ArrowRight size={12} />
                            </button>
                            <span
                              className="ml-0.5 cursor-grab text-[#9aa7b4]"
                              title="Drag to reorder"
                            >
                              <GripVertical size={12} />
                            </span>
                          </div>

                          {!isCover ? (
                            <button
                              type="button"
                              onClick={() => handleSetAsCover(imgUrl)}
                              className="text-[10px] font-semibold text-[#052263] hover:underline"
                            >
                              Make cover
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-[#052263]">Cover</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add more tile inside grid */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-[#ccd7e2] bg-[#f8fafc] text-[#6b7b8a] transition hover:border-[#052263] hover:bg-white hover:text-[#052263]"
                  >
                    <Plus size={20} className="mb-1" />
                    <span className="text-[11px] font-semibold">Add more</span>
                  </button>
                </div>
              )}
            </div>

            {/* Expandable Media Library / Preset Picker */}
            {showMediaPicker && (
              <div className="mt-3 rounded-xl border border-[#dde5ec] bg-white p-3.5 space-y-3 shadow-sm">
                <div>
                  <p className="text-[11px] font-bold text-[#5c6c7a] mb-1.5 uppercase tracking-wider">
                    Quick Brand Presets (Click to add to gallery)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {catalogPresets.map((preset) => {
                      const isAdded = images.includes(preset.url);
                      return (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => handleAddPresetOrLibrary(preset.url)}
                          className={cn(
                            'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs border transition',
                            isAdded
                              ? 'border-[#052263] bg-[#e9ecf4] font-semibold text-[#031849]'
                              : 'border-[#dde5ec] bg-[#f9fafc] text-[#41505f] hover:bg-[#edf1f5]'
                          )}
                        >
                          {isAdded && <Check size={11} className="text-[#052263]" />}
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-[#5c6c7a] mb-1.5 uppercase tracking-wider">
                    Uploaded Media Library (Click to add to product)
                  </p>
                  {loadingMedia ? (
                    <div className="flex items-center justify-center py-4 text-xs text-[#71808f] gap-2">
                      <Loader2 size={14} className="animate-spin" /> Loading assets…
                    </div>
                  ) : libraryMedia.length === 0 ? (
                    <p className="text-xs text-[#71808f] py-2">
                      No uploaded media found yet. Upload a file above or pick a preset.
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                      {libraryMedia.map((media) => {
                        const isAdded = images.includes(media.url);
                        return (
                          <button
                            key={media.id}
                            type="button"
                            onClick={() => handleAddPresetOrLibrary(media.url)}
                            className={cn(
                              'group relative aspect-square overflow-hidden rounded-lg border transition hover:border-[#052263]',
                              isAdded
                                ? 'border-2 border-[#052263] ring-2 ring-[#052263]/20'
                                : 'border-[#dbe4eb]'
                            )}
                            title={media.filename}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={media.url}
                              alt={media.filename}
                              className="h-full w-full object-cover"
                            />
                            {isAdded && (
                              <div className="absolute inset-0 bg-[#052263]/30 flex items-center justify-center text-white">
                                <Check size={16} className="drop-shadow" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#293447] mb-1.5">Subtitle / Short description</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. 4-Way Stretch Performance Scrub Suit"
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#293447] mb-1.5">Detailed Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Premium tailored medical scrubs engineered with antibacterial and breathable fabric..."
              className="w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] p-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#edf1f5]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={onClose}
              className="border-[#dde5ec] text-[#556371]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-[#052263] text-white hover:bg-[#031849]"
            >
              {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
      </form>

      {isEdit && product ? (
        <div className="mt-6">
          <BundleOfferManager productId={product.id} productTitle={product.title} embedded />
        </div>
      ) : null}
    </AdminFullPage>
  );
}

