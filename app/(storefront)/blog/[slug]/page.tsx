import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await params;

  let post = null;
  try {
    post = await db.post.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
    });
  } catch {
    // Fallback if DB is unreachable
  }

  // Fallback content if post not in DB
  const title = post?.title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const body = post?.body || 'Medical uniforms must balance strict sterilization requirements with ergonomic mobility. Medixa scrubs utilize a specialized poly-rayon-spandex blend that delivers lasting color fastness and breathable comfort throughout extended hospital rotations.';
  const excerpt = post?.excerpt || 'Discover why fabric engineering matters for Pakistan healthcare professionals.';
  const dateStr = post?.createdAt ? new Date(post.createdAt).toLocaleDateString('en-PK', { month: 'long', day: 'numeric', year: 'numeric' }) : 'November 2026';

  return (
    <>
      <Header />

      {/* Breadcrumbs Header */}
      <div style={{ background: '#f5faf7', padding: '40px 0', borderBottom: '1px solid #e5ede8' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-xs-12 text-center">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1f6b52', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Medixa Editorial
              </span>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: '#173c35', margin: '8px 0 12px', lineHeight: 1.25 }}>
                {title}
              </h1>
              <div style={{ fontSize: 13, color: '#748b81' }}>
                Published on {dateStr} · By Medixa Apparel Team
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div style={{ padding: '60px 0 90px', background: '#fafcfb' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-xs-12">
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  border: '1px solid #e6ebe8',
                  padding: '40px 36px',
                  boxShadow: '0 8px 30px rgba(20, 61, 54, 0.04)',
                }}
              >
                {/* Featured Photo */}
                <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 30 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/img/feature-post/feature1.jpg"
                    alt={title}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>

                <div style={{ fontSize: 16, color: '#314e44', lineHeight: 1.8, marginBottom: 24, fontWeight: 500 }}>
                  {excerpt}
                </div>

                <div style={{ fontSize: 15, color: '#4d695e', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                  {body}
                </div>

                {/* Scrub promo card */}
                <div
                  style={{
                    marginTop: 40,
                    padding: '24px 24px',
                    background: '#f2f8f5',
                    borderRadius: 14,
                    border: '1px solid #dbeef5',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: '#173c35', margin: '0 0 4px' }}>
                      Experience the Medixa Standard
                    </h4>
                    <p style={{ fontSize: 13, color: '#5e7a6f', margin: 0 }}>
                      Shop Regal, Muse, Forte & Rebel medical scrubs with nationwide cash on delivery.
                    </p>
                  </div>

                  <Link
                    href="/shop"
                    style={{
                      background: '#1f6b52',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: 13,
                      padding: '10px 22px',
                      borderRadius: 20,
                      textDecoration: 'none',
                    }}
                  >
                    View Catalog
                  </Link>
                </div>
              </div>

              {/* Back to Blog */}
              <div style={{ textAlign: 'center', marginTop: 30 }}>
                <Link href="/blog" style={{ color: '#1f6b52', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  ← Back to All Articles
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

