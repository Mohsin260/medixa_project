'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
  searchProducts,
} from '@/lib/api/products';
import { queryKeys, type ProductListFilters } from '@/lib/query/query-keys';
import type { Product } from '@/lib/products';

export function useProducts(filters: ProductListFilters = {}): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => fetchProducts(filters),
  });
}

export function useProduct(slug: string | undefined): UseQueryResult<Product | undefined, Error> {
  return useQuery({
    queryKey: queryKeys.products.detail(slug ?? ''),
    queryFn: () => fetchProductBySlug(slug!),
    enabled: Boolean(slug),
  });
}

export function useRelatedProducts(
  product: Product | null | undefined,
  limit = 4,
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: queryKeys.products.related(product?.slug ?? '', limit),
    queryFn: () => fetchRelatedProducts(product!, limit),
    enabled: Boolean(product),
  });
}

export function useProductSearch(query: string): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: () => searchProducts(query),
    enabled: query.trim().length >= 2,
  });
}
