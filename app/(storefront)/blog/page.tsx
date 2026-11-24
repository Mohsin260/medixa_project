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
  image?: string | null;
  imageAlt?: string;
}

const FALLBACK_POSTS: Post[] = [];

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
            {posts.map((post) => (
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
                        src={post.image || ''}
                        alt={post.imageAlt || post.title}
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

