export interface InvoiceOrderData {
  orderNumber: string;
  createdAt: Date | string;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
  };
  subtotal: number;
  shippingFee: number;
  total: number;
  items: Array<{
    title: string;
    sku?: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
  }>;
}

function escapePdf(str: unknown): string {
  return String(str ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function formatDate(val: Date | string): string {
  try {
    const d = new Date(val);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(val);
  }
}

/**
 * Generates a valid standard PDF-1.4 binary buffer for an official Medixa order invoice.
 * No external native dependencies required.
 */
export function generateInvoicePdfBuffer(order: InvoiceOrderData): Buffer {
  const streamCommands: string[] = [];

  // Top header banner: Medixa blue (#052263 -> 0.0196, 0.1333, 0.3882)
  streamCommands.push('0.0196 0.1333 0.3882 rg 40 760 515 45 re f');

  // Header branding text
  streamCommands.push(
    `BT /F2 18 Tf 1 1 1 rg 55 778 Td (${escapePdf('MEDIXA MEDICAL SCRUBS')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 9 Tf 1 1 1 rg 395 778 Td (${escapePdf('OFFICIAL ORDER INVOICE')}) Tj ET`,
  );

  // Order Details Block (Left)
  streamCommands.push('0 0 0 rg');
  streamCommands.push(
    `BT /F2 11 Tf 40 725 Td (${escapePdf(`Order Reference: ${order.orderNumber}`)}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 10 Tf 40 708 Td (${escapePdf(`Date: ${formatDate(order.createdAt)}`)}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 10 Tf 40 691 Td (${escapePdf(`Payment Method: ${order.paymentMethod || 'COD'}`)}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 10 Tf 40 674 Td (${escapePdf(`Payment Status: ${order.paymentStatus || 'UNPAID'}`)}) Tj ET`,
  );

  // Deliver To Block (Right)
  streamCommands.push(
    `BT /F2 11 Tf 310 725 Td (${escapePdf('Deliver To:')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 10 Tf 310 708 Td (${escapePdf(order.customerName)}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 10 Tf 310 691 Td (${escapePdf(`Phone: ${order.customerPhone}`)}) Tj ET`,
  );
  const addrStr = `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.province}`;
  // Split long address if needed
  if (addrStr.length > 38) {
    const p1 = addrStr.slice(0, 38);
    const p2 = addrStr.slice(38);
    streamCommands.push(`BT /F1 9 Tf 310 674 Td (${escapePdf(p1)}) Tj ET`);
    streamCommands.push(`BT /F1 9 Tf 310 660 Td (${escapePdf(p2)}) Tj ET`);
  } else {
    streamCommands.push(`BT /F1 10 Tf 310 674 Td (${escapePdf(addrStr)}) Tj ET`);
  }

  // Divider Line
  streamCommands.push('0.82 0.82 0.82 RG 1 w 40 645 m 555 645 l S');

  // Items Table Header
  streamCommands.push('0.94 0.94 0.94 rg 40 620 515 20 re f');
  streamCommands.push(
    `BT /F2 10 Tf 0 0 0 rg 50 626 Td (${escapePdf('ITEM DESCRIPTION')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F2 10 Tf 270 626 Td (${escapePdf('SIZE / COLOR')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F2 10 Tf 380 626 Td (${escapePdf('QTY')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F2 10 Tf 430 626 Td (${escapePdf('PRICE')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F2 10 Tf 490 626 Td (${escapePdf('TOTAL')}) Tj ET`,
  );

  // Table Rows
  let y = 600;
  for (const item of order.items) {
    const itemTitle =
      item.title.length > 35 ? `${item.title.slice(0, 32)}...` : item.title;
    const variantDesc = `${item.size || 'M'} / ${item.color || 'Standard'}`;
    const lineTotal = Number(item.price) * Number(item.quantity);

    streamCommands.push(
      `BT /F1 9 Tf 0 0 0 rg 50 ${y} Td (${escapePdf(itemTitle)}) Tj ET`,
    );
    streamCommands.push(
      `BT /F1 9 Tf 270 ${y} Td (${escapePdf(variantDesc)}) Tj ET`,
    );
    streamCommands.push(
      `BT /F1 9 Tf 385 ${y} Td (${escapePdf(String(item.quantity))}) Tj ET`,
    );
    streamCommands.push(
      `BT /F1 9 Tf 430 ${y} Td (${escapePdf(`Rs ${Number(item.price).toLocaleString('en-PK')}`)}) Tj ET`,
    );
    streamCommands.push(
      `BT /F1 9 Tf 490 ${y} Td (${escapePdf(`Rs ${lineTotal.toLocaleString('en-PK')}`)}) Tj ET`,
    );

    y -= 20;
    streamCommands.push(
      `0.9 0.9 0.9 RG 0.5 w 40 ${y + 12} m 555 ${y + 12} l S`,
    );
  }

  // Summary calculation block
  y -= 10;
  streamCommands.push(
    `BT /F1 10 Tf 370 ${y} Td (${escapePdf('Subtotal:')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 10 Tf 480 ${y} Td (${escapePdf(`Rs ${order.subtotal.toLocaleString('en-PK')}`)}) Tj ET`,
  );

  y -= 16;
  streamCommands.push(
    `BT /F1 10 Tf 370 ${y} Td (${escapePdf('Delivery Fee:')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 10 Tf 480 ${y} Td (${escapePdf(order.shippingFee > 0 ? `Rs ${order.shippingFee.toLocaleString('en-PK')}` : 'FREE')}) Tj ET`,
  );

  // Grand total highlight bar
  y -= 22;
  streamCommands.push(`0.0196 0.1333 0.3882 rg 350 ${y - 6} 205 26 re f`);
  streamCommands.push(
    `BT /F2 11 Tf 1 1 1 rg 365 ${y + 3} Td (${escapePdf('Grand Total:')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F2 11 Tf 1 1 1 rg 475 ${y + 3} Td (${escapePdf(`Rs ${order.total.toLocaleString('en-PK')}`)}) Tj ET`,
  );

  // Payment note
  y -= 30;
  streamCommands.push(
    `BT /F1 9 Tf 0.3 0.3 0.3 rg 40 ${y} Td (${escapePdf('* Please keep exact cash ready upon delivery. Inspect your package before receiving.')}) Tj ET`,
  );

  // Bottom footer divider and legal notes
  streamCommands.push('0.82 0.82 0.82 RG 1 w 40 85 m 555 85 l S');
  streamCommands.push(
    `BT /F2 9 Tf 0.2 0.2 0.2 rg 40 70 Td (${escapePdf('MEDIXA UNIFORMS & MEDICAL APPAREL PAKISTAN')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 8 Tf 0.4 0.4 0.4 rg 40 56 Td (${escapePdf('Email: support@medixa.pk | Official Storefront: https://medixa.pk')}) Tj ET`,
  );
  streamCommands.push(
    `BT /F1 8 Tf 0.4 0.4 0.4 rg 360 56 Td (${escapePdf('Thank you for your dedicated service!')}) Tj ET`,
  );

  const streamContent = streamCommands.join('\n');
  const streamLen = Buffer.byteLength(streamContent, 'utf-8');

  const body = [
    '%PDF-1.4',
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj',
    `6 0 obj << /Length ${streamLen} >> stream\n${streamContent}\nendstream\nendobj`,
  ];

  const xref: string[] = ['xref', '0 7', '0000000000 65535 f '];
  let fullDoc = '';

  for (let i = 0; i < body.length; i++) {
    const offset = Buffer.byteLength(fullDoc, 'utf-8');
    xref.push(`${String(offset).padStart(10, '0')} 00000 n `);
    fullDoc += `${body[i]}\n`;
  }

  const startxref = Buffer.byteLength(fullDoc, 'utf-8');
  fullDoc += `${xref.join('\n')}\n`;
  fullDoc += `trailer << /Size 7 /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`;

  return Buffer.from(fullDoc, 'utf-8');
}
