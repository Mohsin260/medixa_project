'use client';

/* eslint-disable @next/next/no-img-element */
import { useProducts } from '@/lib/hooks/use-products';

export default function Banner2() {
  const { data: products = [] } = useProducts();
  const bannerProducts = products.slice(0, 4);
  const primaryProduct = bannerProducts[0];
  const productImage = (index: number) => {
    const product = bannerProducts[index];
    return product ? product.image || product.images[0] : undefined;
  };
  const extraImage = primaryProduct?.images[1] || productImage(0);

  return (
    <div className="banner2-area">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 col-sm-6 col-xs-12">
            <div className="banner2-left">
              <div className="single-b2-item b2l-item1" style={{ position: 'relative', overflow: 'hidden' }}>
                {primaryProduct && productImage(0) && (
                  <img
                    src={productImage(0)}
                    alt={primaryProduct.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
                {' '}
                <span className="b2-item-discount">EXPORT QUALITY</span>
                {' '}
                <div className="b2-item-content2 text-white">
                  <h2 style={{ color: '#ffffff' }}>{primaryProduct?.title || 'Medixa Scrub Suits'}</h2>
                  <p style={{ color: '#ffffff' }}>{primaryProduct?.subtitle || 'Engineered for 24-Hour Hospital Shifts'}</p>
                  <a href={primaryProduct ? `/products/${primaryProduct.slug}` : '/shop'} style={{ color: '#ffffff' }}>SHOP NOW</a>
                </div>
              </div>
            </div>
          </div>
          {' '}
          <div className="col-md-6 col-sm-6 col-xs-12">
            <div className="banner2-right">
              <div className="row">
                <div className="col-md-6 col-xs-12">
                  <div className="single-b2-item b2r-item1" style={{ position: 'relative', overflow: 'hidden' }}>
                    {bannerProducts[1] && productImage(1) && (
                      <img
                        src={productImage(1)}
                        alt={bannerProducts[1].title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                    {' '}
                    <div className="single-b2-item-content">
                      <span className="sb2ic-icon">
                        <i className="fa fa-instagram"></i>
                      </span>
                      <p>FOLLOW US ON INSTAGRAM</p>
                      <a className="hvr-bs" href="https://instagram.com/medixa.pk" target="_blank" rel="noopener noreferrer">@medixa.pk</a>
                    </div>
                  </div>
                </div>
                {' '}
                <div className="col-md-6 hidden-sm col-xs-12">
                  <div className="single-b2-item b2r-item2" style={{ position: 'relative', overflow: 'hidden' }}>
                    {bannerProducts[2] && productImage(2) && (
                      <img
                        src={productImage(2)}
                        alt={bannerProducts[2].title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                    {' '}
                    <div className="single-b2-item-content">
                      <span className="sb2ic-icon">
                        <i className="fa fa-instagram"></i>
                      </span>
                      <p>PAKISTAN HEALTHCARE HEROES</p>
                      <a className="hvr-bs" href="/shop">#medixascrubs</a>
                    </div>
                  </div>
                </div>
                {' '}
                <div className="col-md-6 hidden-sm col-xs-12">
                  <div className="single-b2-item b2r-item3" style={{ position: 'relative', overflow: 'hidden' }}>
                    {bannerProducts[3] && productImage(3) && (
                      <img
                        src={productImage(3)}
                        alt={bannerProducts[3].title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                  </div>
                </div>
                {' '}
                <div className="col-md-6 hidden-sm col-xs-12">
                  <div className="single-b2-item b2r-item4" style={{ position: 'relative', overflow: 'hidden' }}>
                    {primaryProduct && extraImage && (
                      <img
                        src={extraImage}
                        alt={`${primaryProduct.title} product image`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
