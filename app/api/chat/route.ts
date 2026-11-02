import { NextResponse } from 'next/server';
import { products } from '@/lib/products';

// Medixa Brand & Clinical Knowledge Base
const MEDIXA_CATALOG_SUMMARY = products
  .map(
    (p) =>
      `• ${p.title} (${p.category} - ${p.collection}): Rs ${p.price.toLocaleString('en-PK')} (Compare: Rs ${p.compareAt.toLocaleString('en-PK')}). SKU: ${p.sku}. Sizes: ${p.sizes.join(', ')}. Features: ${p.features.join('; ')}. Link: /products/${p.slug}`
  )
  .join('\n');

const SYSTEM_INSTRUCTION = `You are the Medixa AI Shopping Concierge, an expert clinical apparel advisor for Medixa Pakistan (medixa.pk).
Your tone is professional, warm, polite (often addressing doctors, nurses, surgeons, and healthcare heroes), and knowledgeable.

Core Medixa Facts:
1. Product Catalog:
${MEDIXA_CATALOG_SUMMARY}

2. Key Fabric Pillars:
- Zero-Fade Vat Dyeing: Colors stay deep and vibrant through 100+ clinical autoclave washes.
- 4-Way Ergonomic Stretch: Engineered for 24-hour hospital shifts without pinching or stiffness.
- Moisture-Wicking Tech: Keeps doctors cool under intense operating theater lighting.
- Antimicrobial Shield: Hospital-grade barrier against microbes.

3. Sizing Guidelines:
- Men (Regal / Forte): XS (Chest 36-38"), S (38-40"), M (40-42"), L (42-44"), XL (44-46"), XXL (46-48").
- Women (Muse / Rebel): XS (Bust 32-34"), S (34-36"), M (36-38"), L (38-40"), XL (40-42").

4. Shipping & Payment:
- Nationwide courier delivery via TCS & Leopards in 3-5 business days.
- Free delivery on orders over Rs 10,000 (Standard delivery is Rs 250).
- Cash on Delivery (COD) accepted nationwide.
- 7-Day Hassle-Free Exchange Policy.

5. Official Contact:
- Phone / WhatsApp: +92 343 511 4065 (Mon-Sat 9 AM - 6 PM PKT).
- Email: info@medixa.pk

Rules for your responses:
- Keep answers concise, actionable, and friendly (usually 2-4 short sentences or bullet points).
- If recommending a scrub, mention the collection name and price in PKR (e.g. Regal Scrub Suit for Rs 3,450).
- If customer asks about order status, ask for their order reference (e.g. MX-2026-XXXX) or tell them to check the "Track Order" tab.
- If customer asks for urgent custom embroidery or hospital bulk discounts, direct them to WhatsApp at +92 343 511 4065.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // If API key is not yet configured, provide smart fallback response
    if (!apiKey) {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return NextResponse.json({
        reply: generateLocalFallback(lastUserMsg),
        source: 'local-knowledge',
      });
    }

    // Convert messages to Gemini contents format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Candidate Gemini models in order of availability on Google AI Studio
    const candidateModels = [
      'gemini-3.5-flash-lite',
      'gemini-flash-latest',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
    ];

    let replyText = '';
    let usedModel = '';

    const payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents,
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 600,
      },
    };

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text;
          if (text) {
            replyText = text;
            usedModel = model;
            break;
          }
        } else {
          const errText = await response.text();
          console.warn(`Gemini model ${model} returned status ${response.status}:`, errText);
        }
      } catch (err) {
        console.warn(`Failed attempting model ${model}:`, err);
      }
    }

    if (!replyText) {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return NextResponse.json({
        reply: generateLocalFallback(lastUserMsg),
        source: 'local-fallback',
      });
    }

    return NextResponse.json({
      reply: replyText,
      source: usedModel,
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json(
      {
        reply:
          "Thank you for contacting Medixa! For immediate sizing assistance, hospital orders, or custom embroidery, please message our senior scrub specialist on WhatsApp at +92 343 511 4065.",
        source: 'error-fallback',
      },
      { status: 200 }
    );
  }
}

function generateLocalFallback(query: string): string {
  const lower = query.toLowerCase();
  if (lower.includes('size') || lower.includes('fit') || lower.includes('measurement')) {
    return 'Medixa scrubs feature 4-Way Ergonomic Stretch. For Men: S (Chest 38-40"), M (40-42"), L (42-44"). For Women: S (Bust 34-36"), M (36-38"), L (38-40"). You can view the full measurement chart in our Size Guide.';
  }
  if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('days')) {
    return 'We deliver nationwide in 3-5 working days via TCS & Leopards. Shipping is Free on orders over Rs 10,000 (standard Rs 250), with Cash on Delivery (COD) available nationwide.';
  }
  if (lower.includes('regal') || (lower.includes('men') && lower.includes('scrub'))) {
    return 'Our bestselling Men’s Regal Scrub Suit is crafted with round-neck comfort, deep utility pockets, and 4-way stretch fabric for Rs 3,450.';
  }
  if (lower.includes('muse') || (lower.includes('women') && lower.includes('scrub'))) {
    return 'Our signature Women’s Muse Scrub Suit offers a tailored silhouette, comfort waistband, and zero-fade fabric for Rs 3,450.';
  }
  if (lower.includes('exchange') || lower.includes('return')) {
    return 'We offer a 7-day hassle-free exchange policy if your scrub size needs adjusting!';
  }
  return 'Welcome to Medixa Pakistan! I can help you choose the ideal scrubs (Regal for Men, Muse for Women), find your size, or track existing orders. How can I assist your clinical shift today?';
}

