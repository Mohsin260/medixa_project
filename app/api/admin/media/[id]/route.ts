import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';

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
    await db.media.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Media asset deleted' });
  } catch (err) {
    console.error('Delete media error:', err);
    return NextResponse.json({ error: 'Failed to delete media asset' }, { status: 500 });
  }
}

