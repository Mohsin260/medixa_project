export interface ProductColor {
  name: string;
  value: string;
}

export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  category: 'Men' | 'Women' | 'Unisex';
  collection: string;
  price: number;
  compareAt: number;
  rating: number;
  reviews: number;
  badge?: string;
  sku: string;
  image: string;
  images: string[];
  colorImages?: Record<string, string[]>;
  colors: ProductColor[];
  sizes: string[];
  description: string;
  features: string[];
  care: string;
  shipping: string;
}

const GALLERY = [
  '/img/single-product/product-large1.jpg',
  '/img/single-product/product-large2.jpg',
  '/img/single-product/product-large3.jpg',
];

const COLORS: ProductColor[] = [
  { name: 'Black', value: '#000000' },
  { name: 'Grey', value: '#64748b' },
  { name: 'Olive Green', value: '#365314' },
  { name: 'Maroon', value: '#7f1d1d' },
  { name: 'Naval Light', value: '#1e3a5f' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const realImage = (folder: string, file: string) => `/img/real-product-images/${folder}/${file}`;
const imageSet = (folder: string, files: string[]) => files.map((file) => realImage(folder, file));
const flattenImages = (colorImages: Record<string, string[]>) => Object.values(colorImages).flat();

const REGAL_THUMBNAIL = realImage('regal', 'regal-thumbnail.webp');
const REGAL_COLOR_IMAGES: Record<string, string[]> = {
  Black: imageSet('regal', ['Regel-Black-1.webp', 'Regel-Black-2.webp', 'Regel-Black-3.webp', 'Regel-Black-4.webp']),
  Grey: imageSet('regal', ['Regel-Grey-1.webp', 'Regel-Grey-2.webp']),
  'Olive Green': imageSet('regal', ['Regel-Olive-1.webp', 'Regel-Olive-2.webp', 'Regel-Olive-3.webp']),
  Maroon: imageSet('regal', ['Regel-Maroon-1.webp', 'Regel-Maroon-2.webp', 'Regel-Maroon-3.webp']),
  'Naval Light': imageSet('regal', ['Regel-Naval-1.webp', 'Regel-Naval-2.webp']),
};

const MUSE_THUMBNAIL = realImage('muse', 'muse-thumbnail.webp');
const MUSE_COLOR_IMAGES: Record<string, string[]> = {
  Black: imageSet('muse', ['muse-black-1.webp', 'muse-black-2.webp', 'muse-black-3.webp']),
  Grey: imageSet('muse', ['muse-grey-1.webp']),
  'Olive Green': imageSet('muse', ['muse-Olive-1.webp', 'muse-Olive-2.webp', 'muse-Olive-3.webp', 'muse-Olive-4.webp']),
  Maroon: imageSet('muse', ['muse-Maroon-1.webp', 'muse-Maroon-2.webp', 'muse-Maroon-3.webp', 'muse-Maroon-4.webp', 'muse-Maroon-5.webp']),
  'Naval Light': imageSet('muse', ['muse-Naval-1.webp', 'muse-Naval-2.webp', 'muse-Naval-3.webp', 'muse-Naval-4.webp']),
};

const FORTE_THUMBNAIL = realImage('Forte', 'Forte-thumbnail.webp');
const FORTE_COLOR_IMAGES: Record<string, string[]> = {
  Black: imageSet('Forte', ['Forte-Black-1.webp', 'Forte-Black-2.webp', 'Forte-Black-3.webp']),
  Grey: imageSet('Forte', ['Forte-Grey-1.webp', 'Forte-Grey-2.webp', 'Forte-Grey-3.webp']),
  'Olive Green': imageSet('Forte', ['Forte-Olive-1.webp', 'Forte-Olive-2.webp', 'Forte-Olive-3.webp']),
  Maroon: imageSet('Forte', ['Forte-Maroon-1.webp', 'Forte-Maroon-2.webp', 'Forte-Maroon-3.webp']),
  'Naval Light': imageSet('Forte', ['Forte-Naval-1.webp', 'Forte-Naval-2.webp', 'Forte-Naval-3.webp']),
};

const REBEL_THUMBNAIL = realImage('rebel', 'Rebel-thumbnail.webp');
const REBEL_COLOR_IMAGES: Record<string, string[]> = {
  Black: imageSet('rebel', ['Rebel-Black-1.webp', 'Rebel-Black-2.webp', 'Rebel-Black-3.webp', 'Rebel-Black-4.webp']),
  Grey: imageSet('rebel', ['Rebel-Grey-1.webp', 'Rebel-Grey-2.webp', 'Rebel-Grey-3.webp', 'Rebel-Grey-4.webp']),
  Maroon: imageSet('rebel', ['Rebel-Maroon-1.webp', 'Rebel-Maroon-2.webp', 'Rebel-Maroon-3.webp', 'Rebel-Maroon-4.webp']),
  'Naval Light': imageSet('rebel', ['Rebel-Naval-1.webp', 'Rebel-Naval-2.webp', 'Rebel-Naval-3.webp']),
};
const REBEL_COLORS = COLORS.filter((color) => color.name !== 'Olive Green');

export const formatPrice = (value: number) => `Rs ${value.toLocaleString('en-PK')}`;

export const products: Product[] = [
  {
    slug: 'regal-round-neck-male-medical-scrubs-pakistan',
    title: 'Regal Scrub Suits',
    subtitle: 'Round-neck male medical scrubs',
    category: 'Men',
    collection: 'Male Scrubs',
    price: 5715,
    compareAt: 6350,
    rating: 4.9,
    reviews: 128,
    sku: 'MDX-REG-RN',
    image: REGAL_THUMBNAIL,
    images: flattenImages(REGAL_COLOR_IMAGES),
    colorImages: REGAL_COLOR_IMAGES,
    colors: COLORS,
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Premium male medical scrubs in Pakistan, trusted by healthcare professionals. The round-neck scrub shirt and straight-fit trousers are cut for comfort and mobility through long shifts, in a breathable, wrinkle-resistant fabric that is easy to care for.',
    features: [
      'Premium male medical scrubs in Pakistan, trusted by healthcare professionals',
      'Round-neck scrub shirt for a modern, professional look',
      'Straight-fit trousers for comfort and mobility',
      'Breathable, durable fabric perfect for long shifts',
      'Easy-care, wrinkle-resistant material',
      'Ideal for nurse uniforms, doctor scrubs, and hospital wear',
    ],
    care:
      'Machine wash cold with like colors. Do not bleach. Tumble dry low. Do not iron directly on print or embroidery.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'muse-v-neck-female-medical-scrubs-pakistan',
    title: 'Muse Scrub Suits',
    subtitle: 'V-neck female medical scrubs',
    category: 'Women',
    collection: 'Female Scrubs',
    price: 5391,
    compareAt: 5990,
    rating: 4.9,
    reviews: 214,
    badge: 'Best seller',
    sku: 'MDX-MUS-VNECK',
    image: MUSE_THUMBNAIL,
    images: flattenImages(MUSE_COLOR_IMAGES),
    colorImages: MUSE_COLOR_IMAGES,
    colors: COLORS,
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Premium female medical scrubs in Pakistan, trusted by healthcare professionals. The V-neck scrub shirt and straight-fit trousers deliver a modern, professional look with breathable comfort for long shifts. Ideal for female doctors, nurses, and medical students across Pakistan.',
    features: [
      'Premium female medical scrubs in Pakistan, trusted by healthcare professionals',
      'V-neck scrub shirt for a modern, professional look',
      'Straight-fit trousers for comfort and mobility',
      'Breathable, durable fabric perfect for long shifts',
      'Easy-care, wrinkle-resistant material',
      'Ideal for nurse uniforms, doctor scrubs, and hospital wear',
    ],
    care:
      'Machine wash cold with like colors. Do not bleach. Tumble dry low. Do not iron directly on print or embroidery.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'forte-v-neck-male-medical-scrubs-pakistan',
    title: 'Forte Scrub Suits',
    subtitle: 'V-neck male medical scrubs',
    category: 'Men',
    collection: 'Male Scrubs',
    price: 5391,
    compareAt: 5990,
    rating: 4.8,
    reviews: 96,
    sku: 'MDX-FOR-VNECK',
    image: FORTE_THUMBNAIL,
    images: flattenImages(FORTE_COLOR_IMAGES),
    colorImages: FORTE_COLOR_IMAGES,
    colors: COLORS,
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Premium male medical scrubs in Pakistan, trusted by healthcare professionals. The V-neck scrub shirt and straight-fit trousers are cut for a modern, professional look with breathable comfort through long shifts.',
    features: [
      'Premium male medical scrubs in Pakistan, trusted by healthcare professionals',
      'V-neck scrub shirt for a modern, professional look',
      'Straight-fit trousers for comfort and mobility',
      'Breathable, durable fabric perfect for long shifts',
      'Easy-care, wrinkle-resistant material',
      'Ideal for nurse uniforms, doctor scrubs, and hospital wear',
    ],
    care:
      'Machine wash cold with like colors. Do not bleach. Tumble dry low. Do not iron directly on print or embroidery.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'rebel-collar-neck-female-medical-scrubs-pakistan',
    title: 'Rebel Scrub Suits',
    subtitle: 'Collar-neck female medical scrubs',
    category: 'Women',
    collection: 'Female Scrubs',
    price: 5805,
    compareAt: 6450,
    rating: 4.8,
    reviews: 88,
    sku: 'MDX-REB-CN',
    image: REBEL_THUMBNAIL,
    images: flattenImages(REBEL_COLOR_IMAGES),
    colorImages: REBEL_COLOR_IMAGES,
    colors: REBEL_COLORS,
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Premium female medical scrubs in Pakistan, trusted by healthcare professionals. The collar-neck scrub shirt and straight-fit trousers deliver a polished, professional look with breathable comfort for long shifts.',
    features: [
      'Premium female medical scrubs in Pakistan, trusted by healthcare professionals',
      'Collar-neck scrub shirt for a modern, professional look',
      'Straight-fit trousers for comfort and mobility',
      'Breathable, durable fabric perfect for long shifts',
      'Easy-care, wrinkle-resistant material',
      'Ideal for all kinds of professions and hospital wear',
    ],
    care:
      'Machine wash cold with like colors. Do not bleach. Tumble dry low. Do not iron directly on print or embroidery.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'rolls-dress-ck-2845',
    title: 'Rolls Dress CK 2845',
    subtitle: 'Stretch cargo scrub suit',
    category: 'Men',
    collection: 'Male Scrubs',
    price: 6690,
    compareAt: 8290,
    rating: 4.9,
    reviews: 203,
    badge: 'Top rated',
    sku: 'MDX-ROL-2845',
    image: '/img/feature-item/feature4.jpg',
    images: ['/img/feature-item/feature4.jpg', ...GALLERY],
    colors: COLORS,
    sizes: SIZES,
    description:
      'Built for clinicians who carry everything with them. Cargo-style pockets, a secure zip pocket, and a flexible stretch weave make this the most practical scrub suit in the collection.',
    features: [
      'Cargo scrub trousers with multiple utility pockets',
      'Hidden zip pocket for keys and cards',
      'Soft stretch weave that breathes on long shifts',
      'Reinforced knees and stress points',
      'Elastic waist with an internal drawcord',
      'Available in a full range of professional colours',
    ],
    care:
      'Machine wash cold with like colours. Do not bleach. Tumble dry low. Warm iron on reverse if needed.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'reine-dress-cj-2145',
    title: 'Reine Dress CJ 2145',
    subtitle: 'Tailored female scrub suit',
    category: 'Women',
    collection: 'Female Scrubs',
    price: 6290,
    compareAt: 7790,
    rating: 4.8,
    reviews: 147,
    badge: 'New',
    sku: 'MDX-REI-2145',
    image: '/img/feature-item/feature5.jpg',
    images: ['/img/feature-item/feature5.jpg', ...GALLERY],
    colors: COLORS,
    sizes: SIZES,
    description:
      'A tailored scrub suit with a flattering neckline and a clean, modern silhouette. The lightweight fabric feels cool under pressure and keeps its finish through the longest rotations.',
    features: [
      'Tailored female fit with a modern neckline',
      'Lightweight, breathable performance fabric',
      'Four functional pockets across the set',
      'Colour-lock and anti-pill finish',
      'Comfort waistband with a soft inner lining',
      'Designed for nurses, doctors, and students',
    ],
    care:
      'Machine wash cold with like colours. Do not bleach. Tumble dry low. Do not iron directly on print or embroidery.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'rififi-dress-cy-78795',
    title: 'Rififi Dress CY 78795',
    subtitle: 'Lightweight daily scrub suit',
    category: 'Women',
    collection: 'Female Scrubs',
    price: 5490,
    compareAt: 6790,
    rating: 4.6,
    reviews: 72,
    badge: 'Value pick',
    sku: 'MDX-RIF-7879L',
    image: '/img/feature-item/feature6.jpg',
    images: ['/img/feature-item/feature6.jpg', ...GALLERY],
    colors: COLORS,
    sizes: SIZES,
    description:
      'An easy, lightweight scrub suit for daily ward wear. The relaxed cut layers comfortably under a white coat and the quick-dry fabric makes laundry day simpler.',
    features: [
      'Lightweight quick-dry fabric',
      'Relaxed fit that layers under a lab coat',
      'Two deep side pockets and a chest pocket',
      'Stain-release, easy-care finish',
      'Soft anti-chafe seams',
      'Great for students and rotating staff',
    ],
    care:
      'Machine wash cold with like colours. Do not bleach. Tumble dry low. Warm iron on reverse if needed.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'rolls-dress-ck',
    title: 'Rolls Dress CK',
    subtitle: 'Everyday medical scrub suit',
    category: 'Men',
    collection: 'Male Scrubs',
    price: 5590,
    compareAt: 6990,
    rating: 4.5,
    reviews: 64,
    badge: 'Best seller',
    sku: 'MDX-ROL-2845B',
    image: '/img/top-sale-trend/top1.jpg',
    images: ['/img/top-sale-trend/top1.jpg', ...GALLERY],
    colors: COLORS,
    sizes: SIZES,
    description:
      'A dependable everyday scrub suit with a clean, professional cut. The breathable fabric and reinforced seams are made to survive back-to-back shifts and frequent washing.',
    features: [
      'Breathable everyday scrub fabric',
      'Reinforced seams at high-stress points',
      'Straight-leg trousers with an elastic waist',
      'Two lower pockets and one chest pocket',
      'Fade-resistant colour',
      'Ideal for hospital and clinic teams',
    ],
    care:
      'Machine wash cold with like colours. Do not bleach. Tumble dry low. Do not iron directly on print or embroidery.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'untice-dress-ck',
    title: 'Untice Dress CK',
    subtitle: 'Soft-touch scrub suit',
    category: 'Unisex',
    collection: 'Core Scrubs',
    price: 5990,
    compareAt: 7290,
    rating: 4.7,
    reviews: 88,
    badge: 'Staff pick',
    sku: 'MDX-UNT-2845',
    image: '/img/top-sale-trend/top2.jpg',
    images: ['/img/top-sale-trend/top2.jpg', ...GALLERY],
    colors: COLORS,
    sizes: SIZES,
    description:
      'Soft-touch scrubs with a relaxed unisex fit. The smooth fabric feels gentle against the skin and the simple silhouette works for every member of the clinical team.',
    features: [
      'Soft-touch brushed fabric',
      'Relaxed unisex fit',
      'Elastic waist with an adjustable drawcord',
      'Three practical pockets',
      'Breathable for long shifts',
      'Easy-care, low-iron finish',
    ],
    care:
      'Machine wash cold with like colours. Do not bleach. Tumble dry low. Warm iron on reverse if needed.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'sports-dress',
    title: 'Sports Dress',
    subtitle: 'Active medical scrub suit',
    category: 'Unisex',
    collection: 'Core Scrubs',
    price: 5290,
    compareAt: 6490,
    rating: 4.4,
    reviews: 51,
    badge: 'Value pick',
    sku: 'MDX-SPT-2845',
    image: '/img/top-sale-trend/sale1.jpg',
    images: ['/img/top-sale-trend/sale1.jpg', ...GALLERY],
    colors: COLORS,
    sizes: SIZES,
    description:
      'An active scrub suit for teams on the move. The flexible weave stretches where you need it and the sporty cut keeps you cool through busy rounds and emergency calls.',
    features: [
      'Flexible stretch weave for active days',
      'Sporty, streamlined cut',
      'Moisture-wicking inner finish',
      'Two zip side pockets',
      'Durable, colour-lock fabric',
      'Great for emergency and theatre teams',
    ],
    care:
      'Machine wash cold with like colours. Do not bleach. Tumble dry low. Do not iron directly on print or embroidery.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
  {
    slug: 'dollice-dress-ck',
    title: 'Dollice Dress CK',
    subtitle: 'Premium tailored scrub suit',
    category: 'Women',
    collection: 'Female Scrubs',
    price: 6890,
    compareAt: 8490,
    rating: 4.8,
    reviews: 119,
    badge: 'Premium',
    sku: 'MDX-DOL-2845',
    image: '/img/top-sale-trend/trend2.jpg',
    images: ['/img/top-sale-trend/trend2.jpg', ...GALLERY],
    colors: COLORS,
    sizes: SIZES,
    description:
      'Our premium tailored scrub suit, finished with clean lines and considered details. The structured yet soft fabric holds a sharp look from morning handover to evening rounds.',
    features: [
      'Premium structured stretch fabric',
      'Tailored fit with a clean neckline',
      'Five pockets including a hidden card pocket',
      'Soft-touch inner waistband',
      'Crease-resistant, colour-lock finish',
      'A polished choice for senior clinical staff',
    ],
    care:
      'Machine wash cold with like colours. Do not bleach. Tumble dry low. Warm iron on reverse if needed.',
    shipping:
      'Free shipping nationwide. Delivery in 3-5 business days. Returns accepted within 7 days of delivery in original condition.',
  },
];

export const SLUG_ALIASES: Record<string, string> = {
  'muse-round-neck-female-medical-scrubs-pakistan': 'muse-v-neck-female-medical-scrubs-pakistan',
  'rebel-v-neck-female-medical-scrubs-pakistan': 'rebel-collar-neck-female-medical-scrubs-pakistan',
  regal: 'regal-round-neck-male-medical-scrubs-pakistan',
  muse: 'muse-v-neck-female-medical-scrubs-pakistan',
  forte: 'forte-v-neck-male-medical-scrubs-pakistan',
  rebel: 'rebel-collar-neck-female-medical-scrubs-pakistan',
};

export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();

  // 1. Direct slug match
  const direct = products.find((product) => product.slug.toLowerCase() === normalized);
  if (direct) return direct;

  // 2. Known alias resolution
  const aliased = SLUG_ALIASES[normalized];
  if (aliased) {
    const found = products.find((product) => product.slug === aliased);
    if (found) return found;
  }

  // 3. Keyword / prefix match fallback
  return products.find((product) => {
    const pSlug = product.slug.toLowerCase();
    const pPrefix = pSlug.split('-')[0];
    return pSlug.includes(normalized) || normalized.includes(pPrefix);
  });
}

export function getProductSlugs(): Array<{ slug: string }> {
  const directSlugs = products.map((product) => ({ slug: product.slug }));
  const aliasSlugs = Object.keys(SLUG_ALIASES).map((slug) => ({ slug }));
  return [...directSlugs, ...aliasSlugs];
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCollection = products.filter(
    (item) => item.slug !== product.slug && item.collection === product.collection,
  );
  const others = products.filter(
    (item) => item.slug !== product.slug && item.collection !== product.collection,
  );
  return [...sameCollection, ...others].slice(0, limit);
}
