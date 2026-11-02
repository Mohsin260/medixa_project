'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
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
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  emailVerified: boolean;
  createdAt: string;
  phone: string | null;
  status: string;
  orderCount: number;
}

export function UsersManager({ onNotify }: { onNotify?: (msg: string) => void }) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

  const [showAddModal, setShowAddModal] = useState(false);
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

      const matchRole =
        roleFilter === 'all' ? true : roleFilter === 'admin' ? u.role === 'admin' : u.role !== 'admin';

      return matchQuery && matchRole;
    });
  }, [users, query, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const customers = total - admins;
    const verified = users.filter((u) => u.emailVerified).length;
    return { total, admins, customers, verified };
  }, [users]);

  async function handleToggleRole(user: ManagedUser) {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmPrompt =
      newRole === 'admin'
        ? `Promote ${user.name} (${user.email}) to Administrator? They will receive full studio access.`
        : `Demote ${user.name} to Customer? They will lose admin access immediately.`;

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
      onNotify?.(`User role changed to ${newRole}`);
      fetchUsers();
    } catch {
      alert('Network error while updating role');
    } finally {
      setActionMenuUser(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e3f3ed] text-[#287a5b]">
              <Users size={19} />
            </div>
            <span className="rounded-full bg-[#f4f7f5] px-2.5 py-0.5 text-[11px] font-semibold text-[#547368]">
              Registered
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#788782]">Total Accounts</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#173c35]">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e6f4ea] text-[#1e7e48]">
              <ShieldCheck size={19} />
            </div>
            <span className="rounded-full bg-[#eaf7f0] px-2.5 py-0.5 text-[11px] font-semibold text-[#27815a]">
              Privileged
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#788782]">Administrators</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#173c35]">{stats.admins}</p>
        </div>

        <div className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#fbe4eb] text-[#c05f7b]">
              <UserCheck size={19} />
            </div>
            <span className="rounded-full bg-[#fdf0f4] px-2.5 py-0.5 text-[11px] font-semibold text-[#ad4a67]">
              Storefront
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#788782]">Customer Accounts</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#173c35]">{stats.customers}</p>
        </div>

        <div className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9e8ff] text-[#625fd0]">
              <CheckCircle2 size={19} />
            </div>
            <span className="rounded-full bg-[#f0effe] px-2.5 py-0.5 text-[11px] font-semibold text-[#625fd0]">
              Active
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#788782]">Verified Emails</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#173c35]">{stats.verified}</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-[#e6ebe8] bg-white shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
        {/* Card Header */}
        <div className="flex flex-col gap-4 border-b border-[#edf1ee] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a29c]">
              Workspace / Users & Access
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#173c35]">User Directory</h2>
            <p className="mt-1 text-xs text-[#81918a]">
              Manage administrators, customer accounts, and access permissions in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
              className="border-[#dfe8e3] text-[#557067]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#1f6b52] text-white hover:bg-[#185540] shadow-sm"
            >
              <UserPlus size={16} />
              <span>Add team member</span>
            </Button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-col gap-3 border-b border-[#edf1ee] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-[#9aa7a1]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="h-9 w-full rounded-lg border border-[#dfe8e3] bg-[#fbfcfb] pl-9 pr-3 text-xs outline-none ring-[#b9d9ca] placeholder:text-[#aab5b0] focus:ring-2"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setRoleFilter('all')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                roleFilter === 'all' ? 'bg-[#e8f3ee] text-[#22674e]' : 'text-[#73857e] hover:bg-[#f3f6f4]',
              )}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter('admin')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                roleFilter === 'admin' ? 'bg-[#e8f3ee] text-[#22674e]' : 'text-[#73857e] hover:bg-[#f3f6f4]',
              )}
            >
              Admins ({stats.admins})
            </button>
            <button
              onClick={() => setRoleFilter('user')}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                roleFilter === 'user' ? 'bg-[#e8f3ee] text-[#22674e]' : 'text-[#73857e] hover:bg-[#f3f6f4]',
              )}
            >
              Customers ({stats.customers})
            </button>
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
              <tr className="border-b border-[#edf1ee] text-[10px] uppercase tracking-[0.12em] text-[#9aa7a1]">
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
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#7d9089]">
                      <Loader2 size={24} className="animate-spin text-[#1f6b52]" />
                      <span>Loading user directory…</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8c9e97]">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isAdmin = u.role === 'admin';
                  const initials =
                    u.name
                      .split(' ')
                      .map((n) => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'U';

                  return (
                    <tr key={u.id} className="border-b border-[#f1f4f2] last:border-0 hover:bg-[#fafbfb]">
                      {/* User Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm',
                              isAdmin ? 'bg-[#e0f1e8] text-[#1b6b4e]' : 'bg-[#eaf1f7] text-[#34628a]',
                            )}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-[#21433a]">{u.name}</span>
                              {isAdmin && (
                                <span title="Administrator">
                                  <Shield size={12} className="text-[#1f6b52]" />
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-[#7d9089]">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                            isAdmin ? 'bg-[#eaf7f0] text-[#1b7a54]' : 'bg-[#eef5fc] text-[#2c6596]',
                          )}
                        >
                          {isAdmin ? <ShieldCheck size={12} /> : null}
                          {isAdmin ? 'Administrator' : 'Customer'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            u.emailVerified ? 'bg-[#eaf7f0] text-[#27815a]' : 'bg-[#fff5e5] text-[#b87823]',
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
                      <td className="py-3.5 text-xs font-medium text-[#49655d]">
                        {u.orderCount > 0 ? `${u.orderCount} orders` : '—'}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 text-[11px] text-[#80918a]">
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
                            className="rounded-lg p-1 text-[#81918a] hover:bg-[#f1f5f3] hover:text-[#21433a]"
                            aria-label="User actions"
                          >
                            <MoreHorizontal size={17} />
                          </button>

                          {actionMenuUser === u.id && (
                            <div className="absolute right-5 z-20 mt-1 w-48 rounded-xl border border-[#dfe7e2] bg-white p-1 shadow-lg">
                              <button
                                onClick={() => handleToggleRole(u)}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#2d5248] hover:bg-[#f4f7f5]"
                              >
                                <Shield size={14} className="text-[#1f6b52]" />
                                {isAdmin ? 'Demote to Customer' : 'Promote to Admin'}
                              </button>
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
        <div className="flex items-center justify-between border-t border-[#edf1ee] p-4 text-xs text-[#81918a]">
          <span>
            Showing {filteredUsers.length} of {users.length} accounts
          </span>
          <span className="text-[11px] text-[#9aa8a1]">Neon Auth & PostgreSQL Managed Identity</span>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchUsers();
            onNotify?.('New user created successfully.');
          }}
        />
      )}
    </div>
  );
}

function AddUserModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#143d36]/35 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-[#dfe7e2] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-[#edf2ef]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#eaf4ef] text-[#1f6b52]">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#173c35]">Add User Account</h3>
              <p className="text-xs text-[#80918a]">Create an administrator or customer profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#889a93] hover:bg-[#f2f6f4] hover:text-[#2d564a]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <CircleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Ayesha Khan"
              required
              className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ayesha@medixa.pk"
              required
              className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#294a41]">Temporary Password</label>
              <button
                type="button"
                onClick={generatePassword}
                className="text-[11px] font-semibold text-[#1f6b52] hover:underline"
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
              className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 font-mono text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Account Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={cn(
                  'flex flex-col items-center justify-center rounded-xl border p-3 text-center transition',
                  role === 'admin'
                    ? 'border-[#1f6b52] bg-[#eff7f3] text-[#174e3c]'
                    : 'border-[#dfe7e2] text-[#637b72] hover:bg-[#f7faf8]',
                )}
              >
                <ShieldCheck size={18} className="mb-1 text-[#1f6b52]" />
                <span className="text-xs font-bold">Administrator</span>
                <span className="text-[10px] text-[#778d85]">Full Studio Access</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('user')}
                className={cn(
                  'flex flex-col items-center justify-center rounded-xl border p-3 text-center transition',
                  role === 'user'
                    ? 'border-[#1f6b52] bg-[#eff7f3] text-[#174e3c]'
                    : 'border-[#dfe7e2] text-[#637b72] hover:bg-[#f7faf8]',
                )}
              >
                <UserCheck size={18} className="mb-1 text-[#2d6692]" />
                <span className="text-xs font-bold">Customer</span>
                <span className="text-[10px] text-[#778d85]">Storefront buyer</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#edf2ef]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={onClose}
              className="border-[#dfe7e2] text-[#556e66]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-[#1f6b52] text-white hover:bg-[#175440]"
            >
              {loading ? 'Creating…' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
