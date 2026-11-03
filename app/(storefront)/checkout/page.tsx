'use client';

import { useState, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart';
import styles from './checkout.module.css';

const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu and Kashmir',
] as const;

const STORAGE_KEY = 'medixa_checkout_data_v2';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const deliveryFee = subtotal >= 10000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + deliveryFee;

  // Form states
  const [email, setEmail] = useState('');
  const [newsOffers, setNewsOffers] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState<string>('Punjab');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [saveInfo, setSaveInfo] = useState(true);
  const [whatsappOffers, setWhatsappOffers] = useState(true);

  // Payment states: 'BANK_DEPOSIT' (default on medixa.pk) | 'COD' | 'JAZZCASH'
  const [paymentMethod, setPaymentMethod] = useState<'BANK_DEPOSIT' | 'COD' | 'JAZZCASH'>('BANK_DEPOSIT');

  // Billing address state: 'same' | 'different'
  const [billingSame, setBillingSame] = useState(true);
  const [billFirstName, setBillFirstName] = useState('');
  const [billLastName, setBillLastName] = useState('');
  const [billAddress1, setBillAddress1] = useState('');
  const [billAddress2, setBillAddress2] = useState('');
  const [billCity, setBillCity] = useState('');
  const [billProvince, setBillProvince] = useState<string>('Punjab');
  const [billPostalCode, setBillPostalCode] = useState('');
  const [billPhone, setBillPhone] = useState('');

  // Additional order notes
  const [notes, setNotes] = useState('');

  // UI state
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);

  // Placed Order state
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [placedTotal, setPlacedTotal] = useState(0);

  // Post-purchase account creation state (Shopify hybrid pattern)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountPassword, setAccountPassword] = useState('');
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [accountCreationError, setAccountCreationError] = useState<string | null>(null);

  // Restore saved customer data
  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {});

    queueMicrotask(() => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const d = JSON.parse(cached);
          if (d && typeof d === 'object') {
            if (d.email && d.email.toLowerCase() !== 'admin@medixa.pk') setEmail(d.email);
            if (d.firstName && !d.firstName.toLowerCase().includes('admin')) setFirstName(d.firstName);
            if (d.lastName) setLastName(d.lastName);
            if (d.address1) setAddress1(d.address1);
            if (d.address2) setAddress2(d.address2);
            if (d.city) setCity(d.city);
            if (d.province) setProvince(d.province);
            if (d.postalCode) setPostalCode(d.postalCode);
            if (d.phone) setPhone(d.phone);
          }
        }
      } catch {
        // Ignore
      }
    });

    fetch('/api/user/saved-address')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.address) {
          const a = data.address;
          if (a.email && a.email.toLowerCase() !== 'admin@medixa.pk') setEmail(a.email);
          const parts = (a.name || '').split(' ');
          if (parts[0] && !parts[0].toLowerCase().includes('admin')) setFirstName(parts[0]);
          if (parts.slice(1).join(' ')) setLastName(parts.slice(1).join(' '));
          if (a.street) setAddress1(a.street);
          if (a.city) setCity(a.city);
          if (a.state) setProvince(a.state);
          if (a.phone) setPhone(a.phone);
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyBank = () => {
    const text = `Account Title: Medixa Essentials\nBank: MEEZAN BANK\nIBAN: PK14MEZN0003200115070230\nWhatsApp: +92 343 5114065`;
    navigator.clipboard?.writeText(text);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      setError('Your shopping cart is empty.');
      return;
    }

    if (!email || !firstName || !address1 || !city || !phone) {
      setError('Please fill out all required contact and delivery fields.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const shippingAddress = {
        street: address2 ? `${address1.trim()}, ${address2.trim()}` : address1.trim(),
        city: city.trim(),
        state: province,
        postalCode: postalCode.trim(),
      };

      const billingAddress = billingSame
        ? shippingAddress
        : {
            street: billAddress2 ? `${billAddress1.trim()}, ${billAddress2.trim()}` : billAddress1.trim(),
            city: billCity.trim(),
            state: billProvince,
            postalCode: billPostalCode.trim(),
          };

      const billFullName = billingSame
        ? fullName
        : `${billFirstName.trim()} ${billLastName.trim()}`.trim() || fullName;

      // Save to localStorage if saveInfo is enabled
      if (saveInfo && email.toLowerCase() !== 'admin@medixa.pk') {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              email,
              firstName,
              lastName,
              address1,
              address2,
              city,
              province,
              postalCode,
              phone,
            }),
          );
        } catch {
          // Ignore
        }
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress,
          billingAddress: {
            ...billingAddress,
            name: billFullName,
            phone: billingSame ? phone : billPhone || phone,
          },
          newsletter: newsOffers || whatsappOffers,
          notes,
          paymentMethod,
          items: items.map((it) => ({
            productId: it.slug,
            slug: it.slug,
            title: it.title,
            image: it.image,
            price: it.price,
            quantity: it.quantity,
            size: it.size,
            color: it.color,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete order. Please try again.');
      }

      setOrderNumber(data.orderNumber);
      setPlacedTotal(total);
      setPlaced(true);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAccount = async (e: FormEvent) => {
    e.preventDefault();
    if (accountPassword.length < 8) {
      setAccountCreationError('Password must be at least 8 characters.');
      return;
    }

    setCreatingAccount(true);
    setAccountCreationError(null);

    try {
      const { authClient } = await import('@/lib/auth/client');
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password: accountPassword,
        name: `${firstName} ${lastName}`.trim() || 'Valued Customer',
      });

      if (signUpError) {
        setAccountCreationError(
          signUpError.message || 'Could not create account. Please try signing in instead.',
        );
        return;
      }

      setAccountCreated(true);
      setIsLoggedIn(true);
    } catch {
      setAccountCreationError('Failed to create account. Please try again.');
    } finally {
      setCreatingAccount(false);
    }
  };

  return (
    <div className={styles.checkoutWrapper}>
      {/* Top Header */}
      <header className={styles.checkoutHeader}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logoLink} title="Navigate to Medixa Online Store">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.shopify.com/s/files/1/0632/1052/0675/files/Med-04_x320.png?v=1787402987"
              alt="Medixa Pakistan"
              className={styles.logoImg}
            />
          </Link>

          <Link href="/cart" className={styles.cartLink} title="Shopping Cart">
            <i className="fa fa-shopping-bag" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Mobile Sticky Order Summary Toggle */}
      {!placed && (
        <>
          <div
            className={styles.mobileSummaryBar}
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            role="button"
            tabIndex={0}
            aria-expanded={mobileSummaryOpen}
          >
            <div className={styles.mobileSummaryInner}>
              <span className={styles.mobileToggleText}>
                <i className="fa fa-shopping-cart" aria-hidden="true" />
                <span>{mobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}</span>
                <i className={`fa fa-chevron-${mobileSummaryOpen ? 'up' : 'down'}`} style={{ fontSize: 11 }} />
              </span>
              <span className={styles.mobileTotalAmount}>Rs {total.toLocaleString('en-PK')}</span>
            </div>
          </div>

          {mobileSummaryOpen && (
            <div className={styles.mobileSummaryContent}>
              <div className={styles.itemList}>
                {items.map((it) => (
                  <div key={it.id} className={styles.itemRow}>
                    <div className={styles.itemMedia}>
                      {it.image && (
                        <Image
                          src={it.image}
                          alt={it.title}
                          width={64}
                          height={64}
                          className={styles.itemImage}
                        />
                      )}
                      <span className={styles.itemBadge}>{it.quantity}</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemTitle}>{it.title}</h4>
                      <p className={styles.itemVariant}>
                        {it.color} / {it.size}
                      </p>
                    </div>
                    <div className={styles.itemPrice}>
                      Rs {(it.price * it.quantity).toLocaleString('en-PK')}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.calcRow}>
                <span>Subtotal</span>
                <span>Rs {subtotal.toLocaleString('en-PK')}</span>
              </div>
              <div className={styles.calcRow}>
                <span>Shipping</span>
                <span>{deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee.toLocaleString('en-PK')}`}</span>
              </div>
              <div className={styles.calcRowTotal}>
                <span className={styles.totalLabel}>Total</span>
                <div className={styles.totalRight}>
                  <span className={styles.currencyCode}>PKR</span>
                  <span className={styles.totalAmount}>Rs {total.toLocaleString('en-PK')}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Checkout View / Order Placed View */}
      {placed ? (
        <main className={styles.successContainer}>
          <div className={styles.successIcon}>
            <i className="fa fa-check" />
          </div>
          <h1 className={styles.successTitle}>Thank you for your order!</h1>
          {orderNumber && (
            <p className={styles.successReference}>Order Reference: {orderNumber}</p>
          )}
          <p className={styles.successText}>
            Your order has been placed successfully. A confirmation message and tracking details have
            been logged. For bank transfer, please share your receipt on WhatsApp (+92 343 5114065).
          </p>

          <div className={styles.successCard}>
            <span style={{ fontSize: 14, color: '#4b5563' }}>Payment Total</span>
            <strong style={{ fontSize: 18, color: '#1f6b52' }}>
              Rs {placedTotal.toLocaleString('en-PK')}
            </strong>
          </div>

          {/* Hybrid Post-Purchase Account Creation Card */}
          {!isLoggedIn && !accountCreated && (
            <div className={styles.accountCreationBox}>
              <div className={styles.accountCreationHeader}>
                <div className={styles.accountCreationIcon}>
                  <i className="fa fa-user-plus" aria-hidden="true" />
                </div>
                <div>
                  <h3 className={styles.accountCreationTitle}>Create an Account to Track Orders</h3>
                  <div className={styles.accountEmailBadge}>
                    <i className="fa fa-envelope" aria-hidden="true" /> {email}
                  </div>
                </div>
              </div>
              <p className={styles.accountCreationText}>
                Save your shipping details and easily track real-time fulfillment and parcel delivery for this and future orders.
              </p>
              <form onSubmit={handleCreateAccount} className={styles.accountCreationForm}>
                <input
                  type="password"
                  className={styles.accountPasswordInput}
                  placeholder="Set password (min 8 chars)"
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="submit"
                  disabled={creatingAccount}
                  className={styles.accountSubmitBtn}
                >
                  {creatingAccount ? 'Creating...' : 'Create Account'}
                </button>
              </form>
              {accountCreationError && (
                <div className={styles.accountErrorMsg}>{accountCreationError}</div>
              )}
            </div>
          )}

          {/* Account Created / Logged In Notification */}
          {(accountCreated || isLoggedIn) && (
            <div className={styles.accountSuccessBanner}>
              <div>
                <strong>✓ Account Active:</strong> All details & tracking for this order are saved to your customer portal.
              </div>
              <Link
                href="/account"
                className={styles.accountSubmitBtn}
                style={{ padding: '8px 14px', fontSize: 12, textDecoration: 'none' }}
              >
                Go to My Orders →
              </Link>
            </div>
          )}

          <div className={styles.successActions}>
            {orderNumber && (
              <>
                <a
                  href={`/api/orders/${encodeURIComponent(orderNumber)}/pdf`}
                  download={`Medixa-Order-${orderNumber}.pdf`}
                  className={styles.completeOrderBtn}
                  style={{ width: 'auto', padding: '12px 20px', fontSize: 14 }}
                >
                  <i className="fa fa-download" aria-hidden="true" /> Download Order PDF
                </a>

                <a
                  href={`/orders/${encodeURIComponent(orderNumber)}/invoice?print=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnSecondarySmall}
                  style={{ padding: '12px 20px', fontSize: 14 }}
                >
                  <i className="fa fa-print" aria-hidden="true" /> Print Order
                </a>

                <a
                  href={`/track-order?q=${encodeURIComponent(orderNumber)}`}
                  className={styles.btnSecondarySmall}
                  style={{ padding: '12px 20px', fontSize: 14, border: '1px solid #d1d5db', color: '#374151' }}
                >
                  Track Order Live →
                </a>
              </>
            )}
            <Link
              href="/"
              className={styles.btnSecondarySmall}
              style={{ padding: '12px 20px', fontSize: 14, border: '1px solid #d1d5db', color: '#374151' }}
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      ) : (
        <form onSubmit={handleSubmitOrder} className={styles.layoutGrid} noValidate>
          {/* Left Form Column */}
          <div className={styles.formColumn}>
            {/* Section 1: Contact */}
            <section className={styles.section} aria-label="Contact">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Contact</h2>
                <Link href="/login" className={styles.signinLink}>
                  Sign in
                </Link>
              </div>

              <div className={styles.field}>
                <label className={styles.inputLabel} htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className={styles.inputField}
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={newsOffers}
                  onChange={(e) => setNewsOffers(e.target.checked)}
                />
                <span className={styles.checkboxLabel}>Email me with news and offers</span>
              </label>
            </section>

            {/* Section 2: Delivery */}
            <section className={styles.section} aria-label="Delivery">
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Delivery</h2>
              </div>

              <div className={styles.fieldGrid}>
                {/* Country/Region */}
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.inputLabel} htmlFor="shipping-country">
                    Country/Region
                  </label>
                  <select
                    id="shipping-country"
                    name="countryCode"
                    className={styles.selectField}
                    defaultValue="PK"
                  >
                    <option value="PK">Pakistan</option>
                  </select>
                </div>

                {/* First Name & Last Name */}
                <div className={styles.field}>
                  <label className={styles.inputLabel} htmlFor="first-name">
                    First name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    className={styles.inputField}
                    required
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.inputLabel} htmlFor="last-name">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    className={styles.inputField}
                    required
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                  />
                </div>

                {/* Street Address */}
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.inputLabel} htmlFor="shipping-address1">
                    Address
                  </label>
                  <input
                    id="shipping-address1"
                    type="text"
                    className={styles.inputField}
                    required
                    placeholder="Address (House number, street, area)"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    autoComplete="street-address"
                  />
                </div>

                {/* Apartment, Suite (optional) */}
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.inputLabel} htmlFor="shipping-address2">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    id="shipping-address2"
                    type="text"
                    className={styles.inputField}
                    placeholder="Apartment, suite, unit, etc."
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>

                {/* City & Postal Code */}
                <div className={styles.field}>
                  <label className={styles.inputLabel} htmlFor="shipping-city">
                    City
                  </label>
                  <input
                    id="shipping-city"
                    type="text"
                    className={styles.inputField}
                    required
                    placeholder="City (e.g. Lahore, Karachi, Islamabad)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoComplete="address-level2"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.inputLabel} htmlFor="shipping-postalCode">
                    Postal code (optional)
                  </label>
                  <input
                    id="shipping-postalCode"
                    type="text"
                    className={styles.inputField}
                    placeholder="Postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    autoComplete="postal-code"
                  />
                </div>

                {/* Province */}
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.inputLabel}>Province</label>
                  <select
                    className={styles.selectField}
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  >
                    {PAKISTAN_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone */}
                <div className={`${styles.field} ${styles.fieldFull}`}>
                  <label className={styles.inputLabel} htmlFor="shipping-phone">
                    Phone
                  </label>
                  <input
                    id="shipping-phone"
                    type="tel"
                    className={styles.inputField}
                    required
                    placeholder="03XX XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                  <span className={styles.fieldHelper}>In case we need to contact you about your order</span>
                </div>
              </div>

              {/* Delivery Checkboxes */}
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                />
                <span className={styles.checkboxLabel}>Save this information for next time</span>
              </label>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={whatsappOffers}
                  onChange={(e) => setWhatsappOffers(e.target.checked)}
                />
                <span className={styles.checkboxLabel}>Message me on WhatsApp with news and offers</span>
              </label>
            </section>

            {/* Section 3: Shipping Method */}
            <section className={styles.section} aria-label="Shipping method">
              <h2 className={styles.sectionTitle} style={{ marginBottom: 14 }}>
                Shipping method
              </h2>
              <div className={styles.shippingBox}>
                <div className={styles.shippingOption}>
                  <div className={styles.shippingRadioGroup}>
                    <input type="radio" checked readOnly className={styles.paymentRadio} />
                    <div>
                      <div className={styles.shippingTitle}>
                        {deliveryFee === 0 ? 'Free Shipping' : 'Standard Nationwide Delivery'}
                      </div>
                      <div className={styles.shippingSub}>Dispatched via TCS / PostEx (3-5 business days)</div>
                    </div>
                  </div>
                  <span className={styles.shippingPrice}>
                    {deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee.toLocaleString('en-PK')}`}
                  </span>
                </div>
              </div>
            </section>

            {/* Section 4: Payment */}
            <section className={styles.section} aria-label="Payment">
              <h2 className={styles.sectionTitle}>Payment</h2>
              <p className={styles.sectionSubtitle}>All transactions are secure and encrypted.</p>

              <div className={styles.paymentContainer}>
                {/* 1. Bank Deposit (Exact Medixa layout & details) */}
                <div className={styles.paymentItem}>
                  <div
                    className={`${styles.paymentHeader} ${paymentMethod === 'BANK_DEPOSIT' ? styles.paymentHeaderSelected : ''}`}
                    onClick={() => setPaymentMethod('BANK_DEPOSIT')}
                  >
                    <div className={styles.paymentLabelWrap}>
                      <input
                        type="radio"
                        id="pay-bank"
                        name="paymentMethod"
                        value="BANK_DEPOSIT"
                        checked={paymentMethod === 'BANK_DEPOSIT'}
                        onChange={() => setPaymentMethod('BANK_DEPOSIT')}
                        className={styles.paymentRadio}
                      />
                      <label htmlFor="pay-bank" className={styles.paymentLabelText}>
                        Bank Deposit
                      </label>
                    </div>
                    <div className={styles.paymentIcons}>
                      <i className="fa fa-university" aria-hidden="true" />
                    </div>
                  </div>

                  {paymentMethod === 'BANK_DEPOSIT' && (
                    <div className={styles.paymentCollapse}>
                      <div className={styles.bankNoticeCard}>
                        <div style={{ fontWeight: 700, color: '#1f6b52', marginBottom: 10 }}>
                          Payment Information:
                        </div>
                        <div className={styles.bankRow}>
                          <span className={styles.bankLabel}>Account Title:</span>
                          <span className={styles.bankValue}>Medixa Essentials</span>
                        </div>
                        <div className={styles.bankRow}>
                          <span className={styles.bankLabel}>Bank:</span>
                          <span className={styles.bankValue}>MEEZAN BANK</span>
                        </div>
                        <div className={styles.bankRow}>
                          <span className={styles.bankLabel}>IBAN:</span>
                          <span className={styles.bankValue}>PK14MEZN0003200115070230</span>
                        </div>

                        <p className={styles.bankNoticeText}>
                          After making the payment, kindly send the payment slip on WhatsApp:
                          <br />
                          <strong style={{ color: '#1f6b52' }}>+92 343 5114065</strong>
                        </p>

                        <div className={styles.bankActionButtons}>
                          <button
                            type="button"
                            onClick={handleCopyBank}
                            className={styles.btnSecondarySmall}
                          >
                            <i className="fa fa-clone" aria-hidden="true" />
                            {copiedBank ? 'Details Copied!' : 'Copy Bank Details'}
                          </button>
                          <a
                            href="https://wa.me/923435114065?text=Hi%20Medixa%2C%20here%20is%20my%20payment%20slip%20for%20order."
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnSecondarySmall}
                          >
                            <i className="fa fa-whatsapp" aria-hidden="true" />
                            WhatsApp Slip (+92 343 5114065)
                          </a>
                        </div>
                      </div>

                      <p style={{ margin: '8px 0 0', fontSize: 12, color: '#4b5563', lineHeight: 1.5 }}>
                        Cash on Delivery is available in Lahore &amp; Islamabad. Customers from other cities,
                        please avail the bank transfer facility.
                        <br />
                        <em>Thank you for choosing Medixa Scrubs.</em>
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Cash on Delivery (COD) */}
                <div className={styles.paymentItem}>
                  <div
                    className={`${styles.paymentHeader} ${paymentMethod === 'COD' ? styles.paymentHeaderSelected : ''}`}
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <div className={styles.paymentLabelWrap}>
                      <input
                        type="radio"
                        id="pay-cod"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className={styles.paymentRadio}
                      />
                      <label htmlFor="pay-cod" className={styles.paymentLabelText}>
                        Cash on Delivery (COD)
                      </label>
                    </div>
                    <div className={styles.paymentIcons}>
                      <i className="fa fa-money" aria-hidden="true" />
                    </div>
                  </div>

                  {paymentMethod === 'COD' && (
                    <div className={styles.paymentCollapse}>
                      <p style={{ margin: 0 }}>
                        Cash on Delivery is available in Lahore &amp; Islamabad. Customers from other cities,
                        please avail the bank transfer facility. Pay in cash when your order arrives at your
                        doorstep.
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Jazz Cash */}
                <div className={styles.paymentItem}>
                  <div
                    className={`${styles.paymentHeader} ${paymentMethod === 'JAZZCASH' ? styles.paymentHeaderSelected : ''}`}
                    onClick={() => setPaymentMethod('JAZZCASH')}
                  >
                    <div className={styles.paymentLabelWrap}>
                      <input
                        type="radio"
                        id="pay-jazzcash"
                        name="paymentMethod"
                        value="JAZZCASH"
                        checked={paymentMethod === 'JAZZCASH'}
                        onChange={() => setPaymentMethod('JAZZCASH')}
                        className={styles.paymentRadio}
                      />
                      <label htmlFor="pay-jazzcash" className={styles.paymentLabelText}>
                        Jazz Cash
                      </label>
                    </div>
                    <div className={styles.paymentIcons}>
                      <i className="fa fa-mobile" style={{ fontSize: 18 }} aria-hidden="true" />
                    </div>
                  </div>

                  {paymentMethod === 'JAZZCASH' && (
                    <div className={styles.paymentCollapse}>
                      <p style={{ margin: '0 0 8px' }}>
                        Please transfer to JazzCash Account:{' '}
                        <strong style={{ color: '#1f6b52' }}>0343 5114065</strong> (Title:{' '}
                        <strong>Medixa Essentials</strong>).
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                        Kindly send the payment confirmation screenshot on WhatsApp (+92 343 5114065).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 5: Billing Address */}
            <section className={styles.section} aria-label="Billing address">
              <h2 className={styles.sectionTitle} style={{ marginBottom: 14 }}>
                Billing address
              </h2>

              <div className={styles.billingGroup}>
                <label
                  className={`${styles.billingOption} ${billingSame ? styles.billingOptionActive : ''}`}
                >
                  <input
                    type="radio"
                    name="billingSelector"
                    checked={billingSame}
                    onChange={() => setBillingSame(true)}
                    className={styles.paymentRadio}
                  />
                  <span className={styles.paymentLabelText}>Same as shipping address</span>
                </label>

                <label
                  className={`${styles.billingOption} ${!billingSame ? styles.billingOptionActive : ''}`}
                >
                  <input
                    type="radio"
                    name="billingSelector"
                    checked={!billingSame}
                    onChange={() => setBillingSame(false)}
                    className={styles.paymentRadio}
                  />
                  <span className={styles.paymentLabelText}>Use a different billing address</span>
                </label>

                {!billingSame && (
                  <div className={styles.billingCollapse}>
                    <div className={styles.fieldGrid}>
                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label className={styles.inputLabel} htmlFor="billing-country">
                          Country/Region
                        </label>
                        <select
                          id="billing-country"
                          name="billingCountryCode"
                          className={styles.selectField}
                          defaultValue="PK"
                        >
                          <option value="PK">Pakistan</option>
                        </select>
                      </div>

                      <div className={styles.field}>
                        <label className={styles.inputLabel}>First name</label>
                        <input
                          type="text"
                          className={styles.inputField}
                          placeholder="First name"
                          value={billFirstName}
                          onChange={(e) => setBillFirstName(e.target.value)}
                        />
                      </div>

                      <div className={styles.field}>
                        <label className={styles.inputLabel}>Last name</label>
                        <input
                          type="text"
                          className={styles.inputField}
                          placeholder="Last name"
                          value={billLastName}
                          onChange={(e) => setBillLastName(e.target.value)}
                        />
                      </div>

                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label className={styles.inputLabel}>Address</label>
                        <input
                          type="text"
                          className={styles.inputField}
                          placeholder="Address"
                          value={billAddress1}
                          onChange={(e) => setBillAddress1(e.target.value)}
                        />
                      </div>

                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label className={styles.inputLabel}>Apartment, suite, etc. (optional)</label>
                        <input
                          type="text"
                          className={styles.inputField}
                          placeholder="Apartment, suite, etc."
                          value={billAddress2}
                          onChange={(e) => setBillAddress2(e.target.value)}
                        />
                      </div>

                      <div className={styles.field}>
                        <label className={styles.inputLabel}>City</label>
                        <input
                          type="text"
                          className={styles.inputField}
                          placeholder="City"
                          value={billCity}
                          onChange={(e) => setBillCity(e.target.value)}
                        />
                      </div>

                      <div className={styles.field}>
                        <label className={styles.inputLabel}>Postal code (optional)</label>
                        <input
                          type="text"
                          className={styles.inputField}
                          placeholder="Postal code"
                          value={billPostalCode}
                          onChange={(e) => setBillPostalCode(e.target.value)}
                        />
                      </div>

                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label className={styles.inputLabel}>Province</label>
                        <select
                          className={styles.selectField}
                          value={billProvince}
                          onChange={(e) => setBillProvince(e.target.value)}
                        >
                          {PAKISTAN_PROVINCES.map((prov) => (
                            <option key={prov} value={prov}>
                              {prov}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={`${styles.field} ${styles.fieldFull}`}>
                        <label className={styles.inputLabel}>Phone (optional)</label>
                        <input
                          type="tel"
                          className={styles.inputField}
                          placeholder="Phone"
                          value={billPhone}
                          onChange={(e) => setBillPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Section 6: Additional Order Notes */}
            <section className={styles.section} aria-label="Order Notes">
              <h2 className={styles.sectionTitle} style={{ marginBottom: 12 }}>
                Order Notes (Optional)
              </h2>
              <textarea
                className={styles.textareaField}
                rows={3}
                placeholder="Special instructions for hospital delivery, department, or shift timings"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </section>

            {/* Section 7: Complete Order CTA */}
            <div className={styles.completeOrderSection}>
              <button
                type="submit"
                disabled={submitting}
                className={styles.completeOrderBtn}
              >
                {submitting ? (
                  <>
                    <i className="fa fa-spinner fa-spin" aria-hidden="true" />
                    <span>Processing order…</span>
                  </>
                ) : (
                  <>
                    <i className="fa fa-lock" aria-hidden="true" />
                    <span>Complete order · Rs {total.toLocaleString('en-PK')}</span>
                  </>
                )}
              </button>

              {error && (
                <div className={styles.errorMessage} role="alert">
                  <i className="fa fa-exclamation-circle" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <p className={styles.trustFootnote}>
                <i className="fa fa-shield" aria-hidden="true" />
                All transactions are secure and encrypted.
              </p>
            </div>

            {/* Footer Policies Links */}
            <footer className={styles.footerPolicies}>
              <Link href="/terms">Terms and policies</Link>
              <Link href="/privacy-policy">Privacy policy</Link>
              <Link href="/refund-policy">Refund policy</Link>
              <Link href="/shipping-policy">Shipping policy</Link>
            </footer>
          </div>

          {/* Right Summary Column (Sticky on Desktop) */}
          <aside className={styles.summaryColumn} aria-label="Order summary">
            <h2 className={styles.summaryHeader}>Order summary</h2>

            <div className={styles.itemList}>
              {items.map((it) => (
                <div key={it.id} className={styles.itemRow}>
                  <div className={styles.itemMedia}>
                    {it.image && (
                      <Image
                        src={it.image}
                        alt={it.title}
                        width={64}
                        height={64}
                        className={styles.itemImage}
                      />
                    )}
                    <span className={styles.itemBadge}>{it.quantity}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemTitle}>{it.title}</h4>
                    <p className={styles.itemVariant}>
                      {it.color} / {it.size}
                    </p>
                  </div>
                  <div className={styles.itemPrice}>
                    Rs {(it.price * it.quantity).toLocaleString('en-PK')}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.calcDivider} />

            <div className={styles.calcRow}>
              <span>Subtotal</span>
              <span>Rs {subtotal.toLocaleString('en-PK')}</span>
            </div>

            <div className={styles.calcRow}>
              <span>Shipping</span>
              <span style={{ fontWeight: 600, color: deliveryFee === 0 ? '#1f6b52' : '#111827' }}>
                {deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee.toLocaleString('en-PK')}`}
              </span>
            </div>

            <div className={styles.calcRowTotal}>
              <span className={styles.totalLabel}>Total</span>
              <div className={styles.totalRight}>
                <span className={styles.currencyCode}>PKR</span>
                <span className={styles.totalAmount}>Rs {total.toLocaleString('en-PK')}</span>
              </div>
            </div>
          </aside>
        </form>
      )}
    </div>
  );
}
