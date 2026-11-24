'use client';

/* eslint-disable @next/next/no-img-element */
import { useMemo } from 'react';
import { formatPrice, getStandardColorHex, type Product } from '@/lib/products';
import ProductCardActions from '@/components/ProductCardActions';
import { useProducts } from '@/lib/hooks/use-products';

const CANONICAL_SLUGS = [
  'regal-round-neck-male-medical-scrubs-pakistan',
  'muse-v-neck-female-medical-scrubs-pakistan',
  'forte-v-neck-male-medical-scrubs-pakistan',
  'rebel-collar-neck-female-medical-scrubs-pakistan',
];

export default function FeaturedItems() {
  const { data: allProducts = [] } = useProducts();
  const products = CANONICAL_SLUGS
    .map((slug) => allProducts.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));

  const women = useMemo(
    () => products.filter((product) => product.category === 'Women'),
    [products],
  );
  const men = useMemo(
    () => products.filter((product) => product.category === 'Men'),
    [products],
  );

  const productCard = (product: Product, colorName?: string) => {
    const colorImage = colorName ? product.colorImages?.[colorName]?.[0] : undefined;
    const image = colorImage || product.image || product.images[0];
    if (!image) return null;
    const title = colorName ? `${product.title} (${colorName})` : product.title;

    return (
      <div className="col-md-4 col-sm-6 col-xs-12" key={`${product.slug}-${colorName || 'default'}`}>
        <div className="single-featured-item">
          <div className="sfi-img">
            <a href={`/products/${product.slug}`}>
              <img src={image} alt={title} />
            </a>
            <div className="sfi-img-content">
              <ProductCardActions
                slug={product.slug}
                defaultTitle={title}
                defaultPrice={product.price}
                defaultImage={image}
              />
            </div>
          </div>
          <div className="sfi-content">
            <div className="sfi-name-cat">
              <a className="sfi-name" href={`/products/${product.slug}`}>{title}</a>
              <span className="sfi-cat">
                {colorName ? (
                  <>
                    <span
                      className="mr-1 inline-block size-2.5 rounded-full border border-black/20 align-middle"
                      style={{ backgroundColor: getStandardColorHex(colorName) }}
                    />
                    {colorName}
                  </>
                ) : (
                  product.collection
                )}
              </span>
            </div>
            <div className="sfi-price-rating">
              <p className="sfi-price">
                Price: <span>{formatPrice(product.price)}</span>
              </p>
              <div className="rating">
                <div className="star star-on" />
                <div className="star star-on" />
                <div className="star star-on" />
                <div className="star star-on" />
                <div className="star star-half" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const maroonRegal = men.find((product) => product.slug === CANONICAL_SLUGS[0]);
  const navalMuse = women.find((product) => product.slug === CANONICAL_SLUGS[1]);

  return (
    <div className="featured-item-area">
      <div className="container">
        <div className="featured-item-head">
          <div className="row">
            <div className="col-md-5 col-sm-6 col-xs-12">
              <div className="featured-item-left">
                <div className="section-title">
                  <span>Medixa Apparel</span>
                  <h2>Featured Scrubs &amp; Uniforms</h2>
                </div>
              </div>
            </div>
            <div className="col-md-7 col-sm-6 col-xs-12">
              <div className="feature-item-tab-control">
                <ul className="fi-tab">
                  <li className="active"><a data-toggle="tab" href="#all">ALL</a></li>
                  <li><a data-toggle="tab" href="#women">WOMEN&apos;S</a></li>
                  <li><a data-toggle="tab" href="#men">MEN&apos;S</a></li>
                  <li><a data-toggle="tab" href="#shoes">LAB COATS</a></li>
                  <li><a data-toggle="tab" href="#accessories">COLLECTIONS</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="featured-items tab-content">
          <div id="all" className="tab-pane fade in active">
            <div className="featured-all">
              <div className="fi-row"><div className="row">
                {products.slice(0, 3).map((product) => productCard(product))}
              </div></div>
              <div className="fi-row"><div className="row">
                {maroonRegal ? productCard(maroonRegal, 'Maroon') : null}
                {navalMuse ? productCard(navalMuse, 'Naval Light') : null}
                {products[3] ? productCard(products[3]) : null}
              </div></div>
            </div>
          </div>

          <div id="women" className="tab-pane fade">
            <div className="featured-all"><div className="fi-row"><div className="row">
              {women.map((product) => productCard(product))}
            </div></div></div>
          </div>

          <div id="men" className="tab-pane fade">
            <div className="featured-all"><div className="fi-row"><div className="row">
              {men.map((product) => productCard(product))}
            </div></div></div>
          </div>

          <div id="shoes" className="tab-pane fade">
            <div className="featured-all"><div className="fi-row"><div className="row">
              {products.map((product) => productCard(product))}
            </div></div></div>
          </div>

          <div id="accessories" className="tab-pane fade">
            <div className="featured-all"><div className="fi-row"><div className="row">
              {products.map((product) => productCard(product))}
            </div></div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
