'use client';

import { useState, type FormEvent } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Header />

      {/* Breadcrumb Header */}
      <div style={{ background: '#f5f6fa', padding: '36px 0', borderBottom: '1px solid #e5ebf1' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 text-center">
              <span style={{ fontSize: 11, fontWeight: 700, color: '#052263', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Customer Care & Concierge
              </span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#131b2e', margin: '6px 0 0' }}>
                Contact Medixa Pakistan
              </h1>
              <p style={{ fontSize: 13, color: '#738290', margin: '8px auto 0', maxWidth: 500 }}>
                Have questions about sizing, bulk hospital orders, or custom institutional embroidery? Our support team is here to assist.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Contact Section */}
      <div style={{ padding: '60px 0 90px', background: '#fafcfd' }}>
        <div className="container">
          <div className="row">
            {/* Contact Details Column */}
            <div className="col-md-5 col-sm-6 col-xs-12" style={{ marginBottom: 30 }}>
              <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e7ecf0', padding: '32px 28px', height: '100%' }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#131b2e', margin: '0 0 16px' }}>
                  Direct Channels
                </h3>
                <p style={{ fontSize: 13, color: '#687786', lineHeight: 1.6, marginBottom: 28 }}>
                  Reach our dedicated medical apparel specialists via WhatsApp, phone, or email for instant assistance with sizing and delivery.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e9ecf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#052263' }}>
                      💬
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#052263', textTransform: 'uppercase' }}>WhatsApp Concierge</div>
                      <a href="https://wa.me/923435114065" target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, fontWeight: 700, color: '#131b2e', textDecoration: 'none' }}>
                        +92 343 511 4065
                      </a>
                      <div style={{ fontSize: 11, color: '#889e95' }}>Fast response time (9am – 9pm)</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e9ecf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#052263' }}>
                      ✉️
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#052263', textTransform: 'uppercase' }}>Email Support</div>
                      <a href="mailto:info@medixa.pk" style={{ fontSize: 15, fontWeight: 700, color: '#131b2e', textDecoration: 'none' }}>
                        info@medixa.pk
                      </a>
                      <div style={{ fontSize: 11, color: '#889e95' }}>General inquiries & Institutional orders</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e9ecf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#052263' }}>
                      🚚
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#052263', textTransform: 'uppercase' }}>Nationwide Delivery</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#131b2e' }}>
                        Karachi, Lahore, Islamabad & Nationwide
                      </div>
                      <div style={{ fontSize: 11, color: '#889e95' }}>Express delivery via TCS, Leopards & PostEx</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 32, padding: 18, background: '#f5f6fa', borderRadius: 14, border: '1px solid #e5e8f1' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#131b2e' }}>★ Hospital & Institutional Orders</div>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#687786', lineHeight: 1.5 }}>
                    Need customized scrubs with hospital logos, doctor name embroidery, or bulk department orders? Contact us for specialized B2B pricing.
                  </p>
                </div>
              </div>
            </div>

            {/* Message Form Column */}
            <div className="col-md-7 col-sm-6 col-xs-12">
              <div style={{ background: '#ffffff', borderRadius: 20, border: '1px solid #e7ecf0', padding: '36px 32px' }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#131b2e', margin: '0 0 8px' }}>
                  Send an Inquiry
                </h3>
                <p style={{ fontSize: 13, color: '#7a8997', margin: '0 0 24px' }}>
                  Fill in your details below and an associate will get back to you within 24 hours.
                </p>

                {submitted ? (
                  <div style={{ padding: '30px 20px', background: '#eef1f8', borderRadius: 14, textAlign: 'center', border: '1px solid #d7ddea' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>✓</div>
                    <h4 style={{ fontSize: 18, fontWeight: 800, color: '#052263', margin: '0 0 6px' }}>Message Received!</h4>
                    <p style={{ fontSize: 13, color: '#4d6270', margin: 0 }}>
                      Thank you, {name}. Our customer care team will contact you shortly via email or WhatsApp.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      style={{
                        marginTop: 18,
                        background: '#052263',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 18px',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="row">
                      <div className="col-sm-6 col-xs-12">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>Your Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Dr. Ahmed Khan"
                          style={{ width: '100%', height: 42, borderRadius: 10, border: '1px solid #dbe2e9', padding: '0 12px', fontSize: 13, outline: 'none' }}
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="doctor@example.com"
                          style={{ width: '100%', height: 42, borderRadius: 10, border: '1px solid #dbe2e9', padding: '0 12px', fontSize: 13, outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-6 col-xs-12">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0300 1234567"
                          style={{ width: '100%', height: 42, borderRadius: 10, border: '1px solid #dbe2e9', padding: '0 12px', fontSize: 13, outline: 'none' }}
                        />
                      </div>
                      <div className="col-sm-6 col-xs-12">
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>Inquiry Topic</label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          style={{ width: '100%', height: 42, borderRadius: 10, border: '1px solid #dbe2e9', padding: '0 12px', fontSize: 13, outline: 'none' }}
                        >
                          <option value="Product Inquiry">Product Inquiry</option>
                          <option value="Size Exchange">Size Exchange</option>
                          <option value="Bulk Hospital Order">Bulk Hospital Order</option>
                          <option value="Custom Embroidery">Custom Embroidery</option>
                          <option value="Order Tracking">Order Tracking</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#131b2e', marginBottom: 6 }}>Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your requirements or questions…"
                        style={{ width: '100%', borderRadius: 10, border: '1px solid #dbe2e9', padding: 12, fontSize: 13, outline: 'none' }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        height: 46,
                        background: '#052263',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(5, 34, 99, 0.25)',
                      }}
                    >
                      Submit Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

