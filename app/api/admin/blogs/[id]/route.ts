import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireStaff } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';
import { ProductStatus } from '@/generated/prisma/client';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { title, excerpt, body: content, tags, status } = body;

  try {
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.body = content;
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags : [tags].filter(Boolean);
    }
    if (status !== undefined) {
      updateData.status = status as ProductStatus;
      if (status === 'PUBLISHED') updateData.publishedAt = new Date();
    }

    const updated = await db.post.update({
      where: { id },
      data: updateData,
      include: { author: true },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (err) {
    console.error('Update blog post error:', err);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { id } = await params;

  try {
    await db.post.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('Delete blog post error:', err);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}

