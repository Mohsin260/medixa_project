'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const ProductSelectionContext = createContext(null);

export function ProductSelectionProvider({ colors, colorImages, fallbackImages = [], children }) {
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

export function useProductSelection() {
  return useContext(ProductSelectionContext);
}
