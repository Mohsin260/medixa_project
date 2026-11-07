/* eslint-disable @next/next/no-html-link-for-pages */
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LegacyScripts from '@/components/LegacyScripts';
import { ProductBundleSection } from '@/components/ProductBundleSection';
import ProductGallery from '@/components/ProductGallery';
import ProductPurchasePanel from '@/components/ProductPurchasePanel';
import { ProductSelectionProvider } from '@/components/ProductSelection';
import { formatPrice, getProductBySlug, getProductSlugs, getRelatedProducts } from '@/lib/products';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export function generateStaticParams() {
  return getProductSlugs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product not found | Medixa',
    };
  }

  return {
    title: `${product.title} | Medixa`,
    description: product.description,
  };
}

function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25;

  return (
    <div className={styles.ratingRow}>
      <div className={styles.stars} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => {
          if (index < fullStars) {
            return <i key={index} className="fa fa-star" />;
          }
          if (index === fullStars && hasHalfStar) {
            return <i key={index} className="fa fa-star-half-o" />;
          }
          return <i key={index} className="fa fa-star-o" />;
        })}
      </div>
      <span className={styles.ratingText}>
        {rating.toFixed(1)} ({reviews} reviews)
      </span>
    </div>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);
  const discount = Math.round(((product.compareAt - product.price) / product.compareAt) * 100);

  return (
    <>
      <div id="preloader" />
      <LegacyScripts />
      <Header />

      <main className={styles.page}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span>{product.collection}</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{product.title}</span>
          </nav>

          <ProductSelectionProvider
            colors={product.colors}
            colorImages={product.colorImages}
            fallbackImages={product.images}
          >
            <div className={styles.layout}>
              <div className={styles.galleryCol}>
                <ProductGallery images={product.images} alt={product.title} badge={product.badge} />
              </div>

              <div className={styles.info}>
                <p className={styles.eyebrow}>{product.collection}</p>
                <h1 className={styles.title}>{product.title}</h1>
                <p className={styles.subtitle}>{product.subtitle}</p>

                <Rating rating={product.rating} reviews={product.reviews} />

                <div className={styles.priceRow}>
                  <span className={styles.price}>{formatPrice(product.price)}</span>
                  <span className={styles.compare}>{formatPrice(product.compareAt)}</span>
                  <span className={styles.discount}>Save {discount}%</span>
                </div>

                <p className={styles.description}>{product.description}</p>

                <ul className={styles.featureList}>
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <Suspense fallback={<ProductPurchasePanel product={product} />}>
                  <ProductBundleSection product={product} slug={product.slug} />
                </Suspense>

                <div className={styles.trustRow}>
                  <span>
                    <i className="fa fa-truck" aria-hidden="true" /> Free delivery
                  </span>
                  <span>
                    <i className="fa fa-refresh" aria-hidden="true" /> 7-day returns
                  </span>
                  <span>
                    <i className="fa fa-money" aria-hidden="true" /> Cash on delivery
                  </span>
                </div>

                <div className={styles.details}>
                  <details className={styles.detail} open>
                    <summary>Product details</summary>
                    <div className={styles.detailBody}>
                      <ul>
                        <li>SKU: {product.sku}</li>
                        <li>Category: {product.collection}</li>
                        <li>Available sizes: {product.sizes.join(', ')}</li>
                        <li>Colours: {product.colors.map((color) => color.name).join(', ')}</li>
                      </ul>
                    </div>
                  </details>

                  <details className={styles.detail}>
                    <summary>Care instructions</summary>
                    <div className={styles.detailBody}>
                      <p>{product.care}</p>
                    </div>
                  </details>

                  <details className={styles.detail}>
                    <summary>Shipping &amp; returns</summary>
                    <div className={styles.detailBody}>
                      <p>{product.shipping}</p>
                    </div>
                  </details>
                </div>

                <div className={styles.delivery}>
                  <span className={styles.deliveryIcon} aria-hidden="true">
                    <i className="fa fa-map-marker" />
                  </span>
                  <div>
                    <h2 className={styles.deliveryTitle}>Quick delivery nationwide</h2>
                    <p>
                      Fast shipping to Lahore, Karachi, Islamabad, Rawalpindi and all major
                      cities in Pakistan. Receive your order in 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ProductSelectionProvider>

          {related.length ? (
            <section className={styles.related} aria-labelledby="related-heading">
              <div className={styles.relatedHead}>
                <div>
                  <p className={styles.eyebrow}>Keep exploring</p>
                  <h2 id="related-heading" className={styles.relatedTitle}>
                    You may also like
                  </h2>
                </div>
                <a href="/" className={styles.viewAll}>
                  Back to shop <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div>

              <div className={styles.relatedGrid}>
                {related.map((item) => (
                  <a
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedMedia}>
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className={styles.relatedBody}>
                      <span className={styles.relatedCat}>{item.collection}</span>
                      <h3 className={styles.relatedName}>{item.title}</h3>
                      <span className={styles.relatedPrice}>{formatPrice(item.price)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}
