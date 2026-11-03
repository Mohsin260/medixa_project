import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const sessionUserId = session.user.id ? String(session.user.id) : null;
    const sessionEmail = session.user.email ? String(session.user.email).toLowerCase().trim() : null;

    let dbUser = null;
    if (sessionUserId) {
      dbUser = await db.user.findUnique({
        where: { id: sessionUserId },
        select: { id: true, name: true, email: true, phone: true, role: true, image: true },
      });
    }

    if (!dbUser && sessionEmail) {
      dbUser = await db.user.findUnique({
        where: { email: sessionEmail },
        select: { id: true, name: true, email: true, phone: true, role: true, image: true },
      });
    }

    if (!dbUser) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: sessionUserId || '',
          name: session.user.name || 'Valued Customer',
          email: session.user.email || '',
          phone: '',
          role: 'CUSTOMER',
          image: null,
        },
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: dbUser.id,
        name: dbUser.name || session.user.name || 'Valued Customer',
        email: dbUser.email,
        phone: dbUser.phone || '',
        role: dbUser.role,
        image: dbUser.image,
      },
    });
  } catch (err) {
    console.error('Fetch me error:', err);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
