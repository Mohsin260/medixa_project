'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './CustomerConcierge.module.css';

interface ProductPreview {
  title: string;
  category: string;
  price: string;
  image: string;
  slug: string;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actions?: { label: string; action?: () => void; link?: string }[];
  product?: ProductPreview;
  trackingData?: {
    orderNumber: string;
    status: string;
    fulfillmentStatus: string;
    totalAmount: number;
    itemsCount: number;
    shippingCity: string;
  };
}

export default function CustomerConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialBotMessage: Message = {
    id: '1',
    sender: 'bot',
    text: "Assalam-o-Alaikum! Welcome to Medixa Medical Apparel. 👋\nI am your AI Shopping Concierge. How can I help with your clinical scrub selection today?",
    actions: [
      {
        label: '✨ Recommend Scrubs',
        action: () => handleSelectOption('recommend'),
      },
      {
        label: '📦 Track My Order',
        action: () => handleSelectOption('track'),
      },
      {
        label: '📏 Sizing Advisor',
        action: () => handleSelectOption('size'),
      },
      {
        label: '💬 Chat on WhatsApp',
        link: 'https://wa.me/923435114065?text=Hi%20Medixa%2C%20I%20need%20assistance%20with%20my%20scrub%20order.',
      },
    ],
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const respondBot = (
    text: string,
    actions?: Message['actions'],
    product?: ProductPreview,
    trackingData?: Message['trackingData']
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text,
          actions,
          product,
          trackingData,
        },
      ]);
    }, 550);
  };

  const handleSelectOption = (option: string) => {
    if (option === 'recommend') {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'user', text: 'Recommend the best scrubs for my hospital shift.' },
      ]);
      respondBot(
        "Which collection are you looking for?",
        [
          {
            label: "Men's Regal Scrubs",
            action: () => {
              setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), sender: 'user', text: "Show me Men's Regal Scrubs." },
              ]);
              respondBot(
                "The Regal Scrub Suit is our #1 bestseller for male physicians — featuring a tailored round-neck design, 4-way ergonomic stretch, and deep clinical utility pockets.",
                [
                  { label: 'View Regal Scrub Suit', link: '/products/regal-scrub-suit' },
                  { label: "Browse All Men's", link: '/shop?category=Men' },
                ],
                {
                  title: 'Regal Scrub Suit',
                  category: "Men's Clinical Apparel",
                  price: 'Rs 3,450',
                  image: '/img/real-product-images/regal/regal-thumbnail.webp',
                  slug: 'regal-scrub-suit',
                }
              );
            },
          },
          {
            label: "Women's Muse Scrubs",
            action: () => {
              setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), sender: 'user', text: "Show me Women's Muse Scrubs." },
              ]);
              respondBot(
                "The Muse Scrub Suit is meticulously crafted for female healthcare professionals, offering a contoured feminine silhouette, comfort flex waistband, and zero-fading fabric.",
                [
                  { label: 'View Muse Scrub Suit', link: '/products/muse-scrub-suit' },
                  { label: "Browse All Women's", link: '/shop?category=Women' },
                ],
                {
                  title: 'Muse Scrub Suit',
                  category: "Women's Clinical Apparel",
                  price: 'Rs 3,450',
                  image: '/img/real-product-images/muse/muse-thumbnail.webp',
                  slug: 'muse-scrub-suit',
                }
              );
            },
          },
        ]
      );
    } else if (option === 'track') {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'user', text: 'I want to track my order.' },
      ]);
      respondBot(
        'Please enter your Medixa Order Reference (e.g. MX-2026-8910) or your registered customer phone number:'
      );
    } else if (option === 'size') {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: 'user', text: 'Help me find my size.' },
      ]);
      respondBot(
        'Medixa scrubs are crafted in standard Pakistani/International clinical sizes (XS to XXL) with 4-Way Ergonomic Stretch. Which fit would you like to see?',
        [
          {
            label: "Men's Chart (Regal/Forte)",
            action: () => {
              respondBot(
                "Men's Sizing:\n• XS: Chest 36-38\"\n• S: Chest 38-40\"\n• M: Chest 40-42\"\n• L: Chest 42-44\"\n• XL: Chest 44-46\"\n• XXL: Chest 46-48\"",
                [{ label: 'Full Size Guide', link: '/size-guide' }]
              );
            },
          },
          {
            label: "Women's Chart (Muse/Rebel)",
            action: () => {
              respondBot(
                "Women's Sizing:\n• XS: Bust 32-34\"\n• S: Bust 34-36\"\n• M: Bust 36-38\"\n• L: Bust 38-40\"\n• XL: Bust 40-42\"",
                [{ label: 'Full Size Guide', link: '/size-guide' }]
              );
            },
          },
        ]
      );
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query) return;

    setInput('');
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);

    const lower = query.toLowerCase();

    // Live Order Tracking Query
    if (lower.startsWith('mx-') || /^\d{4,12}$/.test(lower) || lower.includes('track') || lower.includes('order')) {
      const cleanRef = query.replace(/[^\w-]/g, '').trim();
      try {
        setIsTyping(true);
        const res = await fetch(`/api/orders/track?q=${encodeURIComponent(cleanRef)}`);
        const data = await res.json();
        setIsTyping(false);

        if (data.success && data.order) {
          const ord = data.order;
          respondBot(
            `Found Order #${ord.orderNumber}!\nStatus: ${ord.status.toUpperCase()} (${ord.fulfillmentStatus})\nDelivery to: ${ord.shippingAddress?.city || 'Pakistan'}`,
            [
              { label: 'View Live Fulfillment Steps', link: `/track-order?q=${encodeURIComponent(ord.orderNumber)}` },
              { label: 'Contact Support', link: `https://wa.me/923435114065?text=Order%20${ord.orderNumber}` },
            ],
            undefined,
            {
              orderNumber: ord.orderNumber,
              status: ord.status,
              fulfillmentStatus: ord.fulfillmentStatus,
              totalAmount: ord.totalAmount,
              itemsCount: ord.items?.length || 0,
              shippingCity: ord.shippingAddress?.city || 'Pakistan',
            }
          );
          return;
        }
      } catch {
        // Fallback
      }
      setIsTyping(false);
    }

    // If not a pure tracking code, query the Gemini Flash AI assistant endpoint
    setIsTyping(true);
    try {
      const chatHistory = messages
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          content: m.text,
        }));
      chatHistory.push({ role: 'user', content: query });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await res.json();
      setIsTyping(false);

      const replyText = data.reply || "I'm here to help you select the ideal scrubs for your shifts. What collection are you interested in?";
      const lowerReply = replyText.toLowerCase();

      // Intelligently attach product card if Regal or Muse is referenced
      let product: ProductPreview | undefined;
      if (lowerReply.includes('regal') && !lowerReply.includes('muse')) {
        product = {
          title: 'Regal Scrub Suit',
          category: "Men's Clinical Apparel",
          price: 'Rs 3,450',
          image: '/img/real-product-images/regal/regal-thumbnail.webp',
          slug: 'regal-scrub-suit',
        };
      } else if (lowerReply.includes('muse') && !lowerReply.includes('regal')) {
        product = {
          title: 'Muse Scrub Suit',
          category: "Women's Clinical Apparel",
          price: 'Rs 3,450',
          image: '/img/real-product-images/muse/muse-thumbnail.webp',
          slug: 'muse-scrub-suit',
        };
      }

      const actions: Message['actions'] = [];
      if (lowerReply.includes('size') || lower.includes('size')) {
        actions.push({ label: '📏 View Size Chart', link: '/size-guide' });
      }
      if (lowerReply.includes('whatsapp') || lowerReply.includes('phone') || lower.includes('contact')) {
        actions.push({ label: '💬 Chat on WhatsApp', link: 'https://wa.me/923435114065' });
      } else {
        actions.push({ label: '🛍️ Explore Catalog', link: '/shop' });
        actions.push({ label: '💬 WhatsApp Support', link: 'https://wa.me/923435114065' });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: replyText,
          actions,
          product,
        },
      ]);
    } catch {
      setIsTyping(false);
      respondBot(
        "Thank you for contacting Medixa! I'm here to assist with scrub recommendations, order tracking, sizing guidance, and deliveries.",
        [
          { label: '✨ Recommend Scrubs', action: () => handleSelectOption('recommend') },
          { label: '📦 Track My Order', action: () => handleSelectOption('track') },
          { label: '💬 WhatsApp Support', link: 'https://wa.me/923435114065' },
        ]
      );
    }
  };

  return (
    <>
      {/* Medixa Floating Capsule (Shop with AI) */}
      {!isOpen && (
        <div className={styles.capsuleWrapper}>
          <div
            className={styles.capsuleButton}
            onClick={() => setIsOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Shop with AI. Shopping Agent"
          >
            {/* Ambient Running Orbit Light */}
            <div className={styles.orbitBeam} />

            {/* AI Avatar Sparkle Icon Box */}
            <div className={styles.avatarBox}>
              <svg
                className={styles.sparkleIcon}
                viewBox="0 0 20 20"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7.4 12.8a1.04 1.04 0 0 0 1.59-.51l.45-1.37a2.34 2.34 0 0 1 1.47-1.48l1.4-.45A1.04 1.04 0 0 0 12.25 7l-1.37-.45A2.34 2.34 0 0 1 9.4 5.08L8.95 3.7a1.03 1.03 0 0 0-.82-.68 1.04 1.04 0 0 0-1.15.7l-.46 1.4a2.34 2.34 0 0 1-1.44 1.45L3.7 7a1.04 1.04 0 0 0 .02 1.97l1.37.45a2.33 2.33 0 0 1 1.48 1.48l.46 1.4c.07.2.2.37.38.5Zm6.14 4.05a.8.8 0 0 0 1.22-.4l.25-.76a1.09 1.09 0 0 1 .68-.68l.77-.25a.8.8 0 0 0-.02-1.52l-.77-.25a1.08 1.08 0 0 1-.68-.68l-.25-.77a.8.8 0 0 0-1.52.01l-.24.76a1.1 1.1 0 0 1-.67.68l-.77.25a.8.8 0 0 0 0 1.52l.77.25a1.09 1.09 0 0 1 .68.68l.25.77c.06.16.16.3.3.4Z" />
              </svg>
              <span className={styles.onlineDot} />
            </div>

            {/* Typography */}
            <div className={styles.textCol}>
              <span className={styles.mainTitle}>
                Shop with AI
              </span>
              {/* <span className={styles.subTitle}>Ask sizing, shift recommendations &amp; tracking</span> */}
            </div>
          </div>
        </div>
      )}

      {/* Full-Scale Morph Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.headerAvatar}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.4 12.8a1.04 1.04 0 0 0 1.59-.51l.45-1.37a2.34 2.34 0 0 1 1.47-1.48l1.4-.45A1.04 1.04 0 0 0 12.25 7l-1.37-.45A2.34 2.34 0 0 1 9.4 5.08L8.95 3.7a1.03 1.03 0 0 0-.82-.68 1.04 1.04 0 0 0-1.15.7l-.46 1.4a2.34 2.34 0 0 1-1.44 1.45L3.7 7a1.04 1.04 0 0 0 .02 1.97l1.37.45a2.33 2.33 0 0 1 1.48 1.48l.46 1.4c.07.2.2.37.38.5Z" />
                </svg>
              </div>
              <div className={styles.headerInfo}>
                <h3>Medixa Shopping Concierge</h3>
                <div className={styles.headerStatus}>
                  <span className={styles.headerStatusDot} />
                  <span className={styles.headerStatusText}>Online • AI Agent &amp; Clinical Staff</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
              aria-label="Minimize AI Assistant"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className={styles.messagesBody}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.sender === 'user' ? styles.userRow : styles.botRow
                }`}
              >
                <div
                  className={`${styles.bubble} ${
                    msg.sender === 'user' ? styles.userBubble : styles.botBubble
                  }`}
                >
                  {msg.text}
                </div>

                {/* Product Card Recommendation */}
                {msg.product && (
                  <div className={styles.productRec}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={msg.product.image}
                      alt={msg.product.title}
                      className={styles.productRecImg}
                    />
                    <div className={styles.productRecBody}>
                      <span className={styles.productRecCategory}>{msg.product.category}</span>
                      <h4 className={styles.productRecTitle}>{msg.product.title}</h4>
                      <span className={styles.productRecPrice}>{msg.product.price}</span>
                      <Link
                        href={`/products/${msg.product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={styles.productRecLink}
                      >
                        View Scrub Details →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Tracking Data preview */}
                {msg.trackingData && (
                  <div
                    style={{
                      marginTop: 8,
                      width: '85%',
                      background: '#eef8f3',
                      border: '1px solid #c2e5d5',
                      borderRadius: 10,
                      padding: 12,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#173c35', marginBottom: 4 }}>
                      Order: {msg.trackingData.orderNumber}
                    </div>
                    <div style={{ color: '#4b5563' }}>Status: <strong>{msg.trackingData.status.toUpperCase()}</strong></div>
                    <div style={{ color: '#4b5563' }}>Fulfillment: <strong>{msg.trackingData.fulfillmentStatus}</strong></div>
                    <div style={{ color: '#4b5563' }}>City: <strong>{msg.trackingData.shippingCity}</strong></div>
                  </div>
                )}

                {/* Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className={styles.actionsRow}>
                    {msg.actions.map((act, i) =>
                      act.link ? (
                        act.link.startsWith('http') ? (
                          <a
                            key={i}
                            href={act.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.actionChip}
                          >
                            {act.label} ↗
                          </a>
                        ) : (
                          <Link
                            key={i}
                            href={act.link}
                            onClick={() => setIsOpen(false)}
                            className={styles.actionChip}
                          >
                            {act.label} →
                          </Link>
                        )
                      ) : (
                        <button
                          key={i}
                          onClick={act.action}
                          className={`${styles.actionChip} ${styles.actionChipFilled}`}
                        >
                          {act.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: 12,
                  fontSize: 12,
                  color: '#6b7280',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 13 }}>✨</span>
                <span>Medixa Agent is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick WhatsApp Concierge Bar */}
          <div className={styles.quickBar}>
            <span style={{ color: '#173c35', fontWeight: 600 }}>Emergency Clinical Order?</span>
            <a
              href="https://wa.me/923435114065?text=Hi%20Medixa%2C%20I%20have%20an%20urgent%20scrubs%20request."
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us ↗
            </a>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className={styles.inputForm}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about size, Regal vs Muse, order tracking..."
              className={styles.textInput}
            />
            <button
              type="submit"
              aria-label="Send Message"
              className={styles.sendButton}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
