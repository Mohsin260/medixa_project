import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settingsRows = await db.storeSetting.findMany();
    const map: Record<string, unknown> = {};
    for (const row of settingsRows) {
      map[row.key] = row.value;
    }

    const settings = {
      storeName: 'Medixa Pakistan',
      tagline: 'Precision-engineered medical apparel for healthcare professionals who demand excellence in medical scrubs across Pakistan.',
      supportEmail: 'info@medixa.pk',
      supportPhone: '+92 343 511 4065',
      whatsapp: '+92 343 511 4065',
      address: 'Karachi & Lahore, Pakistan',
      instagramUrl: 'https://instagram.com/medixa.pk',
      facebookUrl: 'https://facebook.com/medixa.pk',
      standardDeliveryFee: 250,
      freeShippingThreshold: 10000,
      estimatedDeliveryDays: '3-5 Working Days',
      currency: 'PKR',
      codEnabled: true,
      ...map,
    };

    return NextResponse.json(
      { settings },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (err) {
    console.error('Failed to get public store settings:', err);
    // Graceful fallback to default Medixa settings
    return NextResponse.json({
      settings: {
        storeName: 'Medixa Pakistan',
        tagline: 'Precision-engineered medical apparel for healthcare professionals who demand excellence in medical scrubs across Pakistan.',
        supportEmail: 'info@medixa.pk',
        supportPhone: '+92 343 511 4065',
        whatsapp: '+92 343 511 4065',
        address: 'Karachi & Lahore, Pakistan',
        instagramUrl: 'https://instagram.com/medixa.pk',
        facebookUrl: 'https://facebook.com/medixa.pk',
        standardDeliveryFee: 250,
        freeShippingThreshold: 10000,
        estimatedDeliveryDays: '3-5 Working Days',
        currency: 'PKR',
        codEnabled: true,
      },
    });
  }
}

