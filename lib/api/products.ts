import type { Product } from '@/lib/products';
import type { ProductListFilters } from '@/lib/query/query-keys';

export async function fetchProducts(filters: ProductListFilters = {}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.collection) params.set('collection', filters.collection);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.limit) params.set('limit', String(filters.limit));

    const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback below
  }

  return [];
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const res = await fetch(`/api/products/${slug}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.slug) return data;
    }
  } catch {
    // Fallback below
  }
  return undefined;
}

export async function fetchRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await fetchProducts();
  const sameCollection = all.filter(
    (item) => item.slug !== product.slug && item.collection === product.collection,
  );
  const others = all.filter(
    (item) => item.slug !== product.slug && item.collection !== product.collection,
  );
  return [...sameCollection, ...others].slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  return fetchProducts({ search: query, limit: 12 });
}
