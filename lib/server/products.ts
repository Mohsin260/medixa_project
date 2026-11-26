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
  galleryImages: string[] = [],
): Record<string, string[]> | undefined {
  const map: Record<string, string[]> = {};
  for (const color of dbColors) {
    const taggedImages = Array.isArray(color.images) ? color.images : [];
    const fallbackImages = Object.entries(fallback?.colorImages || {}).find(
      ([name]) => name.trim().replace(/\s+/g, ' ').toLowerCase() === color.name.trim().replace(/\s+/g, ' ').toLowerCase(),
    )?.[1] || [];
    const normalizedColorName = color.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const imagesFromGallery = galleryImages.filter((image) => {
      const filename = image.split(/[?#]/, 1)[0].split('/').pop() || '';
      const normalizedFilename = filename
        .replace(/%20/gi, ' ')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
      return ` ${normalizedFilename} `.includes(` ${normalizedColorName} `);
    });
    const images = taggedImages.length > 0
      ? taggedImages
      : imagesFromGallery.length > 0
        ? imagesFromGallery
        : fallbackImages;

    if (images.length > 0) map[color.name] = images;
  }
  return Object.keys(map).length > 0 ? map : undefined;
}

export function getFeaturedImageColor(
  image: string,
  colors: Array<{ name: string; images: string[] }>,
): string | undefined {
  const featuredImage = image.trim();
  return colors.find((color) => color.images.some((url) => url.trim() === featuredImage))?.name;
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
    featuredColor: getFeaturedImageColor(featuredImage, p.colors),
    images: finalImages.length > 0 ? finalImages : [featuredImage].filter(Boolean),
    colorImages: buildColorImages(p.colors, fallback, imageList),
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

export async function getStorefrontFeaturedProductImage(): Promise<string | undefined> {
  try {
    const product = await db.product.findFirst({
      where: { status: 'PUBLISHED', image: { not: '' } },
      orderBy: { updatedAt: 'desc' },
      select: { image: true, images: { select: { url: true }, orderBy: { sortOrder: 'asc' } } },
    });

    return product?.image || product?.images[0]?.url;
  } catch (err) {
    console.error('getStorefrontFeaturedProductImage db fetch error:', err);
    return undefined;
  }
}

export async function getStorefrontRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  try {
    const categoryName = product.category;
    const records = await db.product.findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: product.slug },
        OR: [
          { category: { is: { name: { contains: categoryName, mode: 'insensitive' } } } },
          { collection: { is: { name: { equals: product.collection, mode: 'insensitive' } } } },
        ],
      },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { sortOrder: 'asc' } },
        colors: { orderBy: { sortOrder: 'asc' } },
        sizes: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit * 4,
    });

    return records
      .map((record) => mapStorefrontProduct(record, undefined))
      .filter((related) => related.category === product.category && Boolean(related.image))
      .sort(
        (a, b) =>
          Number(b.collection === product.collection) -
          Number(a.collection === product.collection),
      )
      .slice(0, limit);
  } catch (err) {
    console.error('getStorefrontRelatedProducts db fetch error:', err);
    return [];
  }
}
