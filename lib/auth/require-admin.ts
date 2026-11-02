import { auth } from '@/lib/auth/server';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  image?: string | null;
}

/**
 * Server-side helper to ensure the current session belongs to an active Administrator.
 * Returns either the authorized user or a formatted error response.
 */
export async function requireAdmin(): Promise<
  | { authorized: true; user: AdminUser }
  | { authorized: false; status: 401 | 403; error: string }
> {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return {
      authorized: false,
      status: 401,
      error: 'Authentication required. Please sign in.',
    };
  }

  const role = ((session.user as { role?: string }).role || '').toLowerCase();
  if (role !== 'admin') {
    return {
      authorized: false,
      status: 403,
      error: 'Access denied: Administrator privileges required.',
    };
  }

  return {
    authorized: true,
    user: {
      ...session.user,
      role: (session.user as { role?: string }).role || 'admin',
    } as AdminUser,
  };
}
