'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  BookOpenText,
  ChevronDown,
  CloudUpload,
  Grid2X2,
  ImageIcon,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth/client';
import { ChangePasswordModal } from '@/components/admin/change-password-modal';
import { UsersManager } from '@/components/admin/users-manager';
import { ProductsManager } from '@/components/admin/products-manager';
import { OrdersManager } from '@/components/admin/orders-manager';
import { BlogsManager } from '@/components/admin/blogs-manager';
import { MediaManager } from '@/components/admin/media-manager';
import { SettingsManager } from '@/components/admin/settings-manager';

export type Section = 'Overview' | 'Products' | 'Orders' | 'Blogs' | 'Media' | 'Users' | 'Settings';

const nav: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Products', icon: Package },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Blogs', icon: BookOpenText },
  { label: 'Media', icon: ImageIcon },
  { label: 'Users', icon: Users },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-[#143d36] text-lg font-bold text-white shadow-sm">
        M
      </div>
      <div>
        <p className="text-[17px] font-bold leading-none tracking-tight text-[#143d36]">medixa</p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a9b94]">admin studio</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  change?: string;
  icon: typeof Package;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
      <div className="flex items-start justify-between">
        <div className={cn('flex size-10 items-center justify-center rounded-xl', tone)}>
          <Icon size={19} />
        </div>
        {change && (
          <span className="flex items-center gap-1 rounded-full bg-[#eaf7f0] px-2 py-1 text-[11px] font-semibold text-[#27815a]">
            <TrendingUp size={12} />
            {change}
          </span>
        )}
      </div>
      <p className="mt-5 text-[12px] font-medium text-[#788782]">{label}</p>
      <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#173c35]">{value}</p>
    </div>
  );
}

function OverviewView({ setSection }: { setSection: (section: Section) => void }) {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    publishedBlogs: 0,
    mediaAssets: 0,
    totalCustomers: 0,
    totalOrders: 0,
    grossSales: 0,
  });
  const [recentOrders, setRecentOrders] = useState<
    Array<{ id: string; orderNumber: string; customerName: string; total: number; status: string; createdAt: string }>
  >([]);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/overview')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: { metrics?: typeof metrics; recentOrders?: typeof recentOrders }) => {
        if (!ignore && data.metrics) {
          setMetrics(data.metrics);
          setRecentOrders(data.recentOrders || []);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* 4 Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div onClick={() => setSection('Products')} className="cursor-pointer transition hover:scale-[1.01]">
          <StatCard
            label="Total products"
            value={metrics.totalProducts}
            change="+ Live"
            icon={Package}
            tone="bg-[#e3f3ed] text-[#287a5b]"
          />
        </div>
        <div onClick={() => setSection('Orders')} className="cursor-pointer transition hover:scale-[1.01]">
          <StatCard
            label="Customer Orders"
            value={metrics.totalOrders}
            change="Realtime"
            icon={ShoppingBag}
            tone="bg-[#fff1dd] text-[#bd7b26]"
          />
        </div>
        <div onClick={() => setSection('Blogs')} className="cursor-pointer transition hover:scale-[1.01]">
          <StatCard
            label="Published articles"
            value={metrics.publishedBlogs}
            change="CMS"
            icon={BookOpenText}
            tone="bg-[#e9e8ff] text-[#625fd0]"
          />
        </div>
        <div onClick={() => setSection('Users')} className="cursor-pointer transition hover:scale-[1.01]">
          <StatCard
            label="Registered accounts"
            value={metrics.totalCustomers}
            change="Neon Auth"
            icon={Users}
            tone="bg-[#fbe4eb] text-[#c05f7b]"
          />
        </div>
      </div>

      {/* Overview Analytics & Health */}
      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <section className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a29c]">Catalog & Inventory</p>
              <h2 className="mt-1 text-lg font-semibold text-[#173c35]">Store Performance</h2>
            </div>
            <Button
              onClick={() => setSection('Products')}
              variant="outline"
              size="sm"
              className="border-[#dfe8e3] text-[#54716a]"
            >
              Manage Catalog
            </Button>
          </div>
          <div className="mt-7 flex h-48 items-end gap-3 border-b border-l border-[#e8eeeb] px-3 pb-0 pt-6">
            {[45, 60, 52, 78, 65, 88, 72, 94, 82, 100, 90, 95].map((height, index) => (
              <div key={index} className="group flex h-full flex-1 flex-col justify-end">
                <div className="relative h-full">
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-[#d9eee6] transition-all group-hover:bg-[#1f6b52]"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="mt-2 text-center text-[10px] text-[#9aa7a1]">
                  {['01', '03', '06', '09', '12', '15', '18', '21', '24', '27', '29', '31'][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-6 text-xs text-[#788782]">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1f6b52]" />
              Storefront active sales
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#d9eee6]" />
              Stock fulfillment
            </span>
          </div>
        </section>

        {/* Quick Actions Card */}
        <section className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a29c]">Management</p>
            <h2 className="mt-1 text-lg font-semibold text-[#173c35]">Fast Shortcuts</h2>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => setSection('Products')}
              className="flex items-center justify-between rounded-xl bg-[#f6f9f7] p-3 text-xs font-semibold text-[#274f44] transition hover:bg-[#ebf4ef]"
            >
              <span>+ Add & Manage Products</span>
              <Package size={16} className="text-[#1f6b52]" />
            </button>
            <button
              onClick={() => setSection('Orders')}
              className="flex items-center justify-between rounded-xl bg-[#f6f9f7] p-3 text-xs font-semibold text-[#274f44] transition hover:bg-[#ebf4ef]"
            >
              <span>View & Dispatch Orders</span>
              <ShoppingBag size={16} className="text-[#1f6b52]" />
            </button>
            <button
              onClick={() => setSection('Blogs')}
              className="flex items-center justify-between rounded-xl bg-[#f6f9f7] p-3 text-xs font-semibold text-[#274f44] transition hover:bg-[#ebf4ef]"
            >
              <span>Write Storefront Article</span>
              <BookOpenText size={16} className="text-[#1f6b52]" />
            </button>
            <button
              onClick={() => setSection('Media')}
              className="flex items-center justify-between rounded-xl bg-[#f6f9f7] p-3 text-xs font-semibold text-[#274f44] transition hover:bg-[#ebf4ef]"
            >
              <span>Upload to S3 Cloud Media</span>
              <ImageIcon size={16} className="text-[#1f6b52]" />
            </button>
          </div>
        </section>
      </div>

      {/* Recent Orders table */}
      <section className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a29c]">Recent Sales</p>
            <h2 className="mt-1 text-lg font-semibold text-[#173c35]">Latest Customer Bookings</h2>
          </div>
          <Button onClick={() => setSection('Orders')} variant="ghost" size="sm" className="text-[#2d7d60]">
            View All Orders
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#8c9e97]">
            No customer orders placed yet. Orders made on the storefront checkout will stream here!
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#edf1ee] text-[10px] uppercase text-[#9aa7a1]">
                  <th className="pb-2.5 font-semibold">Order</th>
                  <th className="pb-2.5 font-semibold">Customer</th>
                  <th className="pb-2.5 font-semibold">Total</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f6f4]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-3 font-mono font-bold text-[#1f6b52]">{ord.orderNumber}</td>
                    <td className="py-3 font-medium text-[#22443a]">{ord.customerName}</td>
                    <td className="py-3 font-semibold text-[#1f473c]">PKR {ord.total.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-[#eaf7f0] px-2 py-0.5 text-[10px] font-bold text-[#1b7a54]">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-[11px] text-[#80918a]">
                      {new Date(ord.createdAt).toLocaleDateString('en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified?: boolean;
}

export default function MedixaDashboard({ initialUser }: { initialUser?: DashboardUser | null }) {
  const router = useRouter();
  const [active, setActive] = useState<Section>('Overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const userInitials = useMemo(() => {
    if (!initialUser?.name) return 'MA';
    return (
      initialUser.name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'MA'
    );
  }, [initialUser]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSignOut() {
    try {
      await authClient.signOut();
    } catch {
      // fallback
    }
    router.push('/auth/sign-in');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-[#23352f]">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-[250px] flex-col border-r border-[#e4ebe7] bg-white px-4 py-6 transition-transform lg:translate-x-0',
          mobileNav ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-2">
          <Logo />
          <button onClick={() => setMobileNav(false)} className="text-[#71847d] lg:hidden" aria-label="Close navigation">
            <X size={20} />
          </button>
        </div>

        <div className="mt-8">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa8a1]">Store Modules</p>
          <nav className="mt-3 flex flex-col gap-1">
            {nav.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActive(label);
                  setMobileNav(false);
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors',
                  active === label
                    ? 'bg-[#e8f3ee] font-semibold text-[#23694f]'
                    : 'text-[#71847d] hover:bg-[#f4f7f5] hover:text-[#345b50]',
                )}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9aa8a1]">Settings & Security</p>
          <nav className="mt-3 flex flex-col gap-1">
            <button
              onClick={() => {
                setActive('Settings');
                setMobileNav(false);
              }}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors',
                active === 'Settings'
                  ? 'bg-[#e8f3ee] font-semibold text-[#23694f]'
                  : 'text-[#71847d] hover:bg-[#f4f7f5] hover:text-[#345b50]',
              )}
            >
              <Settings2 size={17} />
              Store Settings
            </button>
            <button
              onClick={() => setChangePasswordOpen(true)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#71847d] hover:bg-[#f4f7f5]"
            >
              <KeyRound size={17} />
              Change Password
            </button>
          </nav>
        </div>

        <div className="mt-auto rounded-2xl bg-[#eff8f3] p-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white text-[#277b5a]">
            <ShieldCheck size={18} />
          </div>
          <p className="mt-3 text-xs font-semibold text-[#285b4b]">Neon Postgres Connected</p>
          <p className="mt-1 text-[11px] leading-4 text-[#759188]">Lakebase, Auth, Storage & Realtime active.</p>
        </div>
      </aside>

      {mobileNav && (
        <button
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-20 bg-[#173c35]/20 lg:hidden"
          aria-label="Close navigation overlay"
        />
      )}

      {/* Main Content Area */}
      <div className="lg:pl-[250px]">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-[#e4ebe7] bg-white/90 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNav(true)} className="text-[#61776e] lg:hidden" aria-label="Open navigation">
              <Menu size={22} />
            </button>
            <div className="hidden items-center gap-2 text-xs text-[#9aa7a1] md:flex">
              <span>Workspace /</span>
              <span className="font-semibold text-[#23694f]">{active}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#e4ebe7] bg-[#fafcfb] px-3 py-1.5 text-xs font-medium text-[#46655c] hover:bg-[#edf4f0]"
            >
              View Medixa Storefront ↗
            </a>

            {/* User Persona Component & Dropdown */}
            <div className="relative border-l border-[#e4ebe7] pl-2 sm:pl-4">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#f1f6f3]"
                aria-expanded={userDropdownOpen}
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-[#dceee6] text-xs font-bold text-[#2e765b] shadow-sm">
                  {userInitials}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-[#34574e] leading-snug">
                    {initialUser?.name || 'Medixa Admin'}
                  </p>
                  <p className="text-[10px] text-[#93a19b] leading-tight">
                    {initialUser?.role?.toLowerCase() === 'admin' ? 'Administrator' : 'Team Member'}
                  </p>
                </div>
                <ChevronDown size={15} className="text-[#81918a]" />
              </button>

              {/* Persona Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-[#dfe7e2] bg-white p-2 shadow-2xl">
                    <div className="border-b border-[#edf2ef] px-3 py-2.5">
                      <p className="text-xs font-bold text-[#1f473c]">{initialUser?.name || 'Medixa Admin'}</p>
                      <p className="text-[11px] text-[#7d9089] truncate">{initialUser?.email || 'admin@medixa.pk'}</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#eaf7f0] px-2 py-0.5 text-[10px] font-semibold text-[#27815a]">
                        <ShieldCheck size={11} />
                        Active Administrator
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setChangePasswordOpen(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#2d5248] hover:bg-[#f3f7f5]"
                      >
                        <KeyRound size={15} className="text-[#1f6b52]" />
                        <span>Change Password</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setActive('Users');
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#2d5248] hover:bg-[#f3f7f5]"
                      >
                        <Users size={15} className="text-[#1f6b52]" />
                        <span>Manage Users & Team</span>
                      </button>
                    </div>

                    <div className="border-t border-[#edf2ef] pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="mx-auto max-w-[1480px] p-5 sm:p-8">
          <div className="mb-7">
            <div className="flex items-center gap-2 text-xs font-medium text-[#8a9b94]">
              <Sparkles size={14} className="text-[#c49443]" />
              Welcome back, {initialUser?.name || 'Administrator'}
            </div>
            <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#173c35]">
              {active === 'Overview'
                ? 'Store Overview'
                : active === 'Products'
                  ? 'Product Catalog'
                  : active === 'Orders'
                    ? 'Customer Orders'
                    : active === 'Blogs'
                      ? 'Blog Articles'
                      : active === 'Media'
                        ? 'Cloud Media Assets'
                        : active === 'Users'
                          ? 'User Directory & Access'
                          : 'Store Settings'}
            </h1>
            <p className="mt-1 text-sm text-[#81918a]">
              {active === 'Overview'
                ? 'Realtime analytics, revenue, orders, and database synchronization.'
                : active === 'Products'
                  ? 'Full CRUD on scrubs, variants, pricing, inventory and storefront catalog.'
                  : active === 'Orders'
                    ? 'Live order management, fulfillment, and cash on delivery tracking.'
                    : active === 'Blogs'
                      ? 'Editorial journal CMS directly feeding the storefront featured posts.'
                      : active === 'Media'
                        ? 'S3-compatible object storage for high-resolution product photography.'
                        : active === 'Users'
                          ? 'Role-based access control, admin privileges, and user accounts.'
                          : 'Configure delivery rates, logistics, store currency, and payment methods.'}
            </p>
          </div>

          {active === 'Overview' ? (
            <OverviewView setSection={setActive} />
          ) : active === 'Products' ? (
            <ProductsManager onNotify={showToast} />
          ) : active === 'Orders' ? (
            <OrdersManager onNotify={showToast} />
          ) : active === 'Blogs' ? (
            <BlogsManager onNotify={showToast} />
          ) : active === 'Media' ? (
            <MediaManager onNotify={showToast} />
          ) : active === 'Users' ? (
            <UsersManager onNotify={showToast} />
          ) : (
            <SettingsManager onNotify={showToast} />
          )}
        </main>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#173c35] px-4 py-3 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CloudUpload size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}
