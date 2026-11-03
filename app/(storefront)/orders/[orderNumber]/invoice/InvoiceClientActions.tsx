'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface Props {
  orderNumber: string;
}

export default function InvoiceClientActions({ orderNumber }: Props) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('print') === '1') {
        const timer = setTimeout(() => {
          window.print();
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: '12px 18px',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: '#4a5568',
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        ← Return to Store
      </Link>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#ffffff',
            color: '#1f6b52',
            border: '1.5px solid #1f6b52',
            padding: '8px 16px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          🖨️ Print Order
        </button>

        <a
          href={`/api/orders/${encodeURIComponent(orderNumber)}/pdf`}
          download={`Medixa-Order-${orderNumber}.pdf`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#1f6b52',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          📥 Download PDF
        </a>
      </div>
    </div>
  );
}

