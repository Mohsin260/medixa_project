'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  CircleAlert,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AdminFullPage } from '@/components/admin/admin-full-page';

export type StaffRole = 'admin' | 'editor' | 'user';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  emailVerified: boolean;
  createdAt: string;
  phone: string | null;
  status: string;
  orderCount: number;
}

const ROLE_LABEL: Record<StaffRole, string> = {
  admin: 'Administrator',
  editor: 'Shop Manager',
  user: 'Customer',
};

export function UsersManager({
  onNotify,
  onToggleSidebar,
}: {
  onNotify?: (msg: string) => void;
  onToggleSidebar?: () => void;
}) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all');

  const [showAddPage, setShowAddPage] = useState(false);
  const [actionMenuUser, setActionMenuUser] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        throw new Error('Failed to load users');
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load users');
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          setUsers(data.users || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error fetching users');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchQuery =
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase()) ||
        (u.phone && u.phone.includes(query));

      const matchRole = roleFilter === 'all' ? true : u.role === roleFilter;

      return matchQuery && matchRole;
    });
  }, [users, query, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const managers = users.filter((u) => u.role === 'editor').length;
    const customers = users.filter((u) => u.role === 'user').length;
    const verified = users.filter((u) => u.emailVerified).length;
    return { total, admins, managers, customers, verified };
  }, [users]);

  async function handleSetRole(user: ManagedUser, newRole: StaffRole) {
    if (user.role === newRole) {
      setActionMenuUser(null);
      return;
    }

    const confirmPrompt =
      newRole === 'admin'
        ? `Promote ${user.name} (${user.email}) to Administrator? They will receive full studio access, including deletion.`
        : newRole === 'editor'
          ? `Make ${user.name} a Shop Manager? They can edit content but cannot delete records or manage users.`
          : `Demote ${user.name} to Customer? They will lose studio access immediately.`;

    if (!window.confirm(confirmPrompt)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update role');
        return;
      }
      onNotify?.(`${user.name} is now ${ROLE_LABEL[newRole]}.`);
      fetchUsers();
    } catch {
      alert('Network error while updating role');
    } finally {
      setActionMenuUser(null);
    }
  }

  if (showAddPage) {
    return (
      <AddUserPage
        onClose={() => setShowAddPage(false)}
        onToggleSidebar={onToggleSidebar}
        onSuccess={() => {
          fetchUsers();
          onNotify?.('New user created successfully.');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e6e9f2] text-[#1c3f78]">
              <Users size={19} />
            </div>
            <span className="rounded-full bg-[#f4f6f9] px-2.5 py-0.5 text-[11px] font-semibold text-[#546473]">
              Registered
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#77828f]">Total Accounts</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9ecf4] text-[#1e7e48]">
              <ShieldCheck size={19} />
            </div>
            <span className="rounded-full bg-[#eaf7f0] px-2.5 py-0.5 text-[11px] font-semibold text-[#27815a]">
              Full access
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#77828f]">Administrators</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">{stats.admins}</p>
        </div>

        <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#fdf3e3] text-[#a97318]">
              <Briefcase size={19} />
            </div>
            <span className="rounded-full bg-[#fdf6ea] px-2.5 py-0.5 text-[11px] font-semibold text-[#96701f]">
              Edit only
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#77828f]">Shop Managers</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">{stats.managers}</p>
        </div>

        <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#fbe4eb] text-[#c05f7b]">
              <UserCheck size={19} />
            </div>
            <span className="rounded-full bg-[#fdf0f4] px-2.5 py-0.5 text-[11px] font-semibold text-[#ad4a67]">
              Storefront
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#77828f]">Customer Accounts</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">{stats.customers}</p>
        </div>

        <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9e8ff] text-[#625fd0]">
              <CheckCircle2 size={19} />
            </div>
            <span className="rounded-full bg-[#f0effe] px-2.5 py-0.5 text-[11px] font-semibold text-[#625fd0]">
              Active
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#77828f]">Verified Emails</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">{stats.verified}</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-[#e7ecf0] bg-white shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        {/* Card Header */}
        <div className="flex flex-col gap-4 border-b border-[#edf1f5] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#939fa9]">
              Workspace / Users & Access
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#131b2e]">User Directory</h2>
            <p className="mt-1 text-xs text-[#7e8a96]">
              Manage administrators, shop managers, customer accounts, and access permissions in real
              time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
              className="border-[#dee7ee] text-[#556572]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={() => setShowAddPage(true)}
              className="bg-[#052263] text-white hover:bg-[#031849] shadow-sm"
            >
              <UserPlus size={16} />
              <span>Add team member</span>
            </Button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col gap-3 border-b border-[#edf1f5] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-[#99a5af]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="h-9 w-full rounded-lg border border-[#dee7ee] bg-[#fbfcfd] pl-9 pr-3 text-xs outline-none ring-[#bcc7de] placeholder:text-[#a9b4be] focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            {(
              [
                ['all', `All (${users.length})`],
                ['admin', `Admins (${stats.admins})`],
                ['editor', `Managers (${stats.managers})`],
                ['user', `Customers (${stats.customers})`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setRoleFilter(value)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  roleFilter === value
                    ? 'bg-[#e9ecf4] text-[#041d52]'
                    : 'text-[#72808d] hover:bg-[#f3f5f8]',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="m-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <CircleAlert size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-[#edf1f5] text-[10px] uppercase tracking-[0.12em] text-[#99a5af]">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="py-3 font-semibold">Role</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Orders</th>
                <th className="py-3 font-semibold">Joined Date</th>
                <th className="pr-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#7c8996]">
                      <Loader2 size={24} className="animate-spin text-[#052263]" />
                      <span>Loading user directory…</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8b98a4]">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const isEditor = u.role === 'editor';
                  const initials =
                    u.name
                      .split(' ')
                      .map((n) => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'U';

                  return (
                    <tr key={u.id} className="border-b border-[#f1f4f7] last:border-0 hover:bg-[#fafbfb]">
                      {/* User Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm',
                              isAdmin
                                ? 'bg-[#e4e7f0] text-[#143a72]'
                                : isEditor
                                  ? 'bg-[#fdf3e3] text-[#a97318]'
                                  : 'bg-[#e8ebf3] text-[#23477f]',
                            )}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-[#202a3c]">{u.name}</span>
                              {isAdmin && (
                                <span title="Administrator">
                                  <Shield size={12} className="text-[#052263]" />
                                </span>
                              )}
                              {isEditor && (
                                <span title="Shop Manager">
                                  <Briefcase size={12} className="text-[#a97318]" />
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#7c8996]">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                            isAdmin
                              ? 'bg-[#eaf7f0] text-[#1b7a54]'
                              : isEditor
                                ? 'bg-[#fdf6ea] text-[#96701f]'
                                : 'bg-[#eff2f9] text-[#1a3f7a]',
                          )}
                        >
                          {isAdmin ? <ShieldCheck size={12} /> : null}
                          {isEditor ? <Briefcase size={12} /> : null}
                          {ROLE_LABEL[u.role]}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            u.emailVerified
                              ? 'bg-[#eaf7f0] text-[#27815a]'
                              : 'bg-[#fff5e5] text-[#b87823]',
                          )}
                        >
                          <span
                            className={cn(
                              'size-1.5 rounded-full',
                              u.emailVerified ? 'bg-[#27815a]' : 'bg-[#b87823]',
                            )}
                          />
                          {u.emailVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="py-3.5 text-xs font-medium text-[#49616e]">
                        {u.orderCount > 0 ? `${u.orderCount} orders` : '—'}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 text-[11px] text-[#7f8b97]">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="pr-5 py-3.5 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            onClick={() => setActionMenuUser(actionMenuUser === u.id ? null : u.id)}
                            className="rounded-lg p-1 text-[#7e8a96] hover:bg-[#f1f4f7] hover:text-[#202a3c]"
                            aria-label="User actions"
                          >
                            <MoreHorizontal size={17} />
                          </button>

                          {actionMenuUser === u.id && (
                            <div className="absolute right-5 z-20 mt-1 w-52 rounded-xl border border-[#dde5ec] bg-white p-1 shadow-lg">
                              {!isAdmin && (
                                <button
                                  onClick={() => handleSetRole(u, 'admin')}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#2c3851] hover:bg-[#f4f6f9]"
                                >
                                  <ShieldCheck size={14} className="text-[#052263]" />
                                  Make Administrator
                                </button>
                              )}
                              {!isEditor && (
                                <button
                                  onClick={() => handleSetRole(u, 'editor')}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#2c3851] hover:bg-[#f4f6f9]"
                                >
                                  <Briefcase size={14} className="text-[#a97318]" />
                                  Make Shop Manager
                                </button>
                              )}
                              {u.role !== 'user' && (
                                <button
                                  onClick={() => handleSetRole(u, 'user')}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#2c3851] hover:bg-[#f4f6f9]"
                                >
                                  <UserCheck size={14} className="text-[#1a3f7a]" />
                                  Demote to Customer
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-[#edf1f5] p-4 text-xs text-[#7e8a96]">
          <span>
            Showing {filteredUsers.length} of {users.length} accounts
          </span>
          <span className="text-[11px] text-[#99a5af]">Neon Auth & PostgreSQL Managed Identity</span>
        </div>
      </div>
    </div>
  );
}

function AddUserPage({
  onClose,
  onToggleSidebar,
  onSuccess,
}: {
  onClose: () => void;
  onToggleSidebar?: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<StaffRole>('editor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function generatePassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = 'Mx-';
    for (let i = 0; i < 12; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(res);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create user');
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError('Network error while creating user');
    } finally {
      setLoading(false);
    }
  }

  const roleOptions: Array<{
    value: StaffRole;
    label: string;
    description: string;
    icon: React.ReactNode;
    iconClass: string;
  }> = [
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Full access, including delete',
      icon: <ShieldCheck size={18} />,
      iconClass: 'text-[#052263]',
    },
    {
      value: 'editor',
      label: 'Shop Manager',
      description: 'Can edit, cannot delete',
      icon: <Briefcase size={18} />,
      iconClass: 'text-[#a97318]',
    },
    {
      value: 'user',
      label: 'Customer',
      description: 'Storefront buyer',
      icon: <UserCheck size={18} />,
      iconClass: 'text-[#1c4078]',
    },
  ];

  return (
    <AdminFullPage
      title="Add User Account"
      subtitle="Administrator, shop manager, or customer profile"
      icon={<UserPlus size={20} />}
      onClose={onClose}
      onToggleSidebar={onToggleSidebar}
      backLabel="Back to users"
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-[#dde5ec] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)] sm:p-6"
      >
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <CircleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#293447] mb-1.5">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dr. Ayesha Khan"
            required
            className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#293447] mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. ayesha@medixa.pk"
            required
            className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-[#293447]">Temporary Password</label>
            <button
              type="button"
              onClick={generatePassword}
              className="text-[11px] font-semibold text-[#052263] hover:underline"
            >
              Generate strong
            </button>
          </div>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            required
            minLength={8}
            className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 font-mono text-xs text-[#1d2739] outline-none transition focus:border-[#052263] focus:bg-white focus:ring-2 focus:ring-[#052263]/15"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#293447] mb-1.5">Account Role</label>
          <div className="grid gap-2 sm:grid-cols-3">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-xl border p-3 text-center transition',
                  role === option.value
                    ? 'border-[#052263] bg-[#eef1f8] text-[#0b2a60]'
                    : 'border-[#dde5ec] text-[#637b72] hover:bg-[#f7fafc]',
                )}
              >
                <span className={cn('mb-1', option.iconClass)}>{option.icon}</span>
                <span className="text-xs font-bold">{option.label}</span>
                <span className="text-[10px] text-[#778d85]">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#edf1f5]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={onClose}
            className="border-[#dde5ec] text-[#556371]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={loading}
            className="bg-[#052263] text-white hover:bg-[#031849]"
          >
            {loading ? 'Creating…' : 'Create User'}
          </Button>
        </div>
      </form>
    </AdminFullPage>
  );
}
