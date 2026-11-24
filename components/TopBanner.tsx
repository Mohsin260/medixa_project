'use client';

import { useProducts } from '@/lib/hooks/use-products';

export default function TopBanner() {
  const { data: products = [] } = useProducts();

  return (
    <div className="top-banner-area">
      <div className="container">
        <div className="row">
          {products.slice(0, 4).map((product) => (
          <div key={product.slug} className="col-md-3 col-sm-6 col-xs-12">
            <div className="single-top-banner">
              <div className="stb-img">
                <a href={`/products/${product.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.title} />
                </a>
              </div>
              <div className="stb-content">
                <h4 className="stb-title2">{product.collection}</h4>
                <h2 className="stb-title">{product.title}</h2>
                <p className="stb-text">{product.subtitle}</p>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}
