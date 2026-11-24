import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/server';
import { sealInventoryQuery } from '@/lib/realtime/server';
import { connection } from 'next/server';

export async function POST() {
  await connection();
  const { data: session } = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sealed = await sealInventoryQuery();
    return NextResponse.json(sealed);
  } catch (err) {
    console.error('Seal failed', err);
    return NextResponse.json({ error: 'Failed to seal query' }, { status: 500 });
  }
}
