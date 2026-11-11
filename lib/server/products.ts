import { db } from '@/lib/db';
import { getProductBySlug as fallbackGetProduct, type Product } from '@/lib/products';

export async function getStorefrontProduct(slug: string): Promise<Product | undefined> {
  if (!slug) return undefined;

  try {
    const p = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        collection: true,
        images: { orderBy: { sortOrder: 'asc' } },
        colors: true,
        sizes: true,
      },
    });

    if (p) {
      const fallback = fallbackGetProduct(slug);
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
        colorImages: fallback?.colorImages,
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
  } catch (err) {
    console.error('getStorefrontProduct db fetch error:', err);
  }

  return fallbackGetProduct(slug);
}

