'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpenText,
  Briefcase,
  ChevronDown,
  CloudUpload,
  ImageIcon,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
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
import { ChangePasswordPage } from '@/components/admin/change-password-modal';
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
      <div className="flex size-9 items-center justify-center rounded-xl bg-[#131b2e] text-lg font-bold text-white shadow-sm">
        M
      </div>
      <div>
        <p className="text-[17px] font-bold leading-none tracking-tight text-[#131b2e]">medixa</p>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8995a1]">admin studio</p>
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
    <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
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
      <p className="mt-5 text-[12px] font-medium text-[#77828f]">{label}</p>
      <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">{value}</p>
    </div>
  );
}

function OverviewView({
  setSection,
  canManageUsers,
}: {
  setSection: (section: Section) => void;
  canManageUsers: boolean;
}) {
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
            tone="bg-[#e6e9f2] text-[#1c3f78]"
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
        <div
          onClick={canManageUsers ? () => setSection('Users') : undefined}
          className={canManageUsers ? 'cursor-pointer transition hover:scale-[1.01]' : ''}
        >
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
        <section className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#939fa9]">Catalog & Inventory</p>
              <h2 className="mt-1 text-lg font-semibold text-[#131b2e]">Store Performance</h2>
            </div>
            <Button
              onClick={() => setSection('Products')}
              variant="outline"
              size="sm"
              className="border-[#dee7ee] text-[#546372]"
            >
              Manage Catalog
            </Button>
          </div>
          <div className="mt-7 flex h-48 items-end gap-3 border-b border-l border-[#e8eef3] px-3 pb-0 pt-6">
            {[45, 60, 52, 78, 65, 88, 72, 94, 82, 100, 90, 95].map((height, index) => (
              <div key={index} className="group flex h-full flex-1 flex-col justify-end">
                <div className="relative h-full">
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-[#dde2ee] transition-all group-hover:bg-[#052263]"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="mt-2 text-center text-[10px] text-[#99a5af]">
                  {['01', '03', '06', '09', '12', '15', '18', '21', '24', '27', '29', '31'][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-6 text-xs text-[#77828f]">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#052263]" />
              Storefront active sales
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#dde2ee]" />
              Stock fulfillment
            </span>
          </div>
        </section>

        {/* Quick Actions Card */}
        <section className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#939fa9]">Management</p>
            <h2 className="mt-1 text-lg font-semibold text-[#131b2e]">Fast Shortcuts</h2>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => setSection('Products')}
              className="flex items-center justify-between rounded-xl bg-[#f6f9fb] p-3 text-xs font-semibold text-[#26334a] transition hover:bg-[#eceef7]"
            >
              <span>+ Add & Manage Products</span>
              <Package size={16} className="text-[#052263]" />
            </button>
            <button
              onClick={() => setSection('Orders')}
              className="flex items-center justify-between rounded-xl bg-[#f6f9fb] p-3 text-xs font-semibold text-[#26334a] transition hover:bg-[#eceef7]"
            >
              <span>View & Dispatch Orders</span>
              <ShoppingBag size={16} className="text-[#052263]" />
            </button>
            <button
              onClick={() => setSection('Blogs')}
              className="flex items-center justify-between rounded-xl bg-[#f6f9fb] p-3 text-xs font-semibold text-[#26334a] transition hover:bg-[#eceef7]"
            >
              <span>Write Storefront Article</span>
              <BookOpenText size={16} className="text-[#052263]" />
            </button>
            <button
              onClick={() => setSection('Media')}
              className="flex items-center justify-between rounded-xl bg-[#f6f9fb] p-3 text-xs font-semibold text-[#26334a] transition hover:bg-[#eceef7]"
            >
              <span>Upload to S3 Cloud Media</span>
              <ImageIcon size={16} className="text-[#052263]" />
            </button>
          </div>
        </section>
      </div>

      {/* Recent Orders table */}
      <section className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#939fa9]">Recent Sales</p>
            <h2 className="mt-1 text-lg font-semibold text-[#131b2e]">Latest Customer Bookings</h2>
          </div>
          <Button onClick={() => setSection('Orders')} variant="ghost" size="sm" className="text-[#041d52]">
            View All Orders
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-xs text-[#8b98a4]">
            No customer orders placed yet. Orders made on the storefront checkout will stream here!
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#edf1f5] text-[10px] uppercase text-[#99a5af]">
                  <th className="pb-2.5 font-semibold">Order</th>
                  <th className="pb-2.5 font-semibold">Customer</th>
                  <th className="pb-2.5 font-semibold">Total</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f5f8]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-3 font-mono font-bold text-[#052263]">{ord.orderNumber}</td>
                    <td className="py-3 font-medium text-[#212b3d]">{ord.customerName}</td>
                    <td className="py-3 font-semibold text-[#1e283a]">PKR {ord.total.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-[#eaf7f0] px-2 py-0.5 text-[10px] font-bold text-[#1b7a54]">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 text-[11px] text-[#7f8b97]">
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
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const normalizedRole = (initialUser?.role || '').toLowerCase();
  const isAdmin = normalizedRole === 'admin' || normalizedRole === 'administrator';
  const isEditor = ['editor', 'shop_manager', 'shop-manager', 'manager'].includes(normalizedRole);
  const canDelete = isAdmin;
  const roleLabel = isAdmin ? 'Administrator' : isEditor ? 'Shop Manager' : 'Team Member';

  const visibleNav = useMemo(
    () => (isAdmin ? nav : nav.filter((item) => item.label !== 'Users')),
    [isAdmin],
  );

  const currentSection: Section =
    !isAdmin && (active === 'Users' || active === 'Settings') ? 'Overview' : active;

  const toggleSidebar = () => {
    setMobileNav((prev) => !prev);
    setDesktopSidebarOpen((prev) => !prev);
  };

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
    <div className="min-h-screen bg-[#f6f8fa] text-[#1f2836]">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-[250px] flex-col border-r border-[#e4eaf0] bg-white px-4 py-6 transition-transform duration-200',
          mobileNav ? 'translate-x-0' : '-translate-x-full',
          desktopSidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-2">
          <Logo />
          <button onClick={() => setMobileNav(false)} className="text-[#707d8b] lg:hidden" aria-label="Close navigation">
            <X size={20} />
          </button>
        </div>

        <div className="mt-8">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#99a5af]">Store Modules</p>
          <nav className="mt-3 flex flex-col gap-1">
            {visibleNav.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => {
                  setActive(label);
                  setChangePasswordOpen(false);
                  setMobileNav(false);
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors',
                  active === label
                    ? 'bg-[#e9ecf4] font-semibold text-[#041d52]'
                    : 'text-[#707d8b] hover:bg-[#f4f6f9] hover:text-[#33415a]',
                )}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#99a5af]">Settings & Security</p>
          <nav className="mt-3 flex flex-col gap-1">
            {isAdmin ? (
              <button
                onClick={() => {
                  setActive('Settings');
                  setChangePasswordOpen(false);
                  setMobileNav(false);
                }}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors',
                  active === 'Settings'
                    ? 'bg-[#e9ecf4] font-semibold text-[#041d52]'
                    : 'text-[#707d8b] hover:bg-[#f4f6f9] hover:text-[#33415a]',
                )}
              >
                <Settings2 size={17} />
                Store Settings
              </button>
            ) : null}
            <button
              onClick={() => {
                setChangePasswordOpen(true);
                setMobileNav(false);
              }}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-colors',
                changePasswordOpen
                  ? 'bg-[#e9ecf4] font-semibold text-[#041d52]'
                  : 'text-[#707d8b] hover:bg-[#f4f6f9] hover:text-[#33415a]',
              )}
            >
              <KeyRound size={17} />
              Change Password
            </button>
          </nav>
        </div>

        <div className="mt-auto rounded-2xl bg-[#eef1f8] p-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-white text-[#041d52]">
            <ShieldCheck size={18} />
          </div>
          <p className="mt-3 text-xs font-semibold text-[#041d52]">Neon Postgres Connected</p>
          <p className="mt-1 text-[11px] leading-4 text-[#748391]">Lakebase, Auth, Storage & Realtime active.</p>
        </div>
      </aside>

      {mobileNav && (
        <button
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-20 bg-[#131b2e]/20 lg:hidden"
          aria-label="Close navigation overlay"
        />
      )}

      {/* Main Content Area */}
      <div className={cn('transition-[padding] duration-200', desktopSidebarOpen ? 'lg:pl-[250px]' : 'lg:pl-0')}>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-[#e4eaf0] bg-white/90 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="flex size-9 items-center justify-center rounded-xl border border-[#e4eaf0] bg-[#fafcfd] text-[#61707e] transition hover:bg-[#f0f4f8] hover:text-[#131b2e]"
              aria-label="Toggle navigation"
              title="Toggle sidebar"
            >
              <Menu size={19} />
            </button>
            <div className="hidden items-center gap-2 text-xs text-[#99a5af] md:flex">
              <span>Workspace /</span>
              <span className="font-semibold text-[#041d52]">{currentSection}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#e4eaf0] bg-[#fafcfd] px-3 py-1.5 text-xs font-medium text-[#46566a] hover:bg-[#eef1f7]"
            >
              View Medixa Storefront ↗
            </a>

            {/* User Persona Component & Dropdown */}
            <div className="relative border-l border-[#e4eaf0] pl-2 sm:pl-4">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#f1f5f8]"
                aria-expanded={userDropdownOpen}
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-[#dde3ef] text-xs font-bold text-[#1c3f78] shadow-sm">
                  {userInitials}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-[#334158] leading-snug">
                    {initialUser?.name || 'Medixa Admin'}
                  </p>
                  <p className="text-[10px] text-[#929ea9] leading-tight">
                    {roleLabel}
                  </p>
                </div>
                <ChevronDown size={15} className="text-[#7e8a96]" />
              </button>

              {/* Persona Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-64 rounded-2xl border border-[#dde5ec] bg-white p-2 shadow-2xl">
                    <div className="border-b border-[#edf1f5] px-3 py-2.5">
                      <p className="text-xs font-bold text-[#1e283a]">{initialUser?.name || 'Medixa Admin'}</p>
                      <p className="text-[11px] text-[#7c8996] truncate">{initialUser?.email || 'admin@medixa.pk'}</p>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#eaf7f0] px-2 py-0.5 text-[10px] font-semibold text-[#27815a]">
                        {isAdmin ? <ShieldCheck size={11} /> : <Briefcase size={11} />}
                        Active {roleLabel}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setChangePasswordOpen(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#2c3851] hover:bg-[#f3f6f9]"
                      >
                        <KeyRound size={15} className="text-[#052263]" />
                        <span>Change Password</span>
                      </button>

                      {isAdmin ? (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setChangePasswordOpen(false);
                            setActive('Users');
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-[#2c3851] hover:bg-[#f3f6f9]"
                        >
                          <Users size={15} className="text-[#052263]" />
                          <span>Manage Users & Team</span>
                        </button>
                      ) : null}
                    </div>

                    <div className="border-t border-[#edf1f5] pt-1">
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
          {changePasswordOpen ? (
            <ChangePasswordPage
              onClose={() => setChangePasswordOpen(false)}
              onToggleSidebar={toggleSidebar}
              onSuccess={showToast}
            />
          ) : (
            <>
              <div className="mb-7">
                <div className="flex items-center gap-2 text-xs font-medium text-[#8995a1]">
                  <Sparkles size={14} className="text-[#c49443]" />
                  Welcome back, {initialUser?.name || 'Administrator'}
                </div>
                <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#131b2e]">
                  {currentSection === 'Overview'
                    ? 'Store Overview'
                    : currentSection === 'Products'
                      ? 'Product Catalog'
                      : currentSection === 'Orders'
                        ? 'Customer Orders'
                        : currentSection === 'Blogs'
                          ? 'Blog Articles'
                          : currentSection === 'Media'
                            ? 'Cloud Media Assets'
                            : currentSection === 'Users'
                              ? 'User Directory & Access'
                              : 'Store Settings'}
                </h1>
                <p className="mt-1 text-sm text-[#7e8a96]">
                  {currentSection === 'Overview'
                    ? 'Realtime analytics, revenue, orders, and database synchronization.'
                    : currentSection === 'Products'
                      ? 'Full CRUD on scrubs, variants, pricing, inventory and storefront catalog.'
                      : currentSection === 'Orders'
                        ? 'Live order management, fulfillment, and cash on delivery tracking.'
                        : currentSection === 'Blogs'
                          ? 'Editorial journal CMS directly feeding the storefront featured posts.'
                          : currentSection === 'Media'
                            ? 'S3-compatible object storage for high-resolution product photography.'
                            : currentSection === 'Users'
                              ? 'Role-based access control, admin privileges, and user accounts.'
                              : 'Configure delivery rates, logistics, store currency, and payment methods.'}
                </p>
              </div>

              {currentSection === 'Overview' ? (
                <OverviewView setSection={setActive} canManageUsers={isAdmin} />
              ) : currentSection === 'Products' ? (
                <ProductsManager
                  onNotify={showToast}
                  canDelete={canDelete}
                  onToggleSidebar={toggleSidebar}
                />
              ) : currentSection === 'Orders' ? (
                <OrdersManager onNotify={showToast} onToggleSidebar={toggleSidebar} />
              ) : currentSection === 'Blogs' ? (
                <BlogsManager
                  onNotify={showToast}
                  canDelete={canDelete}
                  onToggleSidebar={toggleSidebar}
                />
              ) : currentSection === 'Media' ? (
                <MediaManager
                  onNotify={showToast}
                  canDelete={canDelete}
                  onToggleSidebar={toggleSidebar}
                />
              ) : currentSection === 'Users' ? (
                <UsersManager onNotify={showToast} onToggleSidebar={toggleSidebar} />
              ) : (
                <SettingsManager onNotify={showToast} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-[#131b2e] px-4 py-3 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-bottom-2">
          <CloudUpload size={15} />
          {toast}
        </div>
      )}
    </div>
  );
}
