import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';

export async function GET() {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const settingsRows = await db.storeSetting.findMany();
    const map: Record<string, unknown> = {};
    for (const row of settingsRows) {
      map[row.key] = row.value;
    }

    // Default settings if empty
    const defaults = {
      storeName: 'Medixa Pakistan',
      tagline: 'Precision-engineered medical apparel for healthcare professionals who demand excellence in medical scrubs across Pakistan.',
      supportEmail: 'info@medixa.pk',
      supportPhone: '+92 343 511 4065',
      whatsapp: '+92 343 511 4065',
      address: 'Karachi & Lahore, Pakistan',
      instagramUrl: 'https://instagram.com/medixa.pk',
      facebookUrl: 'https://facebook.com/medixa.pk',
      currency: 'PKR',
      standardDeliveryFee: 250,
      freeShippingThreshold: 10000,
      estimatedDeliveryDays: '3-5 Working Days',
      codEnabled: true,
      jazzcashEnabled: true,
      easypaisaEnabled: true,
      ...map,
    };

    return NextResponse.json({ settings: defaults });
  } catch (err) {
    console.error('Failed to get store settings:', err);
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ error: 'Invalid settings body' }, { status: 400 });
  }

  try {
    const upserts = Object.entries(body).map(([key, value]) =>
      db.storeSetting.upsert({
        where: { key },
        update: { value: value as object },
        create: { key, value: value as object },
      }),
    );

    await Promise.all(upserts);

    return NextResponse.json({ success: true, message: 'Settings saved' });
  } catch (err) {
    console.error('Save store settings error:', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

