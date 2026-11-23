import { getStandardColorHex, STANDARD_COLORS } from '@/lib/products';

export interface NormalizedProductColor {
  name: string;
  hex: string;
  images: string[];
  sortOrder: number;
}

/**
 * The default colour palette a product gets when the client does not send an
 * explicit colour selection (mirrors the standard Medixa palette).
 */
export function defaultProductColorRows(): NormalizedProductColor[] {
  return STANDARD_COLORS.map((color, index) => ({
    name: color.name,
    hex: color.value,
    images: [],
    sortOrder: index,
  }));
}

/**
 * Normalizes the colour payload of a product create/update request.
 *
 * - `colors`      -> ordered list of colours the product offers
 *                    (strings or `{ name, hex?, images? }` objects).
 * - `colorImages` -> `Record<colourName, imageUrls>` tagging images to colours.
 * - `baseColors`  -> palette to fall back to when `colors` is omitted
 *                    (existing rows on update, standard palette on create).
 * - `allowedUrls` -> when provided, tagged URLs outside the product gallery
 *                    are dropped so colour galleries never reference orphans.
 *
 * Returns `{ error }` when the payload is invalid (e.g. an empty palette).
 */
export function normalizeProductColors(options: {
  colors?: unknown;
  colorImages?: unknown;
  baseColors?: Array<{ name: string; hex: string; images?: string[] }>;
  allowedUrls?: Set<string> | null;
}): { error?: string; rows: NormalizedProductColor[] } {
  const { colors, colorImages, baseColors = [], allowedUrls = null } = options;

  const hasColors = colors !== undefined;
  const hasColorImages = colorImages !== undefined;
  if (!hasColors && !hasColorImages) {
    return { rows: [] };
  }

  let rows: NormalizedProductColor[];

  if (hasColors) {
    if (!Array.isArray(colors) || colors.length === 0) {
      return { error: 'At least one colour is required', rows: [] };
    }
    rows = colors
      .map((item: unknown, index: number): NormalizedProductColor | null => {
        if (typeof item === 'string' && item.trim()) {
          const name = item.trim();
          return { name, hex: getStandardColorHex(name), images: [], sortOrder: index };
        }
        if (item && typeof item === 'object' && 'name' in item) {
          const typed = item as { name?: unknown; hex?: unknown; images?: unknown };
          const name = typeof typed.name === 'string' ? typed.name.trim() : '';
          if (!name) return null;
          return {
            name,
            hex:
              typeof typed.hex === 'string' && typed.hex
                ? typed.hex
                : getStandardColorHex(name),
            images: Array.isArray(typed.images)
              ? typed.images.filter((url): url is string => typeof url === 'string')
              : [],
            sortOrder: index,
          };
        }
        return null;
      })
      .filter((row): row is NormalizedProductColor => Boolean(row));

    if (rows.length === 0) {
      return { error: 'At least one colour is required', rows: [] };
    }
  } else {
    rows = baseColors.map((color, index) => ({
      name: color.name,
      hex: color.hex || getStandardColorHex(color.name),
      images: Array.isArray(color.images) ? [...color.images] : [],
      sortOrder: index,
    }));
  }

  const colorImagesMap =
    colorImages && typeof colorImages === 'object' && !Array.isArray(colorImages)
      ? (colorImages as Record<string, unknown>)
      : null;

  if (colorImagesMap) {
    rows = rows.map((row) => {
      const mapped = colorImagesMap[row.name];
      if (Array.isArray(mapped)) {
        const urls = [
          ...new Set(mapped.filter((url): url is string => typeof url === 'string')),
        ];
        return {
          ...row,
          images: allowedUrls ? urls.filter((url) => allowedUrls.has(url)) : urls,
        };
      }
      // The map overrides the colours it defines. Keys it omits keep whatever
      // the colour already carries (inline images, base palette images, or —
      // for a full colours payload with no inline images — nothing).
      return row;
    });
  }

  return { rows };
}
