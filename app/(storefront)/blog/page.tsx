'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  createdAt: string;
}

const FALLBACK_POSTS: Post[] = [
  {
    id: '1',
    slug: 'the-medixa-standard-why-fabric-matters',
    title: 'The Medixa Standard: Why Fabric Engineering Matters in Healthcare',
    excerpt: 'Behind the scenes look into our 4-way stretch poly-rayon-spandex textile blend engineered for high-mobility medical environments.',
    tags: ['Fabric Tech', 'Comfort'],
    createdAt: '2026-10-25',
  },
  {
    id: '2',
    slug: 'how-to-choose-your-perfect-scrub-fit',
    title: 'How to Choose Your Perfect Scrub Fit: Size & Silhouette Guide',
    excerpt: 'From active V-necks to classic round collars, discover which cut complements your body type and hospital duty demands.',
    tags: ['Fit & Sizing', 'Guides'],
    createdAt: '2026-10-28',
  },
  {
    id: '3',
    slug: 'inside-our-karachi-medical-apparel-studio',
    title: 'Inside Our Studio: Tailoring for Pakistan Healthcare Heroes',
    excerpt: 'How we combine international dyeing precision with local craftsmanship to guarantee zero color fading on hospital scrubs.',
    tags: ['Behind The Scenes'],
    createdAt: '2026-11-01',
  },
  {
    id: '4',
    slug: 'maintaining-scrub-color-fastness-laundry-guide',
    title: 'Autoclave & Laundry Tips: Keeping Your Scrubs Vibrant For Years',
    excerpt: 'Key tips on temperature, detergents, and washing rotations to ensure your scrubs stay crisp and bacteria-free.',
    tags: ['Care & Longevity'],
    createdAt: '2026-11-02',
  },
];

export default function BlogDirectoryPage() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK_POSTS);

  useEffect(() => {
    let ignore = false;
    fetch('/api/blogs')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!ignore && Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <Header />

      {/* Breadcrumb Header */}
      <div style={{ background: '#f5f6fa', padding: '36px 0', borderBottom: '1px solid #e5ebf1' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Medixa Clinical Journal
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#131b2e', margin: '6px 0 0' }}>
                Insights for Healthcare Heroes
              </h1>
              <p style={{ fontSize: 13, color: '#738290', margin: '8px auto 0', maxWidth: 500 }}>
                Fabric science, clinical shift ergonomics, and medical lifestyle news curated by Medixa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Blog Grid */}
      <div style={{ padding: '60px 0 90px', background: '#fafcfd' }}>
        <div className="container">
          <div className="row">
            {posts.map((post, idx) => (
              <div key={post.id} className="col-md-6 col-xs-12" style={{ marginBottom: 30 }}>
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    border: '1px solid #e7ecf0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxShadow: '0 4px 20px rgba(19,27,46, 0.04)',
                  }}
                >
                  <div style={{ position: 'relative', height: 240, overflow: 'hidden', background: '#f0f4f8' }}>
                    <Link href={`/blog/${post.slug}`} style={{ display: 'block', height: '100%' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/img/feature-post/feature${(idx % 2) + 1}.jpg`}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Link>
                    <span
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        background: 'rgba(19,27,46, 0.88)',
                        color: '#ffffff',
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 6,
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {post.tags?.[0] || 'Medical Apparel'}
                    </span>
                  </div>

                  <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#8995a3', marginBottom: 6 }}>
                      {new Date(post.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })} · Medixa Journal
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#131b2e', margin: '0 0 10px', lineHeight: 1.35 }}>
                      <Link href={`/blog/${post.slug}`} style={{ color: '#131b2e', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                    </h3>
                    <p style={{ fontSize: 13, color: '#667d73', lineHeight: 1.6, flex: 1, margin: '0 0 16px' }}>
                      {post.excerpt || 'Read the full editorial on apparel durability and healthcare lifestyle.'}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#052263',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      Read Article →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

