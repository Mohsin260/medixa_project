'use client';

import { create } from 'zustand';

interface UiState {
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  quickViewSlug: string | null;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  mobileMenuOpen: false,
  searchOpen: false,
  quickViewSlug: null,

  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),

  openQuickView: (slug) => set({ quickViewSlug: slug }),
  closeQuickView: () => set({ quickViewSlug: null }),
}));
