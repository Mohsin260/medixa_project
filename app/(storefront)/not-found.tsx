'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <>
      <Header />

      {/* Breadcrumb Area */}
      <div style={{ background: '#f5faf7', padding: '32px 0', borderBottom: '1px solid #e2ece7' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1f6b52', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Error 404
              </span>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: '#173c35', margin: '4px 0 0' }}>
                Page Not Found
              </h1>
              <div style={{ marginTop: 6, fontSize: 12, color: '#668076' }}>
                <Link href="/" style={{ color: '#1f6b52', textDecoration: 'none' }}>Home</Link>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>404 Not Found</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 404 Area */}
      <div className="error-area" style={{ padding: '60px 0 90px', background: '#fafcfb' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-md-offset-1 col-xs-12">
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5ede8',
                  borderRadius: 16,
                  padding: '50px 30px',
                  textAlign: 'center',
                  boxShadow: '0 8px 30px rgba(20,61,54,0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative Accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #1f6b52, #ff4c6b)',
                  }}
                />

                <span
                  style={{
                    display: 'inline-block',
                    background: '#e8f4ef',
                    color: '#1f6b52',
                    fontSize: 12,
                    fontWeight: 700,
                    padding: '6px 16px',
                    borderRadius: 20,
                    marginBottom: 16,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Clinical Wardrobe Status
                </span>

                <h2
                  style={{
                    fontSize: 'clamp(72px, 14vw, 140px)',
                    lineHeight: 1,
                    fontWeight: 900,
                    color: '#173c35',
                    margin: '0 0 16px',
                    fontFamily: 'Montserrat, sans-serif',
                    letterSpacing: '-0.03em',
                  }}
                >
                  4<span style={{ color: '#ff4c6b' }}>0</span>4
                </h2>

                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#173c35',
                    marginBottom: 12,
                  }}
                >
                  Off-Shift: This Page Could Not Be Found
                </h3>

                <p
                  style={{
                    fontSize: 14,
                    color: '#557067',
                    maxWidth: 520,
                    margin: '0 auto 28px',
                    lineHeight: 1.6,
                  }}
                >
                  The medical scrubs, size guide, or department page you are searching for has moved, been renamed, or is currently off clinical duty.
                </p>

                {/* Search Bar */}
                <form
                  onSubmit={handleSearch}
                  style={{
                    maxWidth: 480,
                    margin: '0 auto 36px',
                    display: 'flex',
                    border: '1.5px solid #d0ded6',
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search Regal, Muse, Forte, sizes or scrubs…"
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '12px 16px',
                      fontSize: 13,
                      outline: 'none',
                      color: '#173c35',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#1f6b52',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0 22px',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <i className="fa fa-search" style={{ marginRight: 6 }} /> Search
                  </button>
                </form>

                {/* Primary Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: 40,
                  }}
                >
                  <Link
                    href="/"
                    style={{
                      background: '#1f6b52',
                      color: '#ffffff',
                      padding: '12px 28px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: 'none',
                      boxShadow: '0 4px 14px rgba(31,107,82,0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <i className="fa fa-home" /> Back to Homepage
                  </Link>
                  <Link
                    href="/shop"
                    style={{
                      background: '#ffffff',
                      color: '#173c35',
                      border: '1.5px solid #c8d9d0',
                      padding: '12px 28px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <i className="fa fa-shopping-bag" /> Browse All Scrubs
                  </Link>
                  <Link
                    href="/track-order"
                    style={{
                      background: '#f1f6f3',
                      color: '#1f6b52',
                      padding: '12px 22px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <i className="fa fa-truck" /> Track Order
                  </Link>
                </div>

                {/* Quick Directory Cards */}
                <div
                  style={{
                    borderTop: '1px solid #edf3f0',
                    paddingTop: 30,
                    textAlign: 'left',
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#708a80',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 16,
                      textAlign: 'center',
                    }}
                  >
                    Popular Medixa Scrub Collections
                  </p>
                  <div className="row">
                    <div className="col-sm-3 col-xs-6" style={{ marginBottom: 12 }}>
                      <Link
                        href="/products/regal-round-neck-male-medical-scrubs-pakistan"
                        style={{
                          display: 'block',
                          padding: '14px',
                          background: '#f8faf9',
                          borderRadius: 10,
                          border: '1px solid #e5ede8',
                          textDecoration: 'none',
                          color: '#173c35',
                        }}
                      >
                        <span style={{ fontSize: 11, color: '#1f6b52', fontWeight: 700, display: 'block' }}>Men&apos;s</span>
                        <strong style={{ fontSize: 13, display: 'block', marginTop: 2 }}>Regal Scrub Suits</strong>
                        <span style={{ fontSize: 11, color: '#7a9187' }}>Round-neck Tailored</span>
                      </Link>
                    </div>

                    <div className="col-sm-3 col-xs-6" style={{ marginBottom: 12 }}>
                      <Link
                        href="/products/muse-v-neck-female-medical-scrubs-pakistan"
                        style={{
                          display: 'block',
                          padding: '14px',
                          background: '#f8faf9',
                          borderRadius: 10,
                          border: '1px solid #e5ede8',
                          textDecoration: 'none',
                          color: '#173c35',
                        }}
                      >
                        <span style={{ fontSize: 11, color: '#ff4c6b', fontWeight: 700, display: 'block' }}>Women&apos;s</span>
                        <strong style={{ fontSize: 13, display: 'block', marginTop: 2 }}>Muse Scrub Suits</strong>
                        <span style={{ fontSize: 11, color: '#7a9187' }}>Feminine V-Neck</span>
                      </Link>
                    </div>

                    <div className="col-sm-3 col-xs-6" style={{ marginBottom: 12 }}>
                      <Link
                        href="/products/forte-v-neck-male-medical-scrubs-pakistan"
                        style={{
                          display: 'block',
                          padding: '14px',
                          background: '#f8faf9',
                          borderRadius: 10,
                          border: '1px solid #e5ede8',
                          textDecoration: 'none',
                          color: '#173c35',
                        }}
                      >
                        <span style={{ fontSize: 11, color: '#1f6b52', fontWeight: 700, display: 'block' }}>Men&apos;s</span>
                        <strong style={{ fontSize: 13, display: 'block', marginTop: 2 }}>Forte Scrub Suits</strong>
                        <span style={{ fontSize: 11, color: '#7a9187' }}>V-Neck Performance</span>
                      </Link>
                    </div>

                    <div className="col-sm-3 col-xs-6" style={{ marginBottom: 12 }}>
                      <Link
                        href="/products/rebel-collar-neck-female-medical-scrubs-pakistan"
                        style={{
                          display: 'block',
                          padding: '14px',
                          background: '#f8faf9',
                          borderRadius: 10,
                          border: '1px solid #e5ede8',
                          textDecoration: 'none',
                          color: '#173c35',
                        }}
                      >
                        <span style={{ fontSize: 11, color: '#ff4c6b', fontWeight: 700, display: 'block' }}>Women&apos;s</span>
                        <strong style={{ fontSize: 13, display: 'block', marginTop: 2 }}>Rebel Scrub Suits</strong>
                        <span style={{ fontSize: 11, color: '#7a9187' }}>Collar Neck Modern</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

