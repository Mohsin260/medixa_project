import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { ProductStatus } from '@/generated/prisma/client';

export async function GET(request: NextRequest) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  try {
    const whereClause: Record<string, unknown> = {};
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const posts = await db.post.findMany({
      where: whereClause,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      authorName: p.author?.name || 'Medixa Editorial',
      authorEmail: p.author?.email || 'admin@medixa.pk',
      tags: p.tags,
      status: p.status,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      createdAt: p.createdAt.toISOString(),
    }));

    return NextResponse.json({ posts: formatted });
  } catch (err) {
    console.error('Failed to list blogs:', err);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const {
    title,
    slug: rawSlug,
    excerpt = '',
    body: content = '',
    tags = ['Medical', 'Scrubs'],
    status = 'PUBLISHED',
  } = body;

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and body are required.' }, { status: 400 });
  }

  const slug =
    rawSlug?.trim() ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  try {
    // Find or create admin author in Prisma
    let author = await db.user.findFirst({
      where: { email: authCheck.user.email },
    });

    if (!author) {
      author = await db.user.create({
        data: {
          email: authCheck.user.email,
          name: authCheck.user.name || 'Medixa Editor',
          role: 'ADMIN',
          status: 'ACTIVE',
        },
      });
    }

    const post = await db.post.create({
      data: {
        title,
        slug,
        excerpt,
        body: content,
        authorId: author.id,
        tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
        status: status as ProductStatus,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (err: unknown) {
    console.error('Create blog post error:', err);
    const message = err instanceof Error ? err.message : 'Failed to create blog post';
    return NextResponse.json(
      { error: message.includes('Unique constraint') ? 'A post with this slug already exists' : message },
      { status: 500 },
    );
  }
}

