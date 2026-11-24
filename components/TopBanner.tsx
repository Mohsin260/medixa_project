/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/products';

export default function TopBanner() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    let ignore = false;
    fetch('/api/products')
      .then((res) => res.ok ? res.json() : [])
      .then((data: Product[]) => {
        if (!ignore && Array.isArray(data)) setProducts(data.slice(0, 4));
      })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

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
