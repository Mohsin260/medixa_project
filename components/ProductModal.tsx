'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useUiStore } from '@/lib/store/ui';
import { useCartStore } from '@/lib/cart';
import { getProductBySlug, formatPrice, products, type Product } from '@/lib/products';

interface ProductModalContentProps {
  product: Product;
  onClose: () => void;
}

function ProductModalContent({ product, onClose }: ProductModalContentProps) {
  const addItem = useCartStore((state) => state.addItem);

  const defaultCol = product.colors?.[0]?.name || 'Standard';
  const [selectedColor, setSelectedColor] = useState<string>(defaultCol);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[2] || product.sizes?.[0] || 'M'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  const initialImg =
    product.colorImages?.[defaultCol]?.[0] || product.image || product.images?.[0] || '';
  const [activeImage, setActiveImage] = useState<string>(initialImg);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    if (product.colorImages?.[colorName]?.length) {
      setActiveImage(product.colorImages[colorName][0]);
    }
  };

  const handleAddToCart = () => {
    addItem({
      slug: product.slug,
      title: product.title,
      price: product.price,
      compareAt: product.compareAt,
      image: activeImage || product.image,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  const currentGallery =
    (product.colorImages && product.colorImages[selectedColor]) ||
    product.images ||
    [product.image];

  return (
    <>
      <button
        type="button"
        className="close"
        data-dismiss="modal"
        onClick={onClose}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          background: '#131b2e',
          color: '#ffffff',
          border: 'none',
          width: 38,
          height: 38,
          borderRadius: '50%',
          fontSize: 20,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        ×
      </button>

      <div className="row">
        {/* Product Gallery Column */}
        <div className="col-md-6 col-sm-12 col-xs-12">
          <div className="product-tab-area">
            <div className="clearfix">
              {/* Main Image Display */}
              <div
                className="product-tab-content"
                style={{
                  background: '#f8fafc',
                  borderRadius: 10,
                  overflow: 'hidden',
                  textAlign: 'center',
                  marginBottom: 16,
                }}
              >
                <div className="tab-pane fade in active" style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeImage || product.image}
                    alt={product.title}
                    style={{
                      maxHeight: 'min(50vh, 380px)',
                      width: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                  {product.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: '#052263',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {currentGallery.length > 1 && (
                <div className="product-tab-menu">
                  <ul
                    className="product-tab"
                    style={{
                      display: 'flex',
                      gap: 10,
                      padding: 0,
                      margin: 0,
                      listStyle: 'none',
                      flexWrap: 'wrap',
                    }}
                  >
                    {currentGallery.map((imgSrc, idx) => (
                      <li
                        key={idx}
                        className={activeImage === imgSrc ? 'active' : ''}
                        style={{
                          border:
                            activeImage === imgSrc
                              ? '2px solid #052263'
                              : '1px solid #dceed6',
                          borderRadius: 8,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          width: 68,
                          height: 68,
                        }}
                        onClick={() => setActiveImage(imgSrc)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgSrc}
                          alt={`${product.title} thumbnail ${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info & Actions Column */}
        <div className="col-md-6 col-sm-12 col-xs-12">
          <div className="single-product-description-area" style={{ paddingLeft: 10 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#052263',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {product.collection} • {product.category}
            </span>

            <h2 className="spd-title" style={{ fontSize: 24, fontWeight: 700, color: '#131b2e', marginTop: 4, marginBottom: 8 }}>
              {product.title}
            </h2>

            {/* Rating Stars */}
            <div className="rating clearfix" style={{ marginBottom: 12 }}>
              <div className="star star-on"></div>
              {' '}
              <div className="star star-on"></div>
              {' '}
              <div className="star star-on"></div>
              {' '}
              <div className="star star-on"></div>
              {' '}
              <div className="star star-half"></div>
              {' '}
              <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>
                {product.rating} ({product.reviews} clinical reviews)
              </span>
            </div>

            {/* Pricing */}
            <p className="spd-price" style={{ fontSize: 22, fontWeight: 700, color: '#131b2e', marginBottom: 14 }}>
              {formatPrice(product.price)}
              {' '}
              {product.compareAt > product.price && (
                <span className="spd-old-price" style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: 16, marginLeft: 8 }}>
                  {formatPrice(product.compareAt)}
                </span>
              )}
              {product.compareAt > product.price && (
                <span
                  style={{
                    background: '#e9edf5',
                    color: '#052263',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    marginLeft: 10,
                  }}
                >
                  SAVE {Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                </span>
              )}
            </p>

            <p className="spd-text" style={{ fontSize: 13, lineHeight: 1.6, color: '#475569', marginBottom: 16 }}>
              {product.description}
            </p>

            <ul className="spd-list" style={{ marginBottom: 18 }}>
              {product.features?.slice(0, 3).map((feat, i) => (
                <li key={i} style={{ fontSize: 12, color: '#334155' }}>
                  {feat}
                </li>
              ))}
              <li style={{ fontSize: 12, color: '#334155' }}>7-day hassle-free exchange &amp; cash on delivery</li>
            </ul>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="spd-select-color" style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', display: 'block', marginBottom: 6 }}>
                  Select Color: <strong style={{ color: '#052263' }}>{selectedColor}</strong>
                </span>
                <ul style={{ display: 'flex', gap: 8, padding: 0, margin: 0, listStyle: 'none' }}>
                  {product.colors.map((c) => (
                    <li key={c.name}>
                      <button
                        type="button"
                        onClick={() => handleColorChange(c.name)}
                        title={c.name}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: c.value,
                          border:
                            selectedColor === c.name
                              ? '3px solid #052263'
                              : '1.5px solid #cbd5e1',
                          outline: selectedColor === c.name ? '2px solid #a7f3d0' : 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'block',
                          transition: 'all 0.15s ease',
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="spd-select-size" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                    Select Size: <strong style={{ color: '#052263' }}>{selectedSize}</strong>
                  </span>
                  <Link href="/size-guide" onClick={onClose} style={{ fontSize: 11, color: '#052263', fontWeight: 600 }}>
                    📏 Size Guide
                  </Link>
                </div>
                <ul style={{ display: 'flex', gap: 6, padding: 0, margin: 0, listStyle: 'none' }}>
                  {product.sizes.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 6,
                          border:
                            selectedSize === s
                              ? '1.5px solid #052263'
                              : '1px solid #d1d5db',
                          background: selectedSize === s ? '#052263' : '#ffffff',
                          color: selectedSize === s ? '#ffffff' : '#1f2937',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="spd-add-cart" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  overflow: 'hidden',
                  height: 42,
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: 36,
                    height: '100%',
                    background: '#f8fafc',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#131b2e',
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: 44,
                    height: '100%',
                    border: 'none',
                    textAlign: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  style={{
                    width: 36,
                    height: '100%',
                    background: '#f8fafc',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#131b2e',
                  }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="spd-add-to hvr-bs"
                style={{
                  background: added ? '#15803d' : '#052263',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 28px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
              </button>
            </div>

            {/* SKU & Category Meta */}
            <div className="spd-meta" style={{ borderTop: '1px solid #eef1f4', paddingTop: 14 }}>
              <p style={{ margin: '4px 0', fontSize: 12, color: '#64748b' }}>
                SKU: <span style={{ fontWeight: 600, color: '#131b2e' }}>{product.sku}</span>
              </p>
              <p style={{ margin: '4px 0', fontSize: 12, color: '#64748b' }}>
                Category: <span style={{ fontWeight: 600, color: '#131b2e' }}>{product.collection} ({product.category})</span>
              </p>
            </div>

            {/* View Full Product Page link */}
            <div style={{ marginTop: 16 }}>
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#052263',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                View Complete Product Details &amp; Clinical Reviews →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProductModal() {
  const quickViewSlug = useUiStore((state) => state.quickViewSlug);
  const closeQuickView = useUiStore((state) => state.closeQuickView);

  const product = quickViewSlug
    ? getProductBySlug(quickViewSlug) || products[0]
    : products[0];

  const handleClose = useCallback(() => {
    closeQuickView();
    if (typeof window !== 'undefined' && (window as unknown as { $: (sel: string) => { modal: (action: string) => void } }).$) {
      try {
        (window as unknown as { $: (sel: string) => { modal: (action: string) => void } }).$('#myModal').modal('hide');
      } catch {
        // Safe ignore
      }
    }
  }, [closeQuickView]);

  const isOpen = Boolean(quickViewSlug);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, handleClose]);

  return (
    <>
      <div
        className={`modal fade ${isOpen ? 'in' : ''}`}
        id="myModal"
        role="dialog"
        aria-modal={isOpen ? 'true' : undefined}
        style={{
          display: isOpen ? 'block' : 'none',
          zIndex: 1050,
          overflowY: 'auto',
          padding: '12px 6px',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          className="modal-dialog product-modal"
          style={{
            maxWidth: 1040,
            width: '95%',
            margin: '20px auto',
            display: 'block',
          }}
        >
          <div
            className="modal-content"
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              padding: '24px 16px',
              position: 'relative',
              backgroundColor: '#ffffff',
            }}
          >
            <ProductModalContent key={product.slug} product={product} onClose={handleClose} />
          </div>
        </div>
      </div>

      {/* Backdrop for click-outside closing */}
      {isOpen && (
        <div
          className="modal-backdrop fade in"
          onClick={handleClose}
          style={{ zIndex: 1040 }}
        />
      )}
    </>
  );
}
