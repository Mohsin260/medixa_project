'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  compareAt: number;
  color: string;
  size: string;
  quantity: number;
}

export type NewCartItem = Partial<CartItem> & Pick<CartItem, 'slug' | 'title' | 'image' | 'price'>;

const STORAGE_KEY = 'medixa-cart';
const MAX_QUANTITY = 99;

const buildItemId = (slug: string, color?: string, size?: string) =>
  `${slug}::${color || ''}::${size || ''}`;

function sanitizeItem(item: unknown): CartItem | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const {
    slug,
    title,
    image,
    color,
    size,
    id,
    price: rawPrice,
    compareAt: rawCompareAt,
    quantity: rawQuantity,
  } = item as Partial<CartItem>;

  const price = Number(rawPrice);
  const compareAt = Number(rawCompareAt);
  const quantity = Number(rawQuantity ?? 1);

  if (typeof slug !== 'string' || !slug) return null;
  if (typeof title !== 'string' || !title) return null;
  if (typeof image !== 'string' || !image) return null;
  if (!Number.isFinite(price) || price < 0) return null;
  if (!Number.isFinite(quantity) || quantity < 1) return null;

  return {
    id: typeof id === 'string' && id ? id : buildItemId(slug, color, size),
    slug,
    title,
    image,
    price,
    compareAt: Number.isFinite(compareAt) ? compareAt : price,
    color: typeof color === 'string' ? color : '',
    size: typeof size === 'string' ? size : '',
    quantity: Math.min(MAX_QUANTITY, Math.floor(quantity)),
  };
}

interface CartState {
  items: CartItem[];
  addItem: (item: NewCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        const cleanItem = sanitizeItem(item);
        if (!cleanItem) return;

        set((state) => {
          const existing = state.items.find((cartItem) => cartItem.id === cleanItem.id);
          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === cleanItem.id
                  ? { ...cartItem, quantity: Math.min(MAX_QUANTITY, cartItem.quantity + cleanItem.quantity) }
                  : cartItem,
              ),
            };
          }
          return { items: [...state.items, cleanItem] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        const nextQuantity = Number(quantity);
        if (!Number.isFinite(nextQuantity)) return;

        if (nextQuantity <= 0) {
          set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(MAX_QUANTITY, Math.floor(nextQuantity)) }
              : item,
          ),
        }));
      },

      clear: () => set({ items: [] }),
      setItems: (items) => set({ items }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<CartState> | undefined;
        const rawItems = Array.isArray(persistedState?.items) ? persistedState.items : [];
        return {
          ...current,
          items: rawItems.map(sanitizeItem).filter((item): item is CartItem => item !== null),
        };
      },
    },
  ),
);

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      useCartStore.persist.rehydrate();
    }
  });
}

export interface UseCartReturn {
  items: CartItem[];
  count: number;
  subtotal: number;
  addToCart: (item: NewCartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export function useCart(): UseCartReturn {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clear = useCartStore((state) => state.clear);

  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return {
    items,
    count,
    subtotal,
    addToCart: addItem,
    removeFromCart: removeItem,
    updateCartQuantity: updateQuantity,
    clearCart: clear,
  };
}
