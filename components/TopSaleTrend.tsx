/* eslint-disable @next/next/no-img-element */
import { formatPrice, getProductBySlug } from '@/lib/products';
import ProductCardActions from '@/components/ProductCardActions';

interface TrendItem {
  slug: string;
  customImage?: string;
  customTitle?: string;
}

const topRated: TrendItem[] = [
  {
    slug: 'regal-round-neck-male-medical-scrubs-pakistan',
    customImage: '/img/real-product-images/regal/regal-thumbnail.webp',
  },
  {
    slug: 'muse-v-neck-female-medical-scrubs-pakistan',
    customImage: '/img/real-product-images/muse/muse-thumbnail.webp',
  },
];

const onSale: TrendItem[] = [
  {
    slug: 'forte-v-neck-male-medical-scrubs-pakistan',
    customImage: '/img/real-product-images/Forte/Forte-thumbnail.webp',
  },
  {
    slug: 'rebel-collar-neck-female-medical-scrubs-pakistan',
    customImage: '/img/real-product-images/rebel/Rebel-thumbnail.webp',
  },
];

const trending: TrendItem[] = [
  {
    slug: 'forte-v-neck-male-medical-scrubs-pakistan',
    customImage: '/img/real-product-images/Forte/Forte-Naval-1.webp',
    customTitle: 'Forte Scrub Suits (Naval)',
  },
  {
    slug: 'muse-v-neck-female-medical-scrubs-pakistan',
    customImage: '/img/real-product-images/muse/muse-Maroon-1.webp',
    customTitle: 'Muse Scrub Suits (Maroon)',
  },
];

function TrendCard({ item, showOldPrice = false }: { item: TrendItem; showOldPrice?: boolean }) {
  const product = getProductBySlug(item.slug);
  const title = item.customTitle || product?.title || 'Medixa Scrub Suits';
  const image = item.customImage || product?.image || '/img/real-product-images/regal/regal-thumbnail.webp';
  const price = product?.price ? formatPrice(product.price) : 'Rs 5,391';
  const compareAt = product?.compareAt ? formatPrice(product.compareAt) : null;

  return (
    <div className="single-tst">
      <div className="clearfix">
        <div
          className="single-tst-img"
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            background: '#f8faf9',
            border: '1px solid #edf2ef',
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
  return (
    <div className="top-sale-trend-area">
      <div className="container">
        <div className="row">
          {/* Top Rated Column */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="top-sale-trend top-rated">
              <h4 className="tst-title">top rated</h4>
              {topRated.map((item, idx) => (
                <TrendCard key={`${item.slug}-${idx}`} item={item} showOldPrice />
              ))}
            </div>
          </div>
          {' '}
          {/* On Sale Column */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="top-sale-trend on-sale">
              <h4 className="tst-title">on sale</h4>
              {onSale.map((item, idx) => (
                <TrendCard key={`${item.slug}-${idx}`} item={item} showOldPrice />
              ))}
            </div>
          </div>
          {' '}
          {/* Trending Column */}
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="top-sale-trend trending">
              <h4 className="tst-title">trending</h4>
              {trending.map((item, idx) => (
                <TrendCard key={`${item.slug}-${idx}`} item={item} showOldPrice />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
