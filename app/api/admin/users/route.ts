import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';

export async function GET() {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    // 1. Fetch all users from Neon Auth
    const neonUsers = await db.$queryRaw<
      Array<{
        id: string;
        name: string | null;
        email: string;
        role: string | null;
        emailVerified: boolean | null;
        createdAt: Date;
      }>
    >`SELECT id, name, email, role, "emailVerified", "createdAt" 
      FROM neon_auth."user" 
      ORDER BY "createdAt" DESC`;

    // 2. Fetch Prisma users to correlate order counts & details
    const prismaUsers = await db.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        status: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    const prismaMap = new Map(prismaUsers.map((u) => [u.email.toLowerCase(), u]));

    const users = neonUsers.map((u) => {
      const p = prismaMap.get(u.email.toLowerCase());
      return {
        id: u.id,
        name: u.name || 'Unnamed',
        email: u.email,
        role: (u.role || 'user').toLowerCase(),
        emailVerified: Boolean(u.emailVerified),
        createdAt: u.createdAt.toISOString(),
        phone: p?.phone || null,
        status: p?.status || 'ACTIVE',
        orderCount: p?._count?.orders ?? 0,
      };
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error('Failed to list users:', err);
    return NextResponse.json({ error: 'Failed to retrieve users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };

  const { name, email, password, role = 'user' } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and temporary password are required.' },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters long.' },
      { status: 400 },
    );
  }

  const baseUrl = process.env.NEON_AUTH_BASE_URL?.replace(/\/$/, '');
  if (!baseUrl) {
    return NextResponse.json({ error: 'Neon Auth configuration is missing.' }, { status: 500 });
  }

  try {
    // 1. Create account in Neon Auth
    const res = await fetch(`${baseUrl}/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: request.nextUrl.origin,
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
        name: name?.trim() || email.split('@')[0],
      }),
    });

    const resData = (await res.json().catch(() => ({}))) as {
      user?: { id: string; email: string };
      message?: string;
      code?: string;
    };

    if (!res.ok) {
      return NextResponse.json(
        { error: resData.message || resData.code || 'Failed to create user in auth system.' },
        { status: res.status },
      );
    }

    const assignedRole = role.toLowerCase() === 'admin' ? 'admin' : 'user';

    // 2. Set role and mark verified if admin
    if (assignedRole === 'admin') {
      await db.$executeRaw`
        UPDATE neon_auth."user" 
        SET role = 'admin', "emailVerified" = true 
        WHERE email = ${email.trim().toLowerCase()}
      `;
    }

    // 3. Upsert in Prisma User table
    await db.user.upsert({
      where: { email: email.trim().toLowerCase() },
      update: {
        name: name?.trim() || email.split('@')[0],
        role: assignedRole === 'admin' ? 'ADMIN' : 'CUSTOMER',
        status: 'ACTIVE',
      },
      create: {
        email: email.trim().toLowerCase(),
        name: name?.trim() || email.split('@')[0],
        role: assignedRole === 'admin' ? 'ADMIN' : 'CUSTOMER',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: resData.user?.id,
        email: email.trim().toLowerCase(),
        name: name?.trim(),
        role: assignedRole,
      },
    });
  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating user.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    role?: 'admin' | 'user';
  };

  const { email, role } = body;

  if (!email || !role) {
    return NextResponse.json({ error: 'Email and new role are required.' }, { status: 400 });
  }

  const targetRole = role.toLowerCase() === 'admin' ? 'admin' : 'user';

  // Prevent admin from accidentally demoting themselves if they are the only admin
  if (email.toLowerCase() === authCheck.user.email.toLowerCase() && targetRole !== 'admin') {
    return NextResponse.json(
      { error: 'You cannot demote your own administrator account.' },
      { status: 400 },
    );
  }

  try {
    await db.$executeRaw`
      UPDATE neon_auth."user" 
      SET role = ${targetRole} 
      WHERE email = ${email.trim().toLowerCase()}
    `;

    await db.user.updateMany({
      where: { email: email.trim().toLowerCase() },
      data: {
        role: targetRole === 'admin' ? 'ADMIN' : 'CUSTOMER',
      },
    });

    return NextResponse.json({
      success: true,
      email: email.trim().toLowerCase(),
      role: targetRole,
    });
  } catch (err) {
    console.error('Update role error:', err);
    return NextResponse.json({ error: 'Failed to update user role.' }, { status: 500 });
  }
}
