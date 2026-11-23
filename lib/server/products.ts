import { db } from '@/lib/db';
import { getProductBySlug as fallbackGetProduct, type Product } from '@/lib/products';

/**
 * Structural shape of a product row (with its relations) as returned by
 * `db.product.findUnique({ include: { category, collection, images, colors, sizes } })`.
 * Kept structural so both the storefront page and the product API can share
 * the same mapper without depending on generated Prisma payload generics.
 */
export interface StorefrontProductRecord {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: unknown;
  compareAt: unknown;
  badge: string | null;
  rating: number;
  reviewCount: number;
  features: string[];
  care: string | null;
  shipping: string | null;
  image: string;
  category: { name: string } | null;
  collection: { name: string } | null;
  images: Array<{ url: string }>;
  colors: Array<{ name: string; hex: string; images: string[] }>;
  sizes: Array<{ name: string }>;
}

/**
 * Builds the colour -> ordered image URLs map used by the product gallery.
 * Only colours that actually have tagged images are included so a colour
 * without images falls back to the full gallery instead of rendering empty.
 */
export function buildColorImages(
  dbColors: Array<{ name: string; images: string[] }>,
  fallback?: Product,
): Record<string, string[]> | undefined {
  const map: Record<string, string[]> = {};
  for (const color of dbColors) {
    if (Array.isArray(color.images) && color.images.length > 0) {
      map[color.name] = color.images;
    }
  }
  if (Object.keys(map).length > 0) {
    return map;
  }
  return fallback?.colorImages;
}

export function mapStorefrontProduct(
  p: StorefrontProductRecord,
  fallback: Product | undefined,
): Product {
  const imageList =
    p.images.length > 0
      ? p.images.map((img) => img.url)
      : p.image
      ? [p.image]
      : fallback?.images || [];

  const featuredImage = p.image || imageList[0] || fallback?.image || '';
  const finalImages = imageList.includes(featuredImage)
    ? [featuredImage, ...imageList.filter((url) => url !== featuredImage)]
    : [featuredImage, ...imageList].filter(Boolean);

  return {
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    category: (p.category?.name?.includes('Women')
      ? 'Women'
      : p.category?.name?.includes('Men')
      ? 'Men'
      : 'Unisex') as 'Men' | 'Women' | 'Unisex',
    collection: p.collection?.name || fallback?.collection || 'Standard',
    price: Number(p.price),
    compareAt: p.compareAt ? Number(p.compareAt) : fallback?.compareAt || Number(p.price) + 1000,
    rating: p.rating || fallback?.rating || 5,
    reviews: p.reviewCount || fallback?.reviews || 0,
    badge: p.badge || fallback?.badge,
    sku: `${p.slug.toUpperCase()}-STD`,
    image: featuredImage,
    images: finalImages.length > 0 ? finalImages : [featuredImage].filter(Boolean),
    colorImages: buildColorImages(p.colors, fallback),
    colors:
      p.colors.length > 0
        ? p.colors.map((c) => ({ name: c.name, value: c.hex }))
        : fallback?.colors || [{ name: 'Navy', value: '#1e3a5f' }],
    sizes:
      p.sizes.length > 0
        ? p.sizes.map((s) => s.name)
        : fallback?.sizes || ['XS', 'S', 'M', 'L', 'XL'],
    description: p.description || fallback?.description || '',
    features: p.features.length > 0 ? p.features : fallback?.features || [],
    care: p.care || fallback?.care || 'Machine wash cold with like colors.',
    shipping: p.shipping || fallback?.shipping || 'Nationwide delivery in 3-5 working days.',
  };
}

export async function getStorefrontProduct(slug: string): Promise<Product | undefined> {
  if (!slug) return undefined;

  try {
    const p = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { sortOrder: 'asc' } },
        colors: { orderBy: { sortOrder: 'asc' } },
        sizes: true,
      },
    });

    if (p) {
      return mapStorefrontProduct(p, fallbackGetProduct(slug));
    }
  } catch (err) {
    console.error('getStorefrontProduct db fetch error:', err);
  }

  return fallbackGetProduct(slug);
}
