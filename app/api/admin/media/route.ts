import { NextRequest, NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';

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
        { filename: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await db.media.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ media: items });
  } catch (err) {
    console.error('Failed to list media:', err);
    return NextResponse.json({ error: 'Failed to fetch media assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const { url, filename, altText = '' } = body;
  if (!url || !filename) {
    return NextResponse.json({ error: 'URL and filename are required.' }, { status: 400 });
  }

  const key = `catalog/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  try {
    const media = await db.media.create({
      data: {
        key,
        url,
        filename,
        altText,
        mimeType: 'image/webp',
      },
    });

    return NextResponse.json({ success: true, media }, { status: 201 });
  } catch (err) {
    console.error('Create media record error:', err);
    return NextResponse.json({ error: 'Failed to register media' }, { status: 500 });
  }
}

