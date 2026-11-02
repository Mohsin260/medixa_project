/* eslint-disable @next/next/no-html-link-for-pages -- legacy theme scripts require full page loads */
'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LegacyScripts from '@/components/LegacyScripts';
import { useCart } from '@/lib/cart';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from 'react';
import styles from './checkout.module.css';

const PAKISTAN_STATES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu and Kashmir',
] as const;

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cod',
    title: 'Cash on Delivery',
    description: 'Pay with cash when your order arrives.',
    icon: 'fa-money',
  },
];

const DELIVERY_FEE = 250;
const MOBILE_QUERY = '(max-width: 767.98px)';

const formatRupees = (value: number) => `Rs ${value.toLocaleString('en-PK')}`;

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
}

interface CheckoutAddress {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  newsletter: boolean;
  shipToDifferent: boolean;
  shipping: ShippingAddress | null;
  notes: string;
}

type SheetName = 'address' | 'payment' | null;

function subscribeToMobileQuery(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getMobileServerSnapshot() {
  return false;
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribeToMobileQuery,
    getMobileSnapshot,
    getMobileServerSnapshot,
  );
}

interface AddressFieldsProps {
  address: CheckoutAddress | null;
  shipToDifferent: boolean;
  onShipToDifferentChange: (checked: boolean) => void;
}

function AddressFields({ address, shipToDifferent, onShipToDifferentChange }: AddressFieldsProps) {
  return (
    <div className={styles.formGrid}>
      <label className={styles.field}>
        <span>
          Full name <em>*</em>
        </span>
        <input
          type="text"
          name="name"
          required
          defaultValue={address?.name || ''}
          placeholder="e.g. Ayesha Khan"
        />
      </label>

      <label className={styles.field}>
        <span>
          Phone number <em>*</em>
        </span>
        <input
          type="tel"
          name="phone"
          required
          defaultValue={address?.phone || ''}
          placeholder="03XX XXXXXXX"
        />
      </label>

      <label className={`${styles.field} ${styles.fullField}`}>
        <span>Email address</span>
        <input
          type="email"
          name="email"
          defaultValue={address?.email || ''}
          placeholder="you@example.com"
        />
      </label>

      <label className={`${styles.field} ${styles.fullField}`}>
        <span>
          Street address <em>*</em>
        </span>
        <input
          type="text"
          name="street"
          required
          defaultValue={address?.street || ''}
          placeholder="House number, street, area"
        />
      </label>

      <label className={styles.field}>
        <span>
          City <em>*</em>
        </span>
        <input
          type="text"
          name="city"
          required
          defaultValue={address?.city || ''}
          placeholder="e.g. Lahore"
        />
      </label>

      <label className={styles.field}>
        <span>
          Province <em>*</em>
        </span>
        <select name="state" required defaultValue={address?.state || ''}>
          <option value="" disabled>
            Select province
          </option>
          {PAKISTAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </label>

      <label className={`${styles.checkboxRow} ${styles.fullField}`}>
        <input
          type="checkbox"
          name="newsletter"
          defaultChecked={address?.newsletter || false}
        />
        <span>Email me with news and offers</span>
      </label>

      <label className={`${styles.checkboxRow} ${styles.fullField}`}>
        <input
          type="checkbox"
          name="shipToDifferent"
          checked={shipToDifferent}
          onChange={(event) => onShipToDifferentChange(event.target.checked)}
        />
        <span>Ship to a different Address?</span>
      </label>

      {shipToDifferent ? (
        <div className={`${styles.shippingFields} ${styles.fullField}`}>
          <p className={styles.shippingLabel}>Shipping address</p>
          <div className={styles.shippingGrid}>
            <label className={`${styles.field} ${styles.shippingStreet}`}>
              <span>
                Street address <em>*</em>
              </span>
              <input
                type="text"
                name="shippingStreet"
                required
                defaultValue={address?.shipping?.street || ''}
                placeholder="House number, street, area"
              />
            </label>

            <label className={styles.field}>
              <span>
                City <em>*</em>
              </span>
              <input
                type="text"
                name="shippingCity"
                required
                defaultValue={address?.shipping?.city || ''}
                placeholder="e.g. Karachi"
              />
            </label>

            <label className={styles.field}>
              <span>
                State <em>*</em>
              </span>
              <input
                type="text"
                name="shippingState"
                required
                defaultValue={address?.shipping?.state || ''}
                placeholder="e.g. Sindh"
              />
            </label>
          </div>
        </div>
      ) : null}

      <div className={`${styles.formSectionHead} ${styles.fullField}`}>
        <h3>Additional Information</h3>
      </div>

      <label className={`${styles.field} ${styles.fullField}`}>
        <span>Order Notes (Optional)</span>
        <textarea
          name="notes"
          rows={4}
          defaultValue={address?.notes || ''}
          placeholder="Write a message about your order"
        />
      </label>
    </div>
  );
}

interface PaymentMethodsProps {
  payment: string;
  onSelect: (methodId: string) => void;
}

function PaymentMethods({ payment, onSelect }: PaymentMethodsProps) {
  return (
    <div className={styles.paymentOptions}>
      {PAYMENT_METHODS.map((method) => (
        <label
          key={method.id}
          className={`${styles.payOption} ${
            payment === method.id ? styles.payOptionActive : ''
          }`}
        >
          <input
            type="radio"
            name="payment-method"
            value={method.id}
            checked={payment === method.id}
            onChange={() => onSelect(method.id)}
          />
          <span className={styles.payIcon} aria-hidden="true">
            <i className={`fa ${method.icon}`} />
          </span>
          <span className={styles.payCopy}>
            <strong>{method.title}</strong>
            <small>{method.description}</small>
          </span>
        </label>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const isMobile = useIsMobile();
  const { items, count, subtotal, clearCart } = useCart();
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const [sheet, setSheet] = useState<SheetName>(null);
  const [sheetClosing, setSheetClosing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState<CheckoutAddress | null>(null);
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [payment, setPayment] = useState('');
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState(false);
  const [placedTotal, setPlacedTotal] = useState(0);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheetOpen = isMobile && Boolean(sheet);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openSheet = (name: Exclude<SheetName, null>) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setSheetClosing(false);
    setSheet(name);
    setError('');
    if (name === 'address') {
      setShipToDifferent(address?.shipToDifferent || false);
    }
  };

  const closeSheet = useCallback(() => {
    setSheetClosing(true);
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    closeTimer.current = setTimeout(() => {
      setSheet(null);
      setSheetClosing(false);
      closeTimer.current = null;
    }, 220);
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!sheetOpen) {
      return undefined;
    }

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sheetRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [sheetOpen]);

  useEffect(() => {
    if (!sheetOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSheet();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sheetOpen, closeSheet]);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setShowAddressForm(false);
      } else {
        setSheet(null);
        setSheetClosing(false);
      }
    };

    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  const startAddressEdit = () => {
    setShipToDifferent(address?.shipToDifferent || false);
    setError('');
    if (isMobile) {
      openSheet('address');
    } else {
      setShowAddressForm(true);
    }
  };

  const cancelAddressEdit = () => {
    setError('');
    if (isMobile) {
      closeSheet();
    } else {
      setShowAddressForm(false);
    }
  };

  const handleAddressSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const shouldShipToDifferentAddress = data.get('shipToDifferent') === 'on';

    setAddress({
      name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      email: String(data.get('email') || '').trim(),
      street: String(data.get('street') || '').trim(),
      city: String(data.get('city') || '').trim(),
      state: String(data.get('state') || '').trim(),
      newsletter: data.get('newsletter') === 'on',
      shipToDifferent: shouldShipToDifferentAddress,
      shipping: shouldShipToDifferentAddress
        ? {
            street: String(data.get('shippingStreet') || '').trim(),
            city: String(data.get('shippingCity') || '').trim(),
            state: String(data.get('shippingState') || '').trim(),
          }
        : null,
      notes: String(data.get('notes') || '').trim(),
    });
    setShipToDifferent(shouldShipToDifferentAddress);
    setError('');
    if (isMobile) {
      closeSheet();
    } else {
      setShowAddressForm(false);
    }
  };

  const selectPayment = (method: string) => {
    setPayment(method);
    setError('');
  };

  const confirmPayment = () => {
    if (!payment) {
      selectPayment('cod');
    }
    closeSheet();
  };

  const handlePlaceOrder = async () => {
    if (!items.length) {
      setError('Your cart is empty. Add an item before placing your order.');
      return;
    }

    if (!address) {
      if (isMobile) {
        openSheet('address');
      } else {
        setShowAddressForm(true);
        scrollTo('deliver-card');
      }
      setError('Please add your delivery address before placing the order.');
      return;
    }

    if (!payment) {
      if (isMobile) {
        openSheet('payment');
      } else {
        scrollTo('payment-card');
      }
      setError('Please select a payment method before placing the order.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: address.name,
          customerEmail: address.email,
          customerPhone: address.phone,
          shippingAddress: {
            street: address.street,
            city: address.city,
            state: address.state,
          },
          notes: address.notes,
          paymentMethod: payment.toUpperCase(),
          items: items.map((it) => ({
            productId: it.slug,
            slug: it.slug,
            title: it.title,
            price: it.price,
            quantity: it.quantity,
            size: it.size,
            color: it.color,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setOrderNumber(data.orderNumber);
      setPlacedTotal(total);
      setPlaced(true);
      clearCart();
      setSheet(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPayment = PAYMENT_METHODS.find((method) => method.id === payment);
  const sheetClassName = `${styles.sheetLayer} ${sheetClosing ? styles.sheetLayerClosing : ''}`;

  return (
    <>
      <div id="preloader" />
      <LegacyScripts />
      <Header />

      <main className={styles.page}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Checkout</span>
          </nav>

          {placed ? (
            <section className={styles.success} aria-live="polite">
              <div className={styles.successIcon} aria-hidden="true">
                <i className="fa fa-check" />
              </div>
              <h1 className={styles.successTitle}>Thank you for your order!</h1>
              {orderNumber && (
                <p style={{ margin: '8px 0', fontSize: '13px', color: '#1f6b52', fontWeight: 600 }}>
                  Order Reference: {orderNumber}
                </p>
              )}
              <p className={styles.successText}>
                {address?.name ? `Thanks, ${address.name.split(' ')[0]}. ` : ''}
                Your order has been placed successfully and will be delivered to your address.
              </p>
              <div className={styles.successSummary}>
                <span>Order total</span>
                <strong>{formatRupees(placedTotal)}</strong>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                {orderNumber && (
                  <a
                    href={`/track-order?q=${encodeURIComponent(orderNumber)}`}
                    className={styles.secondaryBtn}
                    style={{
                      background: '#1f6b52',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: 8,
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Track Order Live →
                  </a>
                )}
                <a href="/" className={styles.primaryBtn}>
                  Continue Shopping
                </a>
              </div>
            </section>
          ) : (
            <>
              <div className={styles.pageHead}>
                <h1 className={styles.title}>Checkout</h1>
                <p className={styles.subtitle}>
                  Complete your delivery and payment details to place your order.
                </p>
              </div>

              <div className={styles.layout}>
                <div className={styles.mainCol}>
                  <section className={styles.card} id="deliver-card" aria-labelledby="deliver-heading">
                    <div className={styles.cardHead}>
                      <span className={styles.step} aria-hidden="true">
                        1
                      </span>
                      <div>
                        <h2 id="deliver-heading">Deliver to</h2>
                        <p>Please complete your delivery info.</p>
                      </div>
                    </div>

                    {address && (!showAddressForm || isMobile) ? (
                      <div className={styles.addressSummary}>
                        <div className={styles.addressTop}>
                          <strong>{address.name}</strong>
                          <button
                            type="button"
                            className={styles.textBtn}
                            onClick={startAddressEdit}
                          >
                            Edit
                          </button>
                        </div>
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state}
                        </p>
                        <p>{address.phone}</p>
                        {address.shipping ? (
                          <p className={styles.summaryExtra}>
                            Ship to: {address.shipping.street}, {address.shipping.city},{' '}
                            {address.shipping.state}
                          </p>
                        ) : null}
                        {address.notes ? (
                          <p className={styles.summaryExtra}>Note: {address.notes}</p>
                        ) : null}
                      </div>
                    ) : null}

                    {!address && !showAddressForm ? (
                      <div className={styles.previewBlock}>
                        <p className={styles.previewText}>No address added yet.</p>
                        <button
                          type="button"
                          className={styles.actionLink}
                          onClick={startAddressEdit}
                        >
                          <i className="fa fa-plus" aria-hidden="true" /> Add Address
                        </button>
                      </div>
                    ) : null}

                    {!isMobile && showAddressForm ? (
                      <form className={styles.addressForm} onSubmit={handleAddressSubmit}>
                        <AddressFields
                          address={address}
                          shipToDifferent={shipToDifferent}
                          onShipToDifferentChange={setShipToDifferent}
                        />

                        <div className={styles.formActions}>
                          <button type="submit" className={styles.primaryBtn}>
                            <i className="fa fa-check" aria-hidden="true" /> Save Address
                          </button>
                          <button
                            type="button"
                            className={styles.ghostBtn}
                            onClick={cancelAddressEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : null}
                  </section>

                  <section className={styles.card} id="payment-card" aria-labelledby="payment-heading">
                    <div className={styles.cardHead}>
                      <span className={styles.step} aria-hidden="true">
                        2
                      </span>
                      <div>
                        <h2 id="payment-heading">Payment Method</h2>
                        <p>Choose how you would like to pay.</p>
                      </div>
                    </div>

                    {isMobile ? (
                      <div className={styles.previewBlock}>
                        {selectedPayment ? (
                          <p className={styles.previewText}>
                            <strong>{selectedPayment.title}</strong>
                            <span className={styles.previewMeta}>
                              {selectedPayment.description}
                            </span>
                          </p>
                        ) : (
                          <p className={styles.previewText}>Please select a payment method.</p>
                        )}
                        <button
                          type="button"
                          className={styles.actionLink}
                          onClick={() => openSheet('payment')}
                        >
                          {selectedPayment ? 'Change Payment' : 'Select Payment'}
                        </button>
                      </div>
                    ) : (
                      <>
                        <PaymentMethods payment={payment} onSelect={selectPayment} />

                        <button
                          type="button"
                          className={styles.primaryBtn}
                          onClick={() => selectPayment('cod')}
                          aria-pressed={payment === 'cod'}
                        >
                          {payment === 'cod' ? (
                            <>
                              <i className="fa fa-check" aria-hidden="true" /> Payment Selected
                            </>
                          ) : (
                            'Select Payment'
                          )}
                        </button>
                      </>
                    )}
                  </section>
                </div>

                <aside className={styles.summaryCol} aria-label="Order summary">
                  <section className={styles.card} aria-labelledby="amount-heading">
                    <div className={styles.cardHead}>
                      <span className={styles.step} aria-hidden="true">
                        3
                      </span>
                      <div>
                        <h2 id="amount-heading">Amount</h2>
                        <p>
                          {count} {count === 1 ? 'item' : 'items'} in your order.
                        </p>
                      </div>
                    </div>

                    <div className={styles.summaryRows}>
                      <div className={styles.summaryRow}>
                        <span>Item total</span>
                        <span>{formatRupees(subtotal)}</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span>Delivery fee</span>
                        <span>{formatRupees(deliveryFee)}</span>
                      </div>
                      <div className={styles.totalRow}>
                        <span>Total</span>
                        <span>{formatRupees(total)}</span>
                      </div>
                    </div>
                  </section>

                  <button
                    type="button"
                    className={styles.placeOrder}
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                  >
                    {submitting ? 'Placing Order…' : 'Place Order Now'}
                  </button>

                  {error ? (
                    <p className={styles.error} role="alert" aria-live="assertive">
                      <i className="fa fa-exclamation-circle" aria-hidden="true" /> {error}
                    </p>
                  ) : null}

                  <p className={styles.secureNote}>
                    <i className="fa fa-lock" aria-hidden="true" /> Secure checkout · Cash on
                    delivery available
                  </p>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      {isMobile && sheet === 'address' ? (
        <div className={sheetClassName} role="presentation" onClick={closeSheet}>
          <div
            ref={sheetRef}
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-sheet-title"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.sheetGrabber} aria-hidden="true" />
            <div className={styles.sheetHead}>
              <div>
                <h3 id="address-sheet-title">Delivery Details</h3>
                <p>Where should we deliver your order?</p>
              </div>
              <button
                type="button"
                className={styles.sheetClose}
                onClick={closeSheet}
                aria-label="Close delivery details"
              >
                &times;
              </button>
            </div>

            <form className={styles.sheetForm} onSubmit={handleAddressSubmit}>
              <div className={styles.sheetBody}>
                {error ? (
                  <p className={styles.sheetError} role="alert" aria-live="assertive">
                    <i className="fa fa-exclamation-circle" aria-hidden="true" /> {error}
                  </p>
                ) : null}

                <AddressFields
                  address={address}
                  shipToDifferent={shipToDifferent}
                  onShipToDifferentChange={setShipToDifferent}
                />
              </div>

              <div className={styles.sheetFooter}>
                <button type="submit" className={styles.primaryBtn}>
                  <i className="fa fa-check" aria-hidden="true" /> Save Address
                </button>
                <button type="button" className={styles.ghostBtn} onClick={cancelAddressEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isMobile && sheet === 'payment' ? (
        <div className={sheetClassName} role="presentation" onClick={closeSheet}>
          <div
            ref={sheetRef}
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-sheet-title"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.sheetGrabber} aria-hidden="true" />
            <div className={styles.sheetHead}>
              <div>
                <h3 id="payment-sheet-title">Payment Method</h3>
                <p>Choose how you would like to pay.</p>
              </div>
              <button
                type="button"
                className={styles.sheetClose}
                onClick={closeSheet}
                aria-label="Close payment methods"
              >
                &times;
              </button>
            </div>

            <div className={styles.sheetBody}>
              {error ? (
                <p className={styles.sheetError} role="alert" aria-live="assertive">
                  <i className="fa fa-exclamation-circle" aria-hidden="true" /> {error}
                </p>
              ) : null}

              <PaymentMethods payment={payment} onSelect={selectPayment} />

              <div className={styles.sheetTotal}>
                <span>Order total</span>
                <strong>{formatRupees(total)}</strong>
              </div>
            </div>

            <div className={styles.sheetFooter}>
              <button type="button" className={styles.primaryBtn} onClick={confirmPayment}>
                <i className="fa fa-check" aria-hidden="true" />{' '}
                {selectedPayment ? 'Save & Close' : 'Confirm Cash on Delivery'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
