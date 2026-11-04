import { auth } from '@/lib/auth/server';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  image?: string | null;
}

export type StaffRole = 'admin' | 'editor';

const SHOP_MANAGER_ROLES = new Set(['editor', 'shop_manager', 'shop-manager', 'manager']);

function normalizeRole(value: unknown): StaffRole | null {
  const role = String(value || '').trim().toLowerCase();
  if (role === 'admin') return 'admin';
  if (SHOP_MANAGER_ROLES.has(role)) return 'editor';
  return null;
}

async function getStaffSession(): Promise<
  | { authorized: true; user: AdminUser; staffRole: StaffRole }
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

  const staffRole = normalizeRole((session.user as { role?: string }).role);
  if (!staffRole) {
    return {
      authorized: false,
      status: 403,
      error: 'Access denied: Medixa team privileges are required.',
    };
  }

  return {
    authorized: true,
    staffRole,
    user: {
      ...session.user,
      role: staffRole,
    } as AdminUser,
  };
}

/**
 * Server-side helper for administrator-only actions (destructive operations,
 * user management, and store settings).
 */
export async function requireAdmin(): Promise<
  | { authorized: true; user: AdminUser }
  | { authorized: false; status: 401 | 403; error: string }
> {
  const result = await getStaffSession();
  if (!result.authorized) return result;

  if (result.staffRole !== 'admin') {
    return {
      authorized: false,
      status: 403,
      error: 'Access denied: Administrator privileges required.',
    };
  }

  return { authorized: true, user: result.user };
}

/**
 * Server-side helper for admin studio access. Administrators and Shop Managers
 * (editors) may read, create, and update records. Only administrators may delete.
 */
export async function requireStaff(): Promise<
  | { authorized: true; user: AdminUser; isAdmin: boolean }
  | { authorized: false; status: 401 | 403; error: string }
> {
  const result = await getStaffSession();
  if (!result.authorized) return result;

  return {
    authorized: true,
    user: result.user,
    isAdmin: result.staffRole === 'admin',
  };
}
