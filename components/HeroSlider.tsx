/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '@/lib/hooks/use-products';

export default function HeroSlider() {
  const { data: products = [] } = useProducts();
  const slides = products.filter((product) => Boolean(product.image || product.images[0]));
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides.length ? slides[activeIndex % slides.length] : undefined;
  const activeImage = activeSlide?.image || activeSlide?.images[0];

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="home1-slider-container">
      {activeSlide && (
        <div className="hero-product-slide" key={activeSlide.slug}>
          <div className="container">
            <div className="row">
              <div className="col-md-7 col-md-offset-1 col-sm-7">
                <div className="slide1-text">
                  <div className="middle-text">
                    <div className="cap-dec animated bounceIn">
                      <h3>{activeSlide.collection || 'Medical Scrubs'}</h3>
                    </div>
                    <div className="cap-title animated zoomIn">
                      <h2>{activeSlide.title}</h2>
                    </div>
                    <div className="cap-details animated bounceInRight">
                      <p>{activeSlide.description}</p>
                    </div>
                    <div className="cap-readmore animated bounceInUp">
                      <a className="hvr-bs" href={`/products/${activeSlide.slug}`}>
                        View Collection
                      </a>
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
              <div className="col-md-4 col-sm-5 hero-product-image">
                {activeImage && <img src={activeImage} alt={activeSlide.title} />}
              </div>
            </div>
          </div>
          {slides.length > 1 && (
            <div className="hero-product-controls">
              <button
                type="button"
                aria-label="Previous product"
                onClick={() => setActiveIndex((index) => (index - 1 + slides.length) % slides.length)}
              >
                <i className="fa fa-chevron-left" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next product"
                onClick={() => setActiveIndex((index) => (index + 1) % slides.length)}
              >
                <i className="fa fa-chevron-right" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
