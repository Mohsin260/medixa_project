import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const posts = await db.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        author: { select: { name: true } },
      },
    });

    if (posts.length > 0) {
      return NextResponse.json(posts);
    }

    // Default sample blogs if database has 0 posts yet
    const fallback = [
      {
        id: 'post-1',
        slug: 'the-medixa-standard-why-fabric-matters',
        title: 'The Medixa Standard: Why Fabric Engineering Matters in Healthcare',
        excerpt: 'Discover why breathable, 4-way stretch antimicrobial fabric makes all the difference during 14-hour hospital shifts.',
        tags: ['Guides', 'Fabric'],
        author: { name: 'Dr. Tariq Mahmood' },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'post-2',
        slug: 'how-to-choose-your-perfect-scrub-fit',
        title: 'How to Choose Your Perfect Scrub Fit: Size & Silhouette Guide',
        excerpt: 'A comprehensive guide for doctors and nurses on selecting between our tailored V-neck and collar-neck scrub suits.',
        tags: ['Tips', 'Style'],
        author: { name: 'Ayesha Malik' },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'post-3',
        slug: 'inside-our-karachi-medical-apparel-studio',
        title: 'Inside Our Design Studio: Tailoring for Pakistan Healthcare Heroes',
        excerpt: 'A behind-the-scenes look at how Medixa designs, crafts, and stress-tests medical uniforms for Pakistani professionals.',
        tags: ['Behind The Scenes'],
        author: { name: 'Medixa Editorial' },
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Failed to get public blogs:', err);
    return NextResponse.json([]);
  }
}

