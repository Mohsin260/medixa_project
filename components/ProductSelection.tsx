'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ProductColor } from '@/lib/products';

interface ProductSelectionContextValue {
  color: string;
  setColor: (color: string) => void;
  colorImages: Record<string, string[]> | undefined;
  images: string[];
}

const ProductSelectionContext = createContext<ProductSelectionContextValue | null>(null);

interface ProductSelectionProviderProps {
  colors: ProductColor[];
  colorImages?: Record<string, string[]>;
  fallbackImages?: string[];
  children: ReactNode;
}

export function ProductSelectionProvider({
  colors,
  colorImages,
  fallbackImages = [],
  children,
}: ProductSelectionProviderProps) {
  const [color, setColor] = useState(colors[0]?.name || '');

  const images = (colorImages && colorImages[color]) || fallbackImages;

  const value = useMemo(
    () => ({
      color,
      setColor,
      colorImages,
      images,
    }),
    [color, colorImages, images],
  );

  return (
    <ProductSelectionContext.Provider value={value}>
      {children}
    </ProductSelectionContext.Provider>
  );
}

export function useProductSelection(): ProductSelectionContextValue | null {
  return useContext(ProductSelectionContext);
}
