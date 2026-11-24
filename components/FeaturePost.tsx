'use client';

import { useEffect, useState } from 'react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  createdAt: string;
  image?: string | null;
  imageAlt?: string;
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

  const displayPosts = posts
    .filter(
      (post): post is BlogPost & { image: string } =>
        typeof post.image === 'string' && post.image.trim().length > 0,
    )
    .slice(0, 3);

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
            {displayPosts.map((post) => (
              <div key={post.id} className="col-md-4 col-sm-6 col-xs-12" style={{ marginBottom: 30 }}>
                <div className="single-feature-post">
                  <div className="feature-post-img">
                    <a href={`/blog/${post.slug}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                      />
                    </a>
                    <div className="fp-cat">
                      <span>{post.tags?.[0] || 'Medical'}</span>
                    </div>
                  </div>
                  <div className="feature-post-content">
                    <a className="fp-title" href={`/blog/${post.slug}`}>
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
