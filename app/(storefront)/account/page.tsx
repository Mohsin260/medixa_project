'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { authClient } from '@/lib/auth/client';

interface OrderItem {
  id: string;
  title: string;
  sku: string;
  size?: string;
  color?: string;
  image?: string;
  price: number;
  quantity: number;
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  shipFullName: string;
  shipCity: string;
  shipProvince: string;
  items: OrderItem[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export default function CustomerAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const userRes = await fetch('/api/user/me');
        const userData = await userRes.json();

        if (!mounted) return;

        if (userData?.authenticated && userData.user) {
          setUser(userData.user);

          // Fetch customer orders
          const ordersRes = await fetch('/api/user/orders');
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            if (mounted && Array.isArray(ordersData.orders)) {
              setOrders(ordersData.orders);
            }
          }
        }
      } catch (err) {
        console.error('Account load error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push('/');
      router.refresh();
    } catch {
      router.push('/');
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    let bg = '#fef3c7';
    let text = '#b45309';

    if (s === 'DELIVERED') {
      bg = '#dcfce7';
      text = '#15803d';
    } else if (s === 'SHIPPED') {
      bg = '#e0f2fe';
      text = '#0369a1';
    } else if (s === 'CONFIRMED' || s === 'PROCESSING') {
      bg = '#e6f4ef';
      text = '#1f6b52';
    } else if (s === 'CANCELLED') {
      bg = '#fee2e2';
      text = '#b91c1c';
    }

    return (
      <span
        style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 700,
          background: bg,
          color: text,
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <Header />

      <main style={{ background: '#f8faf9', minHeight: '80vh', padding: '40px 16px 80px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6b7280' }}>
              <i className="fa fa-spinner fa-spin fa-2x" style={{ color: '#1f6b52', marginBottom: 12 }} />
              <p>Loading your Medixa account…</p>
            </div>
          ) : !user ? (
            /* Unauthenticated View */
            <div
              style={{
                maxWidth: 520,
                margin: '40px auto',
                background: '#ffffff',
                borderRadius: 14,
                padding: '40px 32px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: '#e6f4ef',
                  color: '#1f6b52',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  margin: '0 auto 18px',
                }}
              >
                <i className="fa fa-user-circle" />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
                Customer Account
              </h1>
              <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.5, margin: '0 0 24px' }}>
                Sign in to view your complete order history, track deliveries in real time, and manage your saved shipping details.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link
                  href="/auth/sign-in?redirectTo=/account"
                  style={{
                    background: '#1f6b52',
                    color: '#ffffff',
                    padding: '13px 20px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Sign In to Medixa
                </Link>
                <Link
                  href="/auth/sign-up"
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '13px 20px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid #d1d5db',
                  }}
                >
                  Create New Account
                </Link>
              </div>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f3f4f6', fontSize: 13, color: '#6b7280' }}>
                Have an order reference but no account?{' '}
                <Link href="/track-order" style={{ color: '#1f6b52', fontWeight: 600 }}>
                  Track Guest Order →
                </Link>
              </div>
            </div>
          ) : (
            /* Authenticated Account Dashboard */
            <>
              {/* Persona Greeting Header */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 14,
                  padding: '28px 32px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                  marginBottom: 28,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Persona Avatar Badge */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: '#1f6b52',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      fontWeight: 800,
                      boxShadow: '0 2px 8px rgba(31, 107, 82, 0.3)',
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>
                        {user.name}
                      </h1>
                      {user.role === 'ADMIN' ? (
                        <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                          ADMIN
                        </span>
                      ) : (
                        <span style={{ background: '#e6f4ef', color: '#1f6b52', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                          VERIFIED CUSTOMER
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>
                      {user.email} {user.phone ? `· ${user.phone}` : ''}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #fde68a',
                        padding: '9px 16px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <i className="fa fa-tachometer" /> Admin Studio
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    style={{
                      background: '#ffffff',
                      color: '#dc2626',
                      border: '1px solid #fecaca',
                      padding: '9px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <i className="fa fa-sign-out" /> Sign Out
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  style={{
                    background: activeTab === 'orders' ? '#1f6b52' : '#ffffff',
                    color: activeTab === 'orders' ? '#ffffff' : '#374151',
                    border: '1px solid',
                    borderColor: activeTab === 'orders' ? '#1f6b52' : '#e5e7eb',
                    padding: '10px 20px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <i className="fa fa-shopping-bag" />
                  My Orders &amp; Tracking ({orders.length})
                </button>
                <Link
                  href="/track-order"
                  style={{
                    background: '#ffffff',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    padding: '10px 20px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <i className="fa fa-search" />
                  Track by Reference Number
                </Link>
              </div>

              {/* Orders List View */}
              {activeTab === 'orders' && (
                <div>
                  {orders.length === 0 ? (
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 14,
                        padding: '48px 24px',
                        textAlign: 'center',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <i className="fa fa-inbox fa-3x" style={{ color: '#9ca3af', marginBottom: 14 }} />
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
                        No orders placed yet
                      </h3>
                      <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 20px' }}>
                        When you place an order on Medixa, you can track fulfillment right here.
                      </p>
                      <Link
                        href="/"
                        style={{
                          background: '#1f6b52',
                          color: '#ffffff',
                          padding: '11px 22px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        Explore Medical Scrubs
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          style={{
                            background: '#ffffff',
                            borderRadius: 12,
                            border: '1px solid #e5e7eb',
                            padding: '24px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                          }}
                        >
                          {/* Order Top Bar */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              borderBottom: '1px solid #f3f4f6',
                              paddingBottom: 16,
                              marginBottom: 16,
                              flexWrap: 'wrap',
                              gap: 12,
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                                  {order.orderNumber}
                                </span>
                                {getStatusBadge(order.status)}
                              </div>
                              <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0' }}>
                                Placed on{' '}
                                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}{' '}
                                · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase' }}>
                                Total Amount
                              </span>
                              <div style={{ fontSize: 18, fontWeight: 800, color: '#1f6b52' }}>
                                Rs {order.total.toLocaleString('en-PK')}
                              </div>
                              <span style={{ fontSize: 11, color: '#6b7280' }}>
                                {order.paymentMethod} ({order.paymentStatus})
                              </span>
                            </div>
                          </div>

                          {/* Line items list */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                            {order.items.map((it) => (
                              <div
                                key={it.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: 14,
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  {it.image ? (
                                    <Image
                                      src={it.image}
                                      alt={it.title}
                                      width={48}
                                      height={48}
                                      style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #e5e7eb' }}
                                    />
                                  ) : (
                                    <div
                                      style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 6,
                                        background: '#f3f4f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#9ca3af',
                                      }}
                                    >
                                      <i className="fa fa-tag" />
                                    </div>
                                  )}
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                                      {it.title}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                                      {it.color} / {it.size} · Qty: {it.quantity}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                                  Rs {(it.price * it.quantity).toLocaleString('en-PK')}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              borderTop: '1px solid #f3f4f6',
                              paddingTop: 14,
                              flexWrap: 'wrap',
                              gap: 10,
                            }}
                          >
                            <span style={{ fontSize: 12, color: '#6b7280' }}>
                              Shipping to: <strong>{order.shipFullName}</strong> ({order.shipCity}, {order.shipProvince})
                            </span>

                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <Link
                                href={`/track-order?q=${encodeURIComponent(order.orderNumber)}`}
                                style={{
                                  background: '#1f6b52',
                                  color: '#ffffff',
                                  padding: '7px 14px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                }}
                              >
                                <i className="fa fa-map-marker" /> Track Live →
                              </Link>
                              <a
                                href={`/api/orders/${encodeURIComponent(order.orderNumber)}/pdf`}
                                download={`Medixa-Order-${order.orderNumber}.pdf`}
                                style={{
                                  background: '#ffffff',
                                  color: '#374151',
                                  border: '1px solid #d1d5db',
                                  padding: '7px 14px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                }}
                              >
                                <i className="fa fa-download" /> PDF Invoice
                              </a>
                              <a
                                href={`/orders/${encodeURIComponent(order.orderNumber)}/invoice?print=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  background: '#ffffff',
                                  color: '#374151',
                                  border: '1px solid #d1d5db',
                                  padding: '7px 14px',
                                  borderRadius: 6,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                }}
                              >
                                <i className="fa fa-print" /> Print
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
