import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/require-admin';
import { getObjectUrl } from '@/lib/storage';

export async function POST(request: Request) {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const { key, expiresIn } = (await request.json()) as { key?: string; expiresIn?: number };
  if (!key || typeof key !== 'string') {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }
  if (key.includes('..') || key.startsWith('/')) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 });
  }

  try {
    const url = await getObjectUrl(key, expiresIn ?? 3600);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('Presign failed', err);
    return NextResponse.json({ error: 'Failed to sign URL' }, { status: 500 });
  }
}
