'use client';

/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState } from 'react';

interface StoreSettings {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
}

interface BlogPost {
  slug: string;
  title: string;
  createdAt: string;
  image?: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Medixa Pakistan',
  tagline: 'Precision-engineered medical apparel for healthcare professionals who demand excellence in medical scrubs across Pakistan.',
  supportEmail: 'info@medixa.pk',
  supportPhone: '+92 343 511 4065',
  whatsapp: '+92 343 511 4065',
  address: 'Karachi & Lahore, Pakistan',
  instagramUrl: 'https://instagram.com/medixa.pk',
  facebookUrl: 'https://facebook.com/medixa.pk',
};

const DEFAULT_BLOGS: BlogPost[] = [
  {
    slug: 'the-medixa-standard-why-fabric-matters',
    title: 'Why Fabric Engineering Matters in Healthcare',
    createdAt: '2026-10-25T10:00:00.000Z',
    image: '/img/footer-post/fpost1.jpg',
  },
  {
    slug: 'how-to-choose-your-perfect-scrub-fit',
    title: 'How to Choose Your Perfect Scrub Silhouette',
    createdAt: '2026-10-28T10:00:00.000Z',
    image: '/img/footer-post/fpost2.jpg',
  },
  {
    slug: 'inside-our-karachi-medical-apparel-studio',
    title: 'Tailoring for Pakistan Healthcare Heroes',
    createdAt: '2026-11-01T10:00:00.000Z',
    image: '/img/footer-post/fpost3.jpg',
  },
];

export default function Footer() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [blogs, setBlogs] = useState<BlogPost[]>(DEFAULT_BLOGS);

  useEffect(() => {
    // Dynamically load store settings from DB
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
          }));
        }
      })
      .catch(() => {});

    // Dynamically load recent clinical posts from CMS
    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 3).map((item, idx) => ({
            slug: item.slug || '',
            title: item.title || '',
            createdAt: item.createdAt || '',
            image: item.image || `/img/footer-post/fpost${(idx % 3) + 1}.jpg`,
          }));
          setBlogs(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const cleanWhatsapp = settings.whatsapp.replace(/[^\d]/g, '');

  return (
    <footer>
      <div className="footer-top-area">
        <div className="container">
          <div className="footer-top">
            <div className="row">
              {/* Brand & Dynamic Contact */}
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="footer-desc">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/logo-footer.png" alt={settings.storeName} style={{ maxHeight: 42, width: 'auto' }} />
                  <p>{settings.tagline}</p>
                  <div className="footer-desc-contact">
                    <h6>Contact Us:</h6>
                    <ul>
                      <li>
                        <i className="fa fa-phone"></i>
                        <a href={`tel:${settings.supportPhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {settings.supportPhone}
                        </a>
                      </li>
                      <li>
                        <i className="fa fa-envelope-o"></i>
                        <span>Email:{' '}</span>
                        <a href={`mailto:${settings.supportEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {settings.supportEmail}
                        </a>
                      </li>
                      <li>
                        <i className="fa fa-map-marker"></i>
                        <span>Address:{' '}</span>
                        {settings.address}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {' '}
              {/* Quick Links */}
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="footer-links">
                  <h4 className="footer-title">Quick Links</h4>
                  <ul className="clearfix">
                    <li>
                      <a href="/">Home</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop?category=Men">Men&apos;s Scrubs</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop?category=Women">Women&apos;s Scrubs</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop">All Collections</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/favourite">My Favourites</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/track-order">Track Your Order</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/size-guide">Size Chart & Guide</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/about">About Medixa</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/contact">Contact & Help</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/blog">Clinical Journal</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shipping-policy">Shipping Policy</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/refund-policy">7-Day Exchange</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/cart">My Cart</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/contact">Support Concierge</a>
                    </li>
                  </ul>
                </div>
              </div>
              {' '}
              {/* Dynamic Recent Journal Posts */}
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="footer-post-area">
                  <h4 className="footer-title">Clinical Journal</h4>
                  <div className="footer-posts">
                    {blogs.map((b, idx) => {
                      const dateObj = new Date(b.createdAt);
                      const formattedDate = isNaN(dateObj.getTime())
                        ? 'Nov 2026'
                        : dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

                      return (
                        <div key={b.slug || idx} className="single-footer-post">
                          <div className="clearfix">
                            <div className="footer-post-img">
                              <a href={`/blog/${b.slug}`}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={b.image || `/img/footer-post/fpost${(idx % 3) + 1}.jpg`}
                                  alt={b.title}
                                  style={{ width: 68, height: 50, objectFit: 'cover' }}
                                />
                              </a>
                            </div>
                            {' '}
                            <div className="footer-post-content">
                              <span className="fpc-date">{formattedDate}</span>
                              <a className="fpc-title" href={`/blog/${b.slug}`}>
                                {b.title}
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {' '}
              {/* Popular Medical Apparel Tags */}
              <div className="col-md-3 col-sm-6 col-xs-12">
                <div className="popular-tag">
                  <h4 className="footer-title">Popular Collections</h4>
                  <ul className="footer-tags">
                    <li>
                      <a href="/shop?category=Men">Men&apos;s Scrubs</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop?category=Women">Women&apos;s Scrubs</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop">Regal Scrub Suits</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop">Muse Scrub Suits</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop">Forte V-Neck</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop">Rebel Collar</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop">Zero Fading</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop">4-Way Stretch</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/track-order">Track Delivery</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/about">Export Quality</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/contact">Hospital Bulk</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom-area">
        <div className="container">
          <div className="footer-bottom">
            <div className="row">
              <div className="col-md-12 col-sm-6 col-xs-12">
                <div className="footer-social">
                  <ul>
                    {settings.instagramUrl && (
                      <li>
                        <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                          <i className="fa fa-instagram"></i>
                        </a>
                      </li>
                    )}
                    {' '}
                    {settings.facebookUrl && (
                      <li>
                        <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                          <i className="fa fa-facebook"></i>
                        </a>
                      </li>
                    )}
                    {' '}
                    {cleanWhatsapp && (
                      <li>
                        <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                          <i className="fa fa-whatsapp"></i>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              {' '}
              <div className="col-md-12 col-sm-6 col-xs-12">
                <div className="payment-method">
                  <ul>
                    <li title="Cash on Delivery">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/img/payment-method/mastercard.png" alt="Card payments" />
                    </li>
                    {' '}
                    <li title="Visa">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/img/payment-method/visa.png" alt="Visa" />
                    </li>
                  </ul>
                </div>
              </div>
              {' '}
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="footer-copyright">
                  <p>
                    © 2026 All rights reserved. {settings.storeName} — Export-Quality Medical Scrubs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
