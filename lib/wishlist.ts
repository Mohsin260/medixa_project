'use client';

import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[];
  toggleWishlist: (slug: string) => boolean;
  isWishlisted: (slug: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (slug: string) => {
        const current = get().items;
        const exists = current.includes(slug);
        if (exists) {
          set({ items: current.filter((s) => s !== slug) });
          return false;
        } else {
          set({ items: [...current, slug] });
          return true;
        }
      },
      isWishlisted: (slug: string) => get().items.includes(slug),
      clear: () => set({ items: [] }),
    }),
    { name: 'medixa-wishlist' }
  )
);

const emptySubscribe = () => () => {};

export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function useWishlist() {
  const store = useWishlistStore();
  const isClient = useIsClient();

  return {
    items: isClient ? store.items : [],
    toggleWishlist: store.toggleWishlist,
    isWishlisted: (slug: string) => (isClient ? store.isWishlisted(slug) : false),
    clear: store.clear,
    isHydrated: isClient,
  };
}
