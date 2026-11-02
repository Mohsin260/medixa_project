import { products as localProducts, type Product } from '@/lib/products';
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

  // Fallback to local items if offline
  let result = [...localProducts];
  if (filters.category) {
    result = result.filter((product) => product.category === filters.category);
  }
  if (filters.collection) {
    result = result.filter((product) => product.collection === filters.collection);
  }
  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.subtitle.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query),
    );
  }
  if (typeof filters.minPrice === 'number') {
    result = result.filter((product) => product.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === 'number') {
    result = result.filter((product) => product.price <= filters.maxPrice!);
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'popular':
      result.sort((a, b) => b.reviews - a.reviews);
      break;
    default:
      break;
  }

  if (filters.page && filters.limit) {
    const start = (filters.page - 1) * filters.limit;
    result = result.slice(start, start + filters.limit);
  }

  return result;
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
  return localProducts.find((product) => product.slug === slug);
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
