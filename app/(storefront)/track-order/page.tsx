'use client';

import { useState, type FormEvent } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/products';

interface TrackedOrder {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  shipCity: string;
  shipProvince: string;
  customerName: string;
  items: Array<{
    title: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>;
}

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTrack(e: FormEvent) {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderQuery.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'No order found with this tracking ID. Please verify your reference number.');
        return;
      }

      setOrder(data);
    } catch {
      setError('Unable to reach the tracking service. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  }

  const getStepActive = (status: string, stepIndex: number) => {
    const sequence = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIdx = sequence.indexOf(status.toUpperCase());
    return currentIdx >= stepIndex;
  };

  return (
    <>
      <Header />

      {/* Breadcrumb Header */}
      <div style={{ background: '#f5f6fa', padding: '36px 0', borderBottom: '1px solid #e5ebf1' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Medixa Dispatch Logistics
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#131b2e', margin: '6px 0 0' }}>
                Track Your Medical Scrubs Order
              </h1>
              <p style={{ fontSize: 13, color: '#738290', margin: '8px auto 0', maxWidth: 500 }}>
                Enter your Medixa order reference (e.g. <strong>MX-123456</strong>) sent via email or SMS to view real-time fulfillment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Track Section */}
      <div style={{ padding: '60px 0 90px', background: '#fafcfd' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
              {/* Lookup Card */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  border: '1px solid #e7ecf0',
                  padding: '32px 28px',
                  boxShadow: '0 8px 30px rgba(19,27,46, 0.05)',
                  marginBottom: 36,
                }}
              >
                <form onSubmit={handleTrack}>
                  <label htmlFor="order-id" style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#131b2e', marginBottom: 8 }}>
                    Order Number / Reference ID
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      id="order-id"
                      type="text"
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      placeholder="e.g. MX-492104"
                      required
                      style={{
                        flex: 1,
                        height: 48,
                        borderRadius: 12,
                        border: '1.5px solid #d4dfd9',
                        padding: '0 16px',
                        fontSize: 14,
                        color: '#131b2e',
                        outline: 'none',
                        background: '#fafcfd',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        height: 48,
                        padding: '0 26px',
                        background: '#052263',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      {loading ? 'Locating…' : 'Track Order'}
                    </button>
                  </div>
                </form>

                {error && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: '12px 16px',
                      background: '#fff2f4',
                      borderRadius: 10,
                      border: '1px solid #fcd2d8',
                      color: '#c22f46',
                      fontSize: 13,
                    }}
                  >
                    ⚠ {error}
                  </div>
                )}
              </div>

              {/* Order Results Card */}
              {order && (
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: 20,
                    border: '1px solid #e7ecf0',
                    padding: '36px 30px',
                    boxShadow: '0 8px 30px rgba(19,27,46, 0.05)',
                  }}
                >
                  {/* Status Banner */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingBottom: 20,
                      borderBottom: '1px solid #edf1f5',
                      marginBottom: 28,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#052263' }}>
                        Reference: {order.orderNumber}
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: '#131b2e', margin: '4px 0 0' }}>
                        Customer: {order.customerName}
                      </h3>
                      <p style={{ fontSize: 12, color: '#7a8896', margin: '2px 0 0' }}>
                        Destination: {order.shipCity}, {order.shipProvince}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 14px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 700,
                          background: order.status === 'DELIVERED' ? '#eceef6' : '#e9ecf4',
                          color: order.status === 'DELIVERED' ? '#1c7d42' : '#052263',
                        }}
                      >
                        ● {order.status}
                      </span>
                      <div style={{ fontSize: 11, color: '#8894a2', marginTop: 4 }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Stepper Timeline */}
                  <div style={{ marginBottom: 36 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#131b2e', marginBottom: 18, letterSpacing: '0.06em' }}>
                      Fulfillment Progress
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, textAlign: 'center' }}>
                      {[
                        { label: 'Placed', idx: 0 },
                        { label: 'Confirmed', idx: 1 },
                        { label: 'Processing', idx: 2 },
                        { label: 'Shipped', idx: 3 },
                        { label: 'Delivered', idx: 4 },
                      ].map((step) => {
                        const active = getStepActive(order.status, step.idx);
                        return (
                          <div key={step.label}>
                            <div
                              style={{
                                height: 6,
                                borderRadius: 3,
                                background: active ? '#052263' : '#e7ecf0',
                                marginBottom: 8,
                                transition: 'background 0.3s',
                              }}
                            />
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: active ? 700 : 500,
                                color: active ? '#131b2e' : '#9aa7b2',
                              }}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ordered Items Table */}
                  <div style={{ marginBottom: 28 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#131b2e', marginBottom: 14, letterSpacing: '0.06em' }}>
                      Order Items
                    </h4>
                    <div style={{ border: '1px solid #eef1f4', borderRadius: 12, overflow: 'hidden' }}>
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: idx % 2 === 0 ? '#ffffff' : '#fafcfd',
                            borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #edf1f5',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#131b2e' }}>{it.title}</div>
                            <div style={{ fontSize: 11, color: '#7b8998' }}>
                              Color: {it.color} · Size: {it.size} · Qty: {it.quantity}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#052263' }}>
                            {formatPrice(it.price * it.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: 14,
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, color: '#687887' }}>Payment Method: <strong>{order.paymentMethod}</strong></div>
                      <div style={{ fontSize: 12, color: '#687887' }}>Delivery Service: <strong>Nationwide Courier (TCS / PostEx)</strong></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#7c8b99' }}>Total Amount</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#131b2e' }}>
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>

                  {/* Print & PDF Actions */}
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16, flexWrap: 'wrap' }}>
                    <a
                      href={`/orders/${encodeURIComponent(order.orderNumber)}/invoice?print=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#ffffff',
                        color: '#052263',
                        border: '1.5px solid #052263',
                        padding: '9px 16px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      🖨️ Print Order
                    </a>
                    <a
                      href={`/api/orders/${encodeURIComponent(order.orderNumber)}/pdf`}
                      download={`Medixa-Order-${order.orderNumber}.pdf`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#052263',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px 16px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      📥 Download PDF
                    </a>
                  </div>
                </div>
              )}

              {/* Help & Support Callout */}
              <div style={{ textAlign: 'center', marginTop: 36, fontSize: 13, color: '#7a8896' }}>
                Need help with your shipment? Reach Medixa Dispatch on WhatsApp at{' '}
                <a
                  href="https://wa.me/923435114065"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#052263', fontWeight: 700, textDecoration: 'none' }}
                >
                  +92 343 511 4065
                </a>{' '}
                or email{' '}
                <a href="mailto:support@medixa.pk" style={{ color: '#052263', fontWeight: 700, textDecoration: 'none' }}>
                  support@medixa.pk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

