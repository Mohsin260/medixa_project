import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const body = (await request.json().catch(() => ({}))) as {
    currentPassword?: string;
    newPassword?: string;
    revokeOtherSessions?: boolean;
  };

  const { currentPassword, newPassword, revokeOtherSessions = true } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: 'Both current password and new password are required.' },
      { status: 400 },
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: 'New password must be at least 8 characters long.' },
      { status: 400 },
    );
  }

  const baseUrl = process.env.NEON_AUTH_BASE_URL?.replace(/\/$/, '');
  if (!baseUrl) {
    return NextResponse.json({ error: 'Neon Auth configuration is missing.' }, { status: 500 });
  }

  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const res = await fetch(`${baseUrl}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: request.nextUrl.origin,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      }),
    });

    const resData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: resData.message || 'Failed to update password. Please check your current password.' },
        { status: res.status },
      );
    }

    // Forward any session cookies if updated
    const response = NextResponse.json({
      success: true,
      message: 'Password changed successfully.',
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (err) {
    console.error('Password change error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while changing password.' },
      { status: 500 },
    );
  }
}

