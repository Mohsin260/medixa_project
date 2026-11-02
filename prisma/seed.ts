import 'dotenv/config';
import { db } from '@/lib/db';
import { products } from '@/lib/products';

async function seed() {
  console.log('Seeding Medixa database...');

  // --- Categories ---
  const categories = await Promise.all(
    [
      { slug: 'men', name: 'Men', description: 'Male medical scrubs and uniforms' },
      { slug: 'women', name: 'Women', description: 'Female medical scrubs and uniforms' },
      { slug: 'unisex', name: 'Unisex', description: 'Unisex medical scrubs for all professionals' },
    ].map((data) =>
      db.category.upsert({
        where: { slug: data.slug },
        update: { name: data.name, description: data.description },
        create: data,
      }),
    ),
  );
  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  // --- Collections ---
  const collections = await Promise.all(
    [
      { slug: 'male-scrubs', name: 'Male Scrubs', description: 'Scrubs cut for men' },
      { slug: 'female-scrubs', name: 'Female Scrubs', description: 'Scrubs cut for women' },
      { slug: 'core-scrubs', name: 'Core Scrubs', description: 'Everyday unisex essentials' },
    ].map((data) =>
      db.collection.upsert({
        where: { slug: data.slug },
        update: { name: data.name, description: data.description },
        create: data,
      }),
    ),
  );
  const collectionByName = Object.fromEntries(collections.map((c) => [c.name, c]));

  // --- Products ---
  for (const product of products) {
    const categorySlug = product.category.toLowerCase();
    const collection = collectionByName[product.collection];

    const colors = product.colors.map((color, index) => ({
      name: color.name,
      hex: color.value,
      images: product.colorImages?.[color.name] ?? [],
      sortOrder: index,
    }));

    const sizes = product.sizes.map((name, index) => ({ name, sortOrder: index }));

    const existing = await db.product.findUnique({ where: { slug: product.slug } });

    if (existing) {
      console.log(`  - skip existing product: ${product.slug}`);
      continue;
    }

    const created = await db.product.create({
      data: {
        slug: product.slug,
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        price: product.price,
        compareAt: product.compareAt,
        badge: product.badge ?? null,
        rating: product.rating,
        reviewCount: product.reviews,
        features: product.features,
        care: product.care,
        shipping: product.shipping,
        status: 'PUBLISHED',
        image: product.image,
        category: { connect: { slug: categorySlug } },
        collection: collection ? { connect: { id: collection.id } } : undefined,
        images: {
          create: product.images.map((url, index) => ({
            url,
            alt: product.title,
            sortOrder: index,
          })),
        },
        colors: { create: colors },
        sizes: { create: sizes },
      },
      include: { colors: true, sizes: true },
    });

    // Full variant matrix: color × size with inventory
    const variantData = created.colors.flatMap((color) =>
      created.sizes.map((size) => ({
        productId: created.id,
        colorId: color.id,
        sizeId: size.id,
        sku: `${product.sku}-${color.name.slice(0, 3).toUpperCase()}-${size.name}`,
        price: product.price,
        compareAt: product.compareAt,
        inventory: 50,
      })),
    );

    await db.productVariant.createMany({ data: variantData, skipDuplicates: true });
    console.log(`  + product: ${product.slug} (${variantData.length} variants)`);
  }

  // --- Admin user ---
  await db.user.upsert({
    where: { email: 'admin@medixa.pk' },
    update: { role: 'ADMIN', name: 'Medixa Administrator', status: 'ACTIVE' },
    create: {
      email: 'admin@medixa.pk',
      name: 'Medixa Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // --- Shipping methods ---
  const shippingMethods = [
    {
      name: 'Nationwide Standard Delivery',
      fee: 250,
      freeOver: 10000,
      estimatedMinDays: 3,
      estimatedMaxDays: 5,
      provinces: [] as string[],
      sortOrder: 0,
    },
    {
      name: 'Express Major Cities',
      fee: 450,
      freeOver: null as number | null,
      estimatedMinDays: 1,
      estimatedMaxDays: 2,
      provinces: ['Punjab', 'Sindh', 'Islamabad Capital Territory'],
      sortOrder: 1,
    },
  ];

  for (const method of shippingMethods) {
    const existing = await db.shippingMethod.findFirst({ where: { name: method.name } });
    if (existing) continue;
    await db.shippingMethod.create({ data: method });
    console.log(`  + shipping: ${method.name}`);
  }

  // --- Tax rates (Pakistani sales tax by province, federal GST default) ---
  const taxRates = [
    { province: 'Punjab', rate: 0.18 },
    { province: 'Sindh', rate: 0.18 },
    { province: 'Khyber Pakhtunkhwa', rate: 0.195 },
    { province: 'Balochistan', rate: 0.18 },
    { province: 'Islamabad Capital Territory', rate: 0.18 },
    { province: 'Gilgit-Baltistan', rate: 0.16 },
    { province: 'Azad Jammu and Kashmir', rate: 0.16 },
  ];
  for (const tax of taxRates) {
    await db.taxRate.upsert({
      where: { province: tax.province },
      update: { rate: tax.rate },
      create: tax,
    });
  }

  // --- Coupons ---
  const coupons = [
    {
      code: 'WELCOME10',
      type: 'PERCENTAGE' as const,
      value: 10,
      minimumOrder: 3000,
      maximumDiscount: 1500,
      usageLimit: 1000,
    },
    {
      code: 'FREESHIP',
      type: 'FREE_SHIPPING' as const,
      value: 0,
      minimumOrder: 5000,
    },
    {
      code: 'FLAT500',
      type: 'FIXED' as const,
      value: 500,
      minimumOrder: 5000,
    },
  ];
  for (const coupon of coupons) {
    await db.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
    console.log(`  + coupon: ${coupon.code}`);
  }

  // --- Store settings ---
  const settings: Array<{ key: string; value: unknown }> = [
    { key: 'store_name', value: 'Medixa' },
    { key: 'store_email', value: 'support@medixa.pk' },
    { key: 'store_phone', value: '+92 300 0000000' },
    { key: 'currency', value: 'PKR' },
    { key: 'currency_symbol', value: 'Rs' },
    { key: 'free_shipping_threshold', value: 10000 },
    { key: 'default_delivery_fee', value: 250 },
    { key: 'order_prefix', value: 'MDX' },
  ];
  for (const setting of settings) {
    await db.storeSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: { key: setting.key, value: setting.value as object },
    });
  }

  const productCount = await db.product.count();
  const variantCount = await db.productVariant.count();
  console.log(`Done. Products: ${productCount}, Variants: ${variantCount}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
