import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import InvoiceClientActions from './InvoiceClientActions';

export const instant = false;

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderInvoicePage({ params }: Props) {
  const { orderNumber } = await params;
  const decoded = decodeURIComponent(orderNumber).trim();

  const order = await db.order.findFirst({
    where: {
      OR: [
        { orderNumber: { equals: decoded, mode: 'insensitive' } },
        { id: decoded },
      ],
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div style={{ background: '#f5f7f8', minHeight: '100vh', padding: '24px 16px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-card {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          @page {
            margin: 1.2cm;
            size: A4 portrait;
          }
        }
      `}</style>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Top Action Bar (Hidden on print) */}
        <div className="no-print" style={{ marginBottom: 20 }}>
          <InvoiceClientActions orderNumber={order.orderNumber} />
        </div>

        {/* Invoice Printable Sheet */}
        <div
          className="invoice-card"
          style={{
            background: '#ffffff',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #e5e9ec',
            padding: '36px 40px',
            color: '#1a202c',
          }}
        >
          {/* Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #1f6b52', paddingBottom: 20, marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#1f6b52', letterSpacing: '0.5px' }}>
                  MEDIXA
                </span>
                <span style={{ background: '#eaf4f0', color: '#1f6b52', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                  SCRUBS PAKISTAN
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#5a6a75' }}>
                Engineered for 24-Hour Hospital Shifts
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1a202c', letterSpacing: '-0.3px' }}>
                OFFICIAL INVOICE
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: 14, fontWeight: 700, color: '#1f6b52' }}>
                {order.orderNumber}
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: 12, color: '#718096' }}>
                Date: {formattedDate}
              </p>
            </div>
          </div>

          {/* Customer & Order Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28, background: '#f8fafb', padding: 18, borderRadius: 8 }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 12, textTransform: 'uppercase', color: '#718096', letterSpacing: '0.5px', fontWeight: 700 }}>
                Deliver To
              </h3>
              <p style={{ margin: '0 0 3px 0', fontSize: 15, fontWeight: 700, color: '#1a202c' }}>
                {order.shipFullName}
              </p>
              <p style={{ margin: '0 0 3px 0', fontSize: 13, color: '#4a5568' }}>
                {order.phone}
              </p>
              {order.email ? (
                <p style={{ margin: '0 0 3px 0', fontSize: 13, color: '#4a5568' }}>
                  {order.email}
                </p>
              ) : null}
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#4a5568', lineHeight: 1.4 }}>
                {order.shipLine1}, {order.shipCity}, {order.shipProvince}
              </p>
            </div>

            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 12, textTransform: 'uppercase', color: '#718096', letterSpacing: '0.5px', fontWeight: 700 }}>
                Order Summary
              </h3>
              <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Payment Method:</span>
                  <strong style={{ color: '#1a202c' }}>{order.paymentMethod} (Cash on Delivery)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Payment Status:</span>
                  <span style={{ color: order.paymentStatus === 'PAID' ? '#166534' : '#b45309', fontWeight: 600 }}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#718096' }}>Fulfillment:</span>
                  <strong style={{ color: '#1f6b52' }}>{order.status}</strong>
                </div>
                {order.notes ? (
                  <div style={{ marginTop: 4, borderTop: '1px dashed #e2e8f0', paddingTop: 4 }}>
                    <span style={{ color: '#718096', fontSize: 12 }}>Note: {order.notes}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24, fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#1f6b52', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', borderRadius: '6px 0 0 6px', fontWeight: 700 }}>Item</th>
                <th style={{ padding: '10px 14px', fontWeight: 700 }}>Variant</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>Qty</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700 }}>Unit Price</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', borderRadius: '0 6px 6px 0', fontWeight: 700 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={item.id || idx} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1a202c' }}>
                    {item.title}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#4a5568' }}>
                    Size: {item.size || 'M'} · Color: {item.color || 'Standard'}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: '#1a202c', fontWeight: 600 }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', color: '#4a5568' }}>
                    Rs {Number(item.price).toLocaleString('en-PK')}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#1a202c' }}>
                    Rs {(Number(item.price) * item.quantity).toLocaleString('en-PK')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculation Section */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4a5568' }}>
                <span>Subtotal:</span>
                <span>Rs {Number(order.subtotal).toLocaleString('en-PK')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4a5568' }}>
                <span>Delivery Fee:</span>
                <span>
                  {Number(order.shippingFee) > 0
                    ? `Rs ${Number(order.shippingFee).toLocaleString('en-PK')}`
                    : 'FREE'}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '2px solid #1f6b52',
                  paddingTop: 8,
                  marginTop: 4,
                  fontSize: 16,
                  fontWeight: 800,
                  color: '#1f6b52',
                }}
              >
                <span>Grand Total:</span>
                <span>Rs {Number(order.total).toLocaleString('en-PK')}</span>
              </div>
            </div>
          </div>

          {/* Policy & Support Notice */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 18, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#718096' }}>
            <div>
              <p style={{ margin: '0 0 2px 0', fontWeight: 600, color: '#4a5568' }}>
                Thank you for choosing Medixa!
              </p>
              <p style={{ margin: 0 }}>
                Please inspect your medical scrubs package upon delivery before completing payment.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 2px 0' }}>Support: support@medixa.pk</p>
              <p style={{ margin: 0 }}>https://medixa.pk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
