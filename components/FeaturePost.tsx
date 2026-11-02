'use client';

import { useEffect, useState } from 'react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  createdAt: string;
}

export default function FeaturePost() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

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

  const displayPosts =
    posts.length > 0
      ? posts
      : [
          {
            id: '1',
            slug: 'the-medixa-standard-why-fabric-matters',
            title: 'The Medixa Standard: Why Fabric Engineering Matters in Healthcare',
            tags: ['Fabric Technology'],
            createdAt: '2026-10-25',
          },
          {
            id: '2',
            slug: 'how-to-choose-your-perfect-scrub-fit',
            title: 'How to Choose Your Perfect Scrub Fit: Size & Silhouette Guide',
            tags: ['Size Guide'],
            createdAt: '2026-10-28',
          },
          {
            id: '3',
            slug: 'inside-our-karachi-medical-apparel-studio',
            title: 'Inside Our Design Studio: Tailoring for Pakistan Healthcare Heroes',
            tags: ['Behind The Scenes'],
            createdAt: '2026-11-01',
          },
        ];

  return (
    <div className="feature-post-area">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="feature-post-head">
              <div className="section-title">
                <span>MEDIXA JOURNAL</span>
                <h2>Featured POSTS</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="feature-post-grid">
            {displayPosts.map((post, idx) => (
              <div key={post.id} className="col-md-4 col-sm-6 col-xs-12" style={{ marginBottom: 30 }}>
                <div className="single-feature-post">
                  <div className="feature-post-img">
                    <a href={`#${post.slug}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/img/feature-post/feature${(idx % 2) + 1}.jpg`}
                        alt={post.title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </a>
                    <div className="fp-cat">
                      <span>{post.tags?.[0] || 'Medical'}</span>
                    </div>
                  </div>
                  <div className="feature-post-content">
                    <a className="fp-title" href={`#${post.slug}`}>
                      {post.title}
                    </a>
                    <div className="fp-meta">
                      <span className="comment">
                        <i className="fa fa-comments" /> Medixa Article
                      </span>
                      <span className="date">
                        <i className="fa fa-clock-o" />{' '}
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
