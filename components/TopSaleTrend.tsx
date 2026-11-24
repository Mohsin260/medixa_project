'use client';

/* eslint-disable @next/next/no-img-element */
import { formatPrice, type Product } from '@/lib/products';
import ProductCardActions from '@/components/ProductCardActions';
import { useProducts } from '@/lib/hooks/use-products';

interface TrendItem {
  slug: string;
  color?: string;
}

const topRated: TrendItem[] = [
  { slug: 'regal-round-neck-male-medical-scrubs-pakistan' },
  { slug: 'muse-v-neck-female-medical-scrubs-pakistan' },
];

const onSale: TrendItem[] = [
  { slug: 'forte-v-neck-male-medical-scrubs-pakistan' },
  { slug: 'rebel-collar-neck-female-medical-scrubs-pakistan' },
];

const trending: TrendItem[] = [
  { slug: 'forte-v-neck-male-medical-scrubs-pakistan', color: 'Naval Light' },
  { slug: 'muse-v-neck-female-medical-scrubs-pakistan', color: 'Maroon' },
];

function TrendCard({
  item,
  showOldPrice = false,
  liveProduct,
}: {
  item: TrendItem;
  showOldPrice?: boolean;
  liveProduct?: Product;
}) {
  const product = liveProduct;
  const title = item.color
    ? `${product?.title || 'Medixa Scrub Suits'} (${item.color})`
    : product?.title || 'Medixa Scrub Suits';
  const image =
    (item.color ? product?.colorImages?.[item.color]?.[0] : undefined) ||
    product?.image ||
    product?.images[0];
  if (!product || !image) return null;

  const price = formatPrice(product.price);
  const compareAt = product?.compareAt ? formatPrice(product.compareAt) : null;

  return (
    <div className="single-tst">
      <div className="clearfix">
        <div
          className="single-tst-img"
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            background: '#f8fafc',
            border: '1px solid #edf1f5',
          }}
        >
          <a href={`/products/${item.slug}`}>
            <img
              src={image}
              alt={title}
              style={{
                width: '100%',
                height: 155,
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </a>
        </div>
        {' '}
        <div className="single-tst-content">
          <a className="tst-pro-name" href={`/products/${item.slug}`}>
            {title}
          </a>
          <div className="rating clearfix">
            <div className="star star-on"></div>
            {' '}
            <div className="star star-on"></div>
            {' '}
            <div className="star star-on"></div>
            {' '}
            <div className="star star-on"></div>
            {' '}
            <div className="star star-half"></div>
          </div>
          <span className="tst-price">
            {showOldPrice && compareAt && (
              <>
                <span className="tst-old-price">{compareAt}</span>
                {' '}
              </>
            )}
            {price}
          </span>
          <div className="tst-likeshopview">
            <ProductCardActions
              slug={item.slug}
              defaultTitle={title}
              defaultImage={image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopSaleTrend() {
  const { data: products = [] } = useProducts();
  const productMap = Object.fromEntries(products.map((product) => [product.slug, product]));

  return (
    <div className="top-sale-trend-area">
      <div className="container">
        <div className="row">
          {/* Top Rated Column */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="top-sale-trend top-rated">
              <h4 className="tst-title">top rated</h4>
              {topRated.map((item, idx) => (
                <TrendCard key={`${item.slug}-${idx}`} item={item} liveProduct={productMap[item.slug]} showOldPrice />
              ))}
            </div>
          </div>
          {' '}
          {/* On Sale Column */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="top-sale-trend on-sale">
              <h4 className="tst-title">on sale</h4>
              {onSale.map((item, idx) => (
                <TrendCard key={`${item.slug}-${idx}`} item={item} liveProduct={productMap[item.slug]} showOldPrice />
              ))}
            </div>
          </div>
          {' '}
          {/* Trending Column */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="top-sale-trend trending">
              <h4 className="tst-title">trending</h4>
              {trending.map((item, idx) => (
                <TrendCard key={`${item.slug}-${idx}`} item={item} liveProduct={productMap[item.slug]} showOldPrice />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
