'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWishlist } from '@/lib/wishlist';
import { useCartStore } from '@/lib/cart';
import { getProductBySlug, formatPrice } from '@/lib/products';

export default function FavouritePage() {
  const { items, toggleWishlist, clear } = useWishlist();
  const addItem = useCartStore((state) => state.addItem);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  const favouriteProducts = items
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const handleAddToCart = (product: NonNullable<ReturnType<typeof getProductBySlug>>) => {
    addItem({
      slug: product.slug,
      title: product.title,
      price: product.price,
      compareAt: product.compareAt,
      image: product.image,
      color: product.colors?.[0]?.name || 'Standard',
      size: product.sizes?.[2] || product.sizes?.[0] || 'M',
      quantity: 1,
    });

    setAddedSlug(product.slug);
    setTimeout(() => {
      setAddedSlug(null);
    }, 2000);
  };

  return (
    <>
      <Header />

      {/* Breadcrumb Header */}
      <div style={{ background: '#f5f6fa', padding: '36px 0', borderBottom: '1px solid #e4e7ef' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Medixa Wardrobe
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#131b2e', margin: '4px 0 0' }}>
                My Favourites ({favouriteProducts.length})
              </h1>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
                Saved scrub suits, lab coats, and clinical uniform essentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      <main style={{ minHeight: '55vh', padding: '48px 0', background: '#ffffff' }}>
        <div className="container">
          {favouriteProducts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#f8fafc',
                borderRadius: 16,
                border: '1px dashed #cce3f0',
                maxWidth: 600,
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#e9edf5',
                  color: '#052263',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  margin: '0 auto 18px',
                }}
              >
                ❤️
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#131b2e', margin: '0 0 8px' }}>
                Your Favourites List is Empty
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.6 }}>
                You haven&apos;t added any scrubs to your favourites yet. Tap the heart icon on any scrub suit across our catalog to save it here.
              </p>
              <Link
                href="/shop"
                style={{
                  display: 'inline-block',
                  background: '#052263',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(5, 34, 99,0.25)',
                }}
              >
                Explore Medixa Scrub Suits →
              </Link>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottom: '1px solid #eef1f4',
                }}
              >
                <span style={{ fontSize: 13, color: '#64748b' }}>
                  Showing {favouriteProducts.length} saved {favouriteProducts.length === 1 ? 'item' : 'items'}
                </span>
                <button
                  onClick={() => clear()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: 12,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Clear All Favourites
                </button>
              </div>

              <div className="row">
                {favouriteProducts.map((product) => {
                  const isAdded = addedSlug === product.slug;

                  return (
                    <div key={product.slug} className="col-md-3 col-sm-6 col-xs-12" style={{ marginBottom: 30 }}>
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e4e7ef',
                          borderRadius: 12,
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        }}
                      >
                        {/* Image Container */}
                        <div style={{ position: 'relative', background: '#f8fafc', height: 260, overflow: 'hidden' }}>
                          <Link href={`/products/${product.slug}`} style={{ display: 'block', height: '100%' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                              }}
                            />
                          </Link>

                          {/* Remove from favourites button */}
                          <button
                            onClick={() => toggleWishlist(product.slug)}
                            title="Remove from Favourites"
                            aria-label="Remove from Favourites"
                            style={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: '#ffffff',
                              border: '1px solid #fee2e2',
                              color: '#e11d48',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                            }}
                          >
                            <i className="fa fa-heart"></i>
                          </button>

                          {product.badge && (
                            <span
                              style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                background: '#052263',
                                color: '#ffffff',
                                padding: '3px 8px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            >
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {product.collection}
                          </span>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#131b2e', margin: '4px 0 8px' }}>
                            <Link href={`/products/${product.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {product.title}
                            </Link>
                          </h3>

                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#131b2e' }}>
                              {formatPrice(product.price)}
                            </span>
                            {product.compareAt > product.price && (
                              <span style={{ fontSize: 13, textDecoration: 'line-through', color: '#94a3b8' }}>
                                {formatPrice(product.compareAt)}
                              </span>
                            )}
                          </div>

                          <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                            In Stock • Ready to dispatch nationwide
                          </div>

                          {/* Actions */}
                          <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleAddToCart(product)}
                              style={{
                                flex: 1,
                                background: isAdded ? '#15803d' : '#052263',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '10px 14px',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                              }}
                            >
                              {isAdded ? 'Added! ✓' : 'Add to Bag'}
                            </button>
                            <Link
                              href={`/products/${product.slug}`}
                              style={{
                                background: '#f8fafc',
                                color: '#131b2e',
                                border: '1px solid #dceed6',
                                borderRadius: 6,
                                padding: '10px 12px',
                                fontSize: 12,
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

