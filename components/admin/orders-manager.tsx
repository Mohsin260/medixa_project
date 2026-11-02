'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock,
  Eye,
  Filter,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

export function OrdersManager({ onNotify }: { onNotify?: (msg: string) => void }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#eaf4ef] text-[#1f6b52]">
              <ShoppingBag size={19} />
            </div>
            <span className="rounded-full bg-[#f4f7f5] px-2.5 py-0.5 text-[11px] font-semibold text-[#547368]">
              Total
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#788782]">Total Orders</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#173c35]">{metrics.totalCount}</p>
        </div>

        <div className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#fff7ea] text-[#b87823]">
              <Clock size={19} />
            </div>
            <span className="rounded-full bg-[#fff4df] px-2.5 py-0.5 text-[11px] font-semibold text-[#b87823]">
              Active
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#788782]">Awaiting Fulfillment</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#173c35]">{metrics.pendingCount}</p>
        </div>

        <div className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#eaf7f0] text-[#1b7a54]">
              <Truck size={19} />
            </div>
            <span className="rounded-full bg-[#eaf7f0] px-2.5 py-0.5 text-[11px] font-semibold text-[#1b7a54]">
              Fulfilled
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#788782]">Delivered Orders</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#173c35]">{metrics.deliveredCount}</p>
        </div>

        <div className="rounded-2xl border border-[#e6ebe8] bg-white p-5 shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9e8ff] text-[#625fd0]">
              <Banknote size={19} />
            </div>
            <span className="rounded-full bg-[#f0effe] px-2.5 py-0.5 text-[11px] font-semibold text-[#625fd0]">
              Revenue
            </span>
          </div>
          <p className="mt-4 text-xs font-medium text-[#788782]">Gross Sales</p>
          <p className="mt-1 text-[26px] font-semibold tracking-tight text-[#173c35]">
            PKR {metrics.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-[#e6ebe8] bg-white shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#edf1ee] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a29c]">
              Storefront / Sales
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#173c35]">Customer Orders</h2>
            <p className="mt-1 text-xs text-[#81918a]">
              Manage order confirmations, shipping dispatch, tracking numbers and cash collection.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={loading}
              className="border-[#dfe8e3] text-[#557067]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#1f6b52] text-white hover:bg-[#185540] shadow-sm"
            >
              <Plus size={16} />
              <span>Create manual order</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-[#edf1ee] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-[#9aa7a1]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order number, customer name, email, or phone…"
              className="h-9 w-full rounded-lg border border-[#dfe8e3] bg-[#fbfcfb] pl-9 pr-3 text-xs outline-none ring-[#b9d9ca] placeholder:text-[#aab5b0] focus:ring-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                  statusFilter === st ? 'bg-[#e8f3ee] text-[#22674e]' : 'text-[#73857e] hover:bg-[#f3f6f4]',
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
              <tr className="border-b border-[#edf1ee] text-[10px] uppercase tracking-[0.12em] text-[#9aa7a1]">
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
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#7d9089]">
                      <Loader2 size={24} className="animate-spin text-[#1f6b52]" />
                      <span>Loading orders…</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#8c9e97]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="border-b border-[#f1f4f2] last:border-0 hover:bg-[#fafbfb]">
                    {/* Order # */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#1f6b52]">{o.orderNumber}</span>
                        <span className="text-[10px] text-[#81918a]">({o.itemCount} items)</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#21433a]">{o.customerName}</span>
                        <span className="text-[11px] text-[#7d9089]">{o.customerEmail}</span>
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#274a40]">{o.paymentMethod}</span>
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
                    <td className="py-3.5 text-xs font-bold text-[#1b4339]">
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
                    <td className="py-3.5 text-[11px] text-[#80918a]">
                      {new Date(o.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="pr-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="rounded-lg p-1.5 text-[#556e66] hover:bg-[#edf4f0] hover:text-[#173c35]"
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

        <div className="flex items-center justify-between border-t border-[#edf1ee] p-4 text-xs text-[#81918a]">
          <span>
            Showing {filtered.length} of {orders.length} orders
          </span>
          <span className="text-[11px] text-[#9aa8a1]">Realtime order stream ready</span>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(status) => handleUpdateStatus(selectedOrder.id, status)}
        />
      )}

      {/* Manual Order Creation Modal */}
      {showCreateModal && (
        <ManualOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchOrders();
            onNotify?.('Manual order created successfully.');
          }}
        />
      )}
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: AdminOrder;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#143d36]/35 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#dfe7e2] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-[#edf2ef]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#1f6b52]">{order.orderNumber}</span>
              <span className="rounded-full bg-[#eaf7f0] px-2 py-0.5 text-[10px] font-bold text-[#1b7a54]">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-[#80918a]">
              Placed on {new Date(order.createdAt).toLocaleString('en-US')}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#889a93] hover:bg-[#f2f6f4]">
            <X size={18} />
          </button>
        </div>

        {/* Customer & Shipping info */}
        <div className="mt-4 rounded-xl border border-[#e8eeeb] bg-[#fbfdfc] p-4 text-xs space-y-2">
          <p className="font-semibold text-[#1e423a]">Customer Details</p>
          <div className="grid grid-cols-2 gap-2 text-[#566e66]">
            <div>
              <span className="text-[#8e9f99]">Name:</span> {order.customerName}
            </div>
            <div>
              <span className="text-[#8e9f99]">Phone:</span> {order.customerPhone || '—'}
            </div>
            <div className="col-span-2">
              <span className="text-[#8e9f99]">Email:</span> {order.customerEmail}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-[#1e423a]">Purchased Items ({order.items.length})</p>
          <div className="divide-y divide-[#edf2ef] border-y border-[#edf2ef]">
            {order.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between py-2.5 text-xs">
                <div>
                  <p className="font-semibold text-[#274840]">{it.title}</p>
                  <p className="text-[10px] text-[#869791]">
                    Size: {it.size} · Color: {it.color} · Qty: {it.quantity}
                  </p>
                </div>
                <span className="font-mono font-semibold text-[#1f473c]">PKR {it.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="mt-4 space-y-1.5 text-xs text-[#556e66]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>PKR {order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>PKR {order.shippingFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-[#edf2ef] pt-2 text-sm font-bold text-[#173c35]">
            <span>Total Amount</span>
            <span>PKR {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Status Transition Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[#edf2ef] pt-4">
          <span className="text-xs font-semibold text-[#546e66]">Update Status:</span>
          {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => onStatusChange(st)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-medium transition',
                order.status === st
                  ? 'bg-[#1f6b52] text-white'
                  : 'bg-[#f0f4f2] text-[#425d55] hover:bg-[#e4ece8]',
              )}
            >
              {st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManualOrderModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productTitle, setProductTitle] = useState('Regal Scrub Suit');
  const [size, setSize] = useState('M');
  const [price, setPrice] = useState('5490');
  const [quantity, setQuantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'JAZZCASH' | 'EASYPAISA'>('COD');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#143d36]/35 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-[#dfe7e2] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-[#edf2ef]">
          <div>
            <h3 className="text-base font-semibold text-[#173c35]">Create Manual Order</h3>
            <p className="text-xs text-[#80918a]">Direct phone or WhatsApp customer booking</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#889a93] hover:bg-[#f2f6f4]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-rose-800">
              <CircleAlert size={15} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#274840] mb-1">Customer Full Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Dr. Tariq Mahmood"
              required
              className="h-9 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 outline-none focus:ring-2 focus:ring-[#1f6b52]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-[#274840] mb-1">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@email.com"
                required
                className="h-9 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 outline-none focus:ring-2 focus:ring-[#1f6b52]/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#274840] mb-1">Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="03001234567"
                required
                className="h-9 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 outline-none focus:ring-2 focus:ring-[#1f6b52]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block font-semibold text-[#274840] mb-1">Product</label>
              <input
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                required
                className="h-9 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 outline-none focus:ring-2 focus:ring-[#1f6b52]/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#274840] mb-1">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="h-9 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-2 outline-none"
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
              <label className="block font-semibold text-[#274840] mb-1">Price (PKR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="h-9 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#274840] mb-1">Payment</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'COD' | 'JAZZCASH' | 'EASYPAISA')}
                className="h-9 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-2 outline-none"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="JAZZCASH">JazzCash</option>
                <option value="EASYPAISA">EasyPaisa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#274840] mb-1">Notes / Address</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions or delivery address..."
              className="w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] p-2.5 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#edf2ef]">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="bg-[#1f6b52] text-white hover:bg-[#185540]">
              {loading ? 'Creating…' : 'Create Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

