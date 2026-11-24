/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/products';

export default function HeroSlider() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let ignore = false;
    fetch('/api/products')
      .then((res) => res.ok ? res.json() : [])
      .then((data: Product[]) => {
        if (!ignore && Array.isArray(data)) setProducts(data.slice(0, 2));
      })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

  const first = products[0];
  const second = products[1] || products[0];
  const firstImage = first?.image;
  const secondImage = second?.image;

  return (
    <div className="home1-slider-container">
      <div id="home1_slider" className="nivoSlider slider-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {firstImage ? <img src={firstImage} alt={first?.title || 'Medical Scrubs'} title="#htmlcaption1" /> : null}
        {' '}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {secondImage ? <img src={secondImage} alt={second?.title || 'Premium Medical Apparel'} title="#htmlcaption2" /> : null}
      </div>
      {' '}
      <div id="htmlcaption1" className="nivo-html-caption slider-caption-1">
        <div className="slider-progress"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-md-offset-1 col-sm-10 col-sm-offset-1">
              <div className="slide1-text">
                <div className="middle-text">
                  <div className="cap-dec animated bounceIn">
                    <h3>{first?.collection || 'Medical Scrubs'}</h3>
                  </div>
                  <div className="cap-title animated zoomIn">
                    <h2>
                      {first?.title || 'Medical Scrubs'}
                    </h2>
                  </div>
                  <div className="cap-details animated bounceInRight">
                    <p>{first?.description || ''}</p>
                  </div>
                  <div className="cap-readmore animated bounceInUp">
                    <a className="hvr-bs" href="/shop">View Collection</a>
                  </div>
                  <div className="cap-outer-text">
                    <p>
                      Medixa Medical
                      {' '}
                      <span>2026</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {' '}
      <div id="htmlcaption2" className="nivo-html-caption slider-caption-2">
        <div className="slider-progress"></div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 col-md-offset-1 col-sm-10 col-sm-offset-1">
              <div className="slide1-text">
                <div className="middle-text">
                  <div className="cap-dec animated bounceIn">
                    <h3>{second?.collection || 'Premium Medical Apparel'}</h3>
                  </div>
                  <div className="cap-title animated zoomIn">
                    <h2>
                      {second?.title || 'Premium Medical Apparel'}
                    </h2>
                  </div>
                  <div className="cap-details animated bounceInRight">
                    <p>{second?.description || ''}</p>
                  </div>
                  <div className="cap-readmore animated bounceInUp">
                    <a className="hvr-bs" href="/shop?category=Women">Shop Women&apos;s Scrubs</a>
                  </div>
                  <div className="cap-outer-text">
                    <p>
                      Pakistan Apparel
                      {' '}
                      <span>2026</span>
                    </p>
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
