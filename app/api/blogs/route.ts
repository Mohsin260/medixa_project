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
        featuredMedia: { select: { url: true, altText: true } },
      },
    });

    if (posts.length > 0) {
      return NextResponse.json(posts.map((post) => ({
        ...post,
        image: post.featuredMedia?.url || null,
        imageAlt: post.featuredMedia?.altText || post.title,
      })));
    }

    return NextResponse.json([]);
  } catch (err) {
    console.error('Failed to get public blogs:', err);
    return NextResponse.json([]);
  }
}

