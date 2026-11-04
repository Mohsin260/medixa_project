'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MENS_SIZE_CHART = [
  { size: 'XS', chest: '36 - 38', topLength: '27.5', waist: '28 - 30', trouserLength: '39.5', hip: '38' },
  { size: 'S', chest: '38 - 40', topLength: '28.5', waist: '30 - 32', trouserLength: '40.5', hip: '40' },
  { size: 'M', chest: '40 - 42', topLength: '29.5', waist: '32 - 34', trouserLength: '41.5', hip: '42' },
  { size: 'L', chest: '42 - 44', topLength: '30.5', waist: '34 - 36', trouserLength: '42.5', hip: '44' },
  { size: 'XL', chest: '44 - 46', topLength: '31.5', waist: '36 - 38', trouserLength: '43.0', hip: '46' },
  { size: 'XXL', chest: '46 - 48', topLength: '32.0', waist: '38 - 40', trouserLength: '43.5', hip: '48' },
];

const WOMENS_SIZE_CHART = [
  { size: 'XS', chest: '34 - 36', topLength: '26.0', waist: '26 - 28', trouserLength: '38.5', hip: '37' },
  { size: 'S', chest: '36 - 38', topLength: '27.0', waist: '28 - 30', trouserLength: '39.5', hip: '39' },
  { size: 'M', chest: '38 - 40', topLength: '28.0', waist: '30 - 32', trouserLength: '40.5', hip: '41' },
  { size: 'L', chest: '40 - 42', topLength: '29.0', waist: '32 - 34', trouserLength: '41.5', hip: '43' },
  { size: 'XL', chest: '42 - 44', topLength: '30.0', waist: '34 - 36', trouserLength: '42.0', hip: '45' },
  { size: 'XXL', chest: '44 - 46', topLength: '30.5', waist: '36 - 38', trouserLength: '42.5', hip: '47' },
];

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');

  return (
    <>
      <Header />

      {/* Breadcrumb Header */}
      <div style={{ background: '#f5f6fa', padding: '36px 0', borderBottom: '1px solid #e5ebf1' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Fit & Dimensions
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#131b2e', margin: '6px 0 0' }}>
                Medixa Scrubs Size Chart
              </h1>
              <p style={{ fontSize: 13, color: '#738290', margin: '8px auto 0', maxWidth: 520 }}>
                All measurements are in inches. Our 4-way stretch fabric provides a relaxed, flexible drape for long hospital shifts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '60px 0 90px', background: '#fafcfd' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-md-offset-1 col-xs-12">
              {/* Tab Selector */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 30 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('men')}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 30,
                    fontSize: 14,
                    fontWeight: 700,
                    border: 'none',
                    background: activeTab === 'men' ? '#052263' : '#ffffff',
                    color: activeTab === 'men' ? '#ffffff' : '#4f6472',
                    boxShadow: activeTab === 'men' ? '0 4px 14px rgba(5, 34, 99, 0.25)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Men&apos;s Scrubs (Regal & Forte)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('women')}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 30,
                    fontSize: 14,
                    fontWeight: 700,
                    border: 'none',
                    background: activeTab === 'women' ? '#052263' : '#ffffff',
                    color: activeTab === 'women' ? '#ffffff' : '#4f6472',
                    boxShadow: activeTab === 'women' ? '0 4px 14px rgba(5, 34, 99, 0.25)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Women&apos;s Scrubs (Muse & Rebel)
                </button>
              </div>

              {/* Table Card */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  border: '1px solid #e7ecf0',
                  padding: 30,
                  boxShadow: '0 8px 30px rgba(19,27,46, 0.05)',
                  marginBottom: 40,
                }}
              >
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
                    <thead>
                      <tr style={{ background: '#f5f6fa', borderBottom: '2px solid #e2e6ef' }}>
                        <th style={{ padding: '14px 16px', fontSize: 13, fontWeight: 800, color: '#131b2e' }}>Size</th>
                        <th style={{ padding: '14px 16px', fontSize: 13, fontWeight: 800, color: '#131b2e' }}>Chest (Inches)</th>
                        <th style={{ padding: '14px 16px', fontSize: 13, fontWeight: 800, color: '#131b2e' }}>Top Length</th>
                        <th style={{ padding: '14px 16px', fontSize: 13, fontWeight: 800, color: '#131b2e' }}>Waist (Elastic)</th>
                        <th style={{ padding: '14px 16px', fontSize: 13, fontWeight: 800, color: '#131b2e' }}>Hip</th>
                        <th style={{ padding: '14px 16px', fontSize: 13, fontWeight: 800, color: '#131b2e' }}>Trouser Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeTab === 'men' ? MENS_SIZE_CHART : WOMENS_SIZE_CHART).map((row, idx) => (
                        <tr
                          key={row.size}
                          style={{
                            borderBottom: '1px solid #edf1f5',
                            background: idx % 2 === 0 ? '#ffffff' : '#fafcfd',
                          }}
                        >
                          <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 800, color: '#052263' }}>
                            {row.size}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#33415a' }}>{row.chest}</td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#33415a' }}>{row.topLength}</td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#33415a' }}>{row.waist}</td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#33415a' }}>{row.hip}</td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: '#33415a' }}>{row.trouserLength}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Measuring Guidelines */}
              <div className="row">
                <div className="col-md-4 col-sm-6 col-xs-12" style={{ marginBottom: 20 }}>
                  <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e7ecf0', padding: 22, height: '100%' }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>📏</div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#131b2e', margin: '0 0 6px' }}>1. Chest / Bust</h4>
                    <p style={{ fontSize: 12, color: '#6c7b8a', lineHeight: 1.5, margin: 0 }}>
                      Measure around the fullest part of your chest, keeping the tape horizontal under the arms and across shoulder blades.
                    </p>
                  </div>
                </div>

                <div className="col-md-4 col-sm-6 col-xs-12" style={{ marginBottom: 20 }}>
                  <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e7ecf0', padding: 22, height: '100%' }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>👖</div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#131b2e', margin: '0 0 6px' }}>2. Waist & Inseam</h4>
                    <p style={{ fontSize: 12, color: '#6c7b8a', lineHeight: 1.5, margin: 0 }}>
                      Our trousers feature an elastic waistband with drawstrings for tailored tension. Measure around your natural waistline.
                    </p>
                  </div>
                </div>

                <div className="col-md-4 col-sm-12 col-xs-12" style={{ marginBottom: 20 }}>
                  <div style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e7ecf0', padding: 22, height: '100%' }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>🔄</div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: '#131b2e', margin: '0 0 6px' }}>3. Free Exchange</h4>
                    <p style={{ fontSize: 12, color: '#6c7b8a', lineHeight: 1.5, margin: 0 }}>
                      Not sure about your size? We offer a 7-day hassle-free size exchange policy across Pakistan with courier pickup.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to action */}
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Link
                  href="/shop"
                  style={{
                    display: 'inline-block',
                    background: '#052263',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 14,
                    padding: '14px 32px',
                    borderRadius: 30,
                    textDecoration: 'none',
                    boxShadow: '0 6px 18px rgba(5, 34, 99, 0.25)',
                  }}
                >
                  Explore Medical Scrubs Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

