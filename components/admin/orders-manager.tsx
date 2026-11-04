'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Banknote,
  CircleAlert,
  Clock,
  Eye,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AdminFullPage } from '@/components/admin/admin-full-page';

export interface AdminOrderItem {
  id: string;
  title: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  total: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: 'COD' | 'JAZZCASH' | 'EASYPAISA';
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';
  total: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  itemCount: number;
  items: AdminOrderItem[];
  shippingAddress: Record<string, string> | null;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
}

export function OrdersManager({
  onNotify,
  onToggleSidebar,
}: {
  onNotify?: (msg: string) => void;
  onToggleSidebar?: () => void;
}) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/orders')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          setOrders(data.orders || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error fetching orders');
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchQuery =
        o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        o.customerName.toLowerCase().includes(query.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(query.toLowerCase()) ||
        o.customerPhone.includes(query);

      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [orders, query, statusFilter]);

  const metrics = useMemo(() => {
    const totalCount = orders.length;
    const pendingCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
    const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + o.total, 0);

    return { totalCount, pendingCount, deliveredCount, totalRevenue };
  }, [orders]);

  async function handleUpdateStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      onNotify?.(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as AdminOrder['status'] } : null));
      }
    } catch {
      alert('Error updating order status');
    }
  }

  if (selectedOrder) {
    return (
      <OrderDetailPage
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={(status) => handleUpdateStatus(selectedOrder.id, status)}
        onToggleSidebar={onToggleSidebar}
      />
    );
  }

  if (showCreateForm) {
    return (
      <ManualOrderPage
        onClose={() => setShowCreateForm(false)}
        onToggleSidebar={onToggleSidebar}
        onSuccess={() => {
          fetchOrders();
          onNotify?.('Manual order created successfully.');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9ecf4] text-[#052263]">
              <ShoppingBag size={19} />
            </div>
            <span className="rounded-full bg-[#f4f6f9] px-2.5 py-0.5 text-[11px] font-semibold text-[#546473]">
              Total
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#77828f]">Total Orders</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">{metrics.totalCount}</p>
        </div>

        <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff7ea] text-[#b87823]">
              <Clock size={19} />
            </div>
            <span className="rounded-full bg-[#fff4df] px-2.5 py-0.5 text-[11px] font-semibold text-[#b87823]">
              Active
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#77828f]">Awaiting Fulfillment</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">{metrics.pendingCount}</p>
        </div>

        <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#eaf7f0] text-[#1b7a54]">
              <Truck size={19} />
            </div>
            <span className="rounded-full bg-[#eaf7f0] px-2.5 py-0.5 text-[11px] font-semibold text-[#1b7a54]">
              Fulfilled
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#77828f]">Delivered Orders</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">{metrics.deliveredCount}</p>
        </div>

        <div className="rounded-2xl border border-[#e7ecf0] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9e8ff] text-[#625fd0]">
              <Banknote size={19} />
            </div>
            <span className="rounded-full bg-[#f0effe] px-2.5 py-0.5 text-[11px] font-semibold text-[#625fd0]">
              Revenue
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#77828f]">Gross Sales</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#131b2e]">
            PKR {metrics.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-[#e7ecf0] bg-white shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#edf1f5] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#939fa9]">
              Storefront / Sales
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#131b2e]">Customer Orders</h2>
            <p className="mt-1 text-xs text-[#7e8a96]">
              Manage order confirmations, shipping dispatch, tracking numbers and cash collection.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={loading}
              className="border-[#dee7ee] text-[#556572]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#052263] text-white hover:bg-[#031849] shadow-sm"
            >
              <Plus size={16} />
              <span>Create manual order</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-[#edf1f5] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-[#99a5af]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order number, customer name, email, or phone…"
              className="h-9 w-full rounded-lg border border-[#dee7ee] bg-[#fbfcfd] pl-9 pr-3 text-xs outline-none ring-[#bcc7de] placeholder:text-[#a9b4be] focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                  statusFilter === st ? 'bg-[#e9ecf4] text-[#041d52]' : 'text-[#72808d] hover:bg-[#f3f5f8]',
                )}
              >
                {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <CircleAlert size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr className="border-b border-[#edf1f5] text-[10px] uppercase tracking-[0.12em] text-[#99a5af]">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="py-3 font-semibold">Customer</th>
                <th className="py-3 font-semibold">Payment</th>
                <th className="py-3 font-semibold">Total</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Date</th>
                <th className="pr-5 py-3 text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#7c8996]">
                      <Loader2 size={24} className="animate-spin text-[#052263]" />
                      <span>Loading orders…</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8b98a4]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-b border-[#f1f4f7] last:border-0 hover:bg-[#fafbfb]">
                    {/* Order # */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#052263]">{o.orderNumber}</span>
                        <span className="text-[10px] text-[#7e8a96]">({o.itemCount} items)</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#202a3c]">{o.customerName}</span>
                        <span className="text-[11px] text-[#7c8996]">{o.customerEmail}</span>
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#263145]">{o.paymentMethod}</span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.2 text-[9px] font-bold',
                            o.paymentStatus === 'PAID'
                              ? 'bg-[#eaf7f0] text-[#1b7a54]'
                              : 'bg-[#fff5e5] text-[#b87823]',
                          )}
                        >
                          {o.paymentStatus}
                        </span>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 text-xs font-bold text-[#1a2434]">
                      PKR {o.total.toLocaleString()}
                    </td>

                    {/* Status with quick selector */}
                    <td className="py-3.5">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className={cn(
                          'rounded-full px-2.5 py-1 text-[10px] font-semibold border-0 outline-none cursor-pointer',
                          o.status === 'DELIVERED'
                            ? 'bg-[#eaf7f0] text-[#1b7a54]'
                            : o.status === 'SHIPPED'
                              ? 'bg-[#e9e8ff] text-[#625fd0]'
                              : o.status === 'CANCELLED'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-[#fff4df] text-[#b67927]',
                        )}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 text-[11px] text-[#7f8b97]">
                      {new Date(o.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="pr-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="rounded-lg p-1.5 text-[#556371] hover:bg-[#eef1f7] hover:text-[#131b2e]"
                        aria-label="View order details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#edf1f5] p-4 text-xs text-[#7e8a96]">
          <span>
            Showing {filtered.length} of {orders.length} orders
          </span>
          <span className="text-[11px] text-[#99a5af]">Realtime order stream ready</span>
        </div>
      </div>
    </div>
  );
}

function OrderDetailPage({
  order,
  onClose,
  onToggleSidebar,
  onStatusChange,
}: {
  order: AdminOrder;
  onClose: () => void;
  onToggleSidebar?: () => void;
  onStatusChange: (status: string) => void;
}) {
  return (
    <AdminFullPage
      title={order.orderNumber}
      subtitle={`Placed on ${new Date(order.createdAt).toLocaleString('en-US')}`}
      icon={<ShoppingBag size={20} />}
      onClose={onClose}
      onToggleSidebar={onToggleSidebar}
      backLabel="Back to orders"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#eaf7f0] px-2.5 py-0.5 text-[10px] font-bold text-[#1b7a54]">
            {order.status}
          </span>
          <span className="rounded-full bg-[#f4f6f9] px-2.5 py-0.5 text-[10px] font-semibold text-[#546473]">
            {order.paymentMethod} · {order.paymentStatus}
          </span>
        </div>

        {/* Customer & Shipping info */}
        <div className="rounded-2xl border border-[#dde5ec] bg-white p-5 text-xs shadow-[0_4px_18px_rgba(19,27,46,0.04)] space-y-2">
          <p className="font-semibold text-[#1d2739]">Customer Details</p>
          <div className="grid gap-2 text-[#566472] sm:grid-cols-2">
            <div>
              <span className="text-[#8d99a5]">Name:</span> {order.customerName}
            </div>
            <div>
              <span className="text-[#8d99a5]">Phone:</span> {order.customerPhone || '—'}
            </div>
            <div className="sm:col-span-2">
              <span className="text-[#8d99a5]">Email:</span> {order.customerEmail}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-2xl border border-[#dde5ec] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <p className="text-xs font-semibold text-[#1d2739]">Purchased Items ({order.items.length})</p>
          <div className="mt-2 divide-y divide-[#edf1f5] border-y border-[#edf1f5]">
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between py-2.5 text-xs">
                <div>
                  <p className="font-semibold text-[#263145]">{it.title}</p>
                  <p className="text-[10px] text-[#85929f]">
                    Size: {it.size} · Color: {it.color} · Qty: {it.quantity}
                  </p>
                </div>
                <span className="font-mono font-semibold text-[#1e283a]">PKR {it.total.toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="mt-4 space-y-1.5 text-xs text-[#556371]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>PKR {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>PKR {order.shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-[#edf1f5] pt-2 text-sm font-bold text-[#131b2e]">
              <span>Total Amount</span>
              <span>PKR {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Status Transition Buttons */}
        <div className="rounded-2xl border border-[#dde5ec] bg-white p-5 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#546e66]">Update Status:</span>
            {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => onStatusChange(st)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition',
                  order.status === st
                    ? 'bg-[#052263] text-white'
                    : 'bg-[#f0f4f2] text-[#41505f] hover:bg-[#e4ebf1]',
                )}
              >
                {st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminFullPage>
  );
}

function ManualOrderPage({
  onClose,
  onToggleSidebar,
  onSuccess,
}: {
  onClose: () => void;
  onToggleSidebar?: () => void;
  onSuccess: () => void;
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productTitle, setProductTitle] = useState('Regal Scrub Suit');
  const [size, setSize] = useState('M');
  const [price, setPrice] = useState('5490');
  const [quantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'JAZZCASH' | 'EASYPAISA'>('COD');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          paymentMethod,
          notes,
          items: [
            {
              title: productTitle,
              price: Number(price),
              quantity: Number(quantity),
              size,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create order');
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError('Network error creating order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFullPage
      title="Create Manual Order"
      subtitle="Direct phone or WhatsApp customer booking"
      icon={<Package size={20} />}
      onClose={onClose}
      onToggleSidebar={onToggleSidebar}
      backLabel="Back to orders"
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl space-y-3 rounded-2xl border border-[#dde5ec] bg-white p-5 text-xs shadow-[0_4px_18px_rgba(19,27,46,0.04)] sm:p-6"
      >
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-rose-800">
              <CircleAlert size={15} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#263145] mb-1">Customer Full Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Dr. Tariq Mahmood"
              required
              className="h-9 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 outline-none focus:ring-2 focus:ring-[#052263]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-[#263145] mb-1">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@email.com"
                required
                className="h-9 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 outline-none focus:ring-2 focus:ring-[#052263]/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#263145] mb-1">Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="03001234567"
                required
                className="h-9 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 outline-none focus:ring-2 focus:ring-[#052263]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block font-semibold text-[#263145] mb-1">Product</label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                required
                className="h-9 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 outline-none focus:ring-2 focus:ring-[#052263]/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#263145] mb-1">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="h-9 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-2 outline-none"
              >
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
                <option value="XL">XL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-[#263145] mb-1">Price (PKR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="h-9 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#263145] mb-1">Payment</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'JAZZCASH' | 'EASYPAISA')}
                className="h-9 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-2 outline-none"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="JAZZCASH">JazzCash</option>
                <option value="EASYPAISA">EasyPaisa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#263145] mb-1">Notes / Address</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions or delivery address..."
              className="w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] p-2.5 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#edf1f5]">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="bg-[#052263] text-white hover:bg-[#031849]">
              {loading ? 'Creating…' : 'Create Order'}
            </Button>
          </div>
        </form>
    </AdminFullPage>
  );
}

