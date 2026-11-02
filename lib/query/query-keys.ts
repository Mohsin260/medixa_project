export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters?: ProductListFilters) => ['products', 'list', filters ?? {}] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
    related: (slug: string, limit?: number) => ['products', 'related', slug, limit ?? 4] as const,
    search: (query: string) => ['products', 'search', query] as const,
  },
  cart: {
    all: ['cart'] as const,
    summary: ['cart', 'summary'] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (userId?: string) => ['orders', 'list', userId ?? 'guest'] as const,
    detail: (orderNumber: string) => ['orders', 'detail', orderNumber] as const,
  },
  admin: {
    stats: ['admin', 'stats'] as const,
    products: (filters?: unknown) => ['admin', 'products', filters ?? {}] as const,
    orders: (filters?: unknown) => ['admin', 'orders', filters ?? {}] as const,
    customers: (filters?: unknown) => ['admin', 'customers', filters ?? {}] as const,
    coupons: ['admin', 'coupons'] as const,
  },
} as const;

export interface ProductListFilters {
  category?: string;
  collection?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}
