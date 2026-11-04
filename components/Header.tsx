'use client';

/* eslint-disable @next/next/no-html-link-for-pages -- legacy theme scripts require full page loads */
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { formatPrice } from '@/lib/products';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const { items, count, subtotal, removeFromCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const favCount = wishlistItems.length;
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const isStaff = currentUser?.role === 'ADMIN' || currentUser?.role === 'EDITOR';

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (!target.closest('#top_cart_container')) {
        setCartOpen(false);
      }
      if (!target.closest('#account_container')) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  return (
    <header>
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-sm-4 col-xs-12">
              <div className="header-top-left" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div className="logo">
                  <a href="/">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/img/logo.png" alt="Medixa Pakistan" style={{ maxHeight: 44, width: 'auto' }} />
                  </a>
                </div>
                {' '}
                <div className="htl-title hidden-xs">
                  <span>Nationwide Delivery · 9 am - 9 pm</span>
                </div>

                {/* Mobile Menu Hamburger (Visible on small screens) */}
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Toggle navigation menu"
                  className="visible-xs visible-sm"
                  style={{
                    background: '#052263',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 700,
                  }}
                >
                  <i className="fa fa-bars"></i>
                  <span>MENU</span>
                </button>
              </div>
            </div>
            {' '}
            <div className="col-md-7 col-sm-8 col-xs-12">
              <div className="header-top-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 18 }}>
                {/* Search Bar */}
                <div className="htr-search" style={{ margin: 0, flex: '1 1 auto', maxWidth: 320 }}>
                  <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
                    <div className="htr-search-content" style={{ width: '100%' }}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search scrub suits, sizes, colors…"
                        style={{ width: '100%' }}
                      />
                      {' '}
                      <button type="submit" aria-label="Search">
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                  </form>
                </div>
                {' '}
                {/* Account / Persona */}
                <div className="login-or-register" id="account_container" style={{ position: 'relative', margin: 0 }}>
                  {currentUser ? (
                    <div
                      id="login_register"
                      onClick={() => {
                        setAccountOpen((prev) => !prev);
                        setCartOpen(false);
                      }}
                      style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        background: '#e9edf5',
                        padding: '3px 8px 3px 4px',
                        borderRadius: 24,
                        border: '1px solid #cbd3e6',
                      }}
                      title={currentUser.name}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: '#052263',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <i className={`fa fa-angle-${accountOpen ? 'up' : 'down'}`} style={{ fontSize: 11, color: '#052263' }} />
                    </div>
                  ) : (
                    <span
                      id="login_register"
                      onClick={() => {
                        setAccountOpen((prev) => !prev);
                        setCartOpen(false);
                      }}
                      style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: '#4b5563',
                        padding: '4px',
                      }}
                      title="Account & Orders"
                      aria-label="Account"
                    >
                      <i className="fa fa-user-circle-o" style={{ fontSize: 20 }} />
                    </span>
                  )}
                  {' '}
                  {accountOpen && (
                    <div
                      className="login-register-content"
                      id="login_register_content"
                      style={{ display: 'block', position: 'absolute', top: 40, right: 0, left: 'auto', zIndex: 100, minWidth: 260 }}
                    >
                      {currentUser ? (
                        <div className="lrc-login" style={{ padding: '16px' }}>
                          <div style={{ borderBottom: '1px solid #edf1f5', paddingBottom: 10, marginBottom: 12 }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#131b2e' }}>
                              {currentUser.name}
                            </div>
                            <div style={{ fontSize: 11, color: '#7b8998', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {currentUser.email}
                            </div>
                            {isStaff && (
                              <span style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4, marginTop: 4 }}>
                                {currentUser.role === 'ADMIN' ? 'ADMINISTRATOR' : 'SHOP MANAGER'}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <a
                              href="/account"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '9px 12px',
                                borderRadius: 6,
                                background: '#052263',
                                color: '#ffffff',
                                fontSize: 12,
                                fontWeight: 700,
                                textDecoration: 'none',
                              }}
                            >
                              <i className="fa fa-shopping-bag" />
                              <span>My Orders &amp; Tracking</span>
                            </a>

                            <a
                              href="/track-order"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 12px',
                                borderRadius: 6,
                                background: '#fafcfd',
                                color: '#43515f',
                                border: '1px solid #dbe3ea',
                                fontSize: 12,
                                fontWeight: 600,
                                textDecoration: 'none',
                              }}
                            >
                              <i className="fa fa-search" />
                              <span>Track Guest Order</span>
                            </a>

                            {isStaff && (
                              <a
                                href="/admin"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  padding: '8px 12px',
                                  borderRadius: 6,
                                  color: '#92400e',
                                  background: '#fef3c7',
                                  border: '1px solid #fde68a',
                                  fontSize: 12,
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                }}
                              >
                                <i className="fa fa-tachometer" />
                                <span>Admin Studio</span>
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const { authClient } = await import('@/lib/auth/client');
                                  await authClient.signOut();
                                  window.location.reload();
                                } catch {
                                  window.location.reload();
                                }
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '8px 12px',
                                borderRadius: 6,
                                color: '#dc2626',
                                background: 'transparent',
                                border: 'none',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'left',
                                width: '100%',
                                marginTop: 4,
                              }}
                            >
                              <i className="fa fa-sign-out" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="lrc-login">
                          <h4 className="lrc-title">Customer Portal</h4>
                          <div style={{ padding: '10px 0' }}>
                            <p style={{ fontSize: 12, color: '#687786', marginBottom: 14 }}>
                              Sign in to manage your medical scrub orders and saved addresses.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <a
                                href="/auth/sign-in?redirectTo=/account"
                                className="hvr-bs"
                                style={{
                                  display: 'block',
                                  textAlign: 'center',
                                  background: '#052263',
                                  color: '#ffffff',
                                  padding: '9px 16px',
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                }}
                              >
                                Sign In
                              </a>
                              <a
                                href="/auth/sign-up"
                                style={{
                                  display: 'block',
                                  textAlign: 'center',
                                  background: '#f1f5f8',
                                  color: '#052263',
                                  padding: '9px 16px',
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  textDecoration: 'none',
                                }}
                              >
                                Create Account
                              </a>
                              <a
                                href="/track-order"
                                style={{
                                  display: 'block',
                                  textAlign: 'center',
                                  background: '#fafcfd',
                                  color: '#43515f',
                                  border: '1px solid #dbe3ea',
                                  padding: '8px 16px',
                                  borderRadius: 8,
                                  fontSize: 12,
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  marginTop: 2,
                                }}
                              >
                                Track Your Order
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {' '}
                {/* Favourites Icon Link */}
                <div
                  className="header-favourite"
                  style={{
                    display: 'inline-block',
                    margin: 0,
                    verticalAlign: 'middle',
                  }}
                >
                  <a
                    href="/favourite"
                    title={`Favourites (${favCount})`}
                    aria-label="View Saved Favourites"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      color: favCount > 0 ? '#ff4c6b' : '#4b5563',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      transition: 'color 0.2s',
                    }}
                  >
                    <i
                      className={favCount > 0 ? 'fa fa-heart' : 'fa fa-heart-o'}
                      style={{ fontSize: 18 }}
                    />
                    {favCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -8,
                          background: '#ff4c6b',
                          color: '#ffffff',
                          borderRadius: '50%',
                          minWidth: 16,
                          height: 16,
                          fontSize: 9,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                          padding: '0 3px',
                        }}
                      >
                        {favCount}
                      </span>
                    )}
                  </a>
                </div>
                {' '}
                {/* Cart Trigger */}
                <div className="top-cart" id="top_cart_container" style={{ position: 'relative', margin: 0 }}>
                  <div
                    className="top-cart-title"
                    id="my_cart_title"
                    onClick={() => {
                      setCartOpen((prev) => !prev);
                      setAccountOpen(false);
                    }}
                    style={{
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      userSelect: 'none',
                      color: '#052263',
                      padding: '4px',
                    }}
                    title={`Shopping Cart (${count} ${count === 1 ? 'item' : 'items'})`}
                    aria-label="Shopping Cart"
                  >
                    <i className="fa fa-shopping-cart" style={{ fontSize: 20 }}></i>
                    {count > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -8,
                          background: '#052263',
                          color: '#ffffff',
                          borderRadius: '50%',
                          minWidth: 16,
                          height: 16,
                          fontSize: 9,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1,
                          padding: '0 3px',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                  {' '}
                  {cartOpen && (
                    <div
                      className="my-cart"
                      id="my_cart_popup"
                      style={{
                        display: 'block',
                        position: 'absolute',
                        right: 0,
                        top: 40,
                        zIndex: 100,
                      }}
                    >
                      <div className="my-cart-popup-content">
                        {items.length > 0 ? (
                          <>
                            {items.slice(0, 3).map((item) => (
                              <div key={item.id} className="single-mcp">
                                <div className="mcp-img">
                                  <a href={`/products/${item.slug}`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.image} alt={item.title} />
                                  </a>
                                </div>
                                <div className="mcp-content">
                                  <a className="mcp-title" href={`/products/${item.slug}`}>
                                    {item.title}
                                  </a>
                                  <span className="mcp-qty">
                                    {item.quantity} x <span className="mcp-price">{formatPrice(item.price)}</span>
                                  </span>
                                  <span className={styles.variant}>
                                    {item.color} / {item.size}
                                  </span>
                                </div>
                                {' '}
                                <button
                                  type="button"
                                  className={`mcp-pro-delete ${styles.deleteButton}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item.id);
                                  }}
                                  aria-label={`Remove ${item.title} from cart`}
                                  title="Remove from cart"
                                >
                                  <i className="fa fa-times"></i>
                                </button>
                              </div>
                            ))}
                            {items.length > 3 ? (
                              <p className={styles.more}>+ {items.length - 3} more item(s)</p>
                            ) : null}
                          </>
                        ) : (
                          <p className={styles.empty}>Your medical scrubs cart is empty.</p>
                        )}
                      </div>
                      <div className="my-cart-total-cost">
                        <span>Total cost</span>
                        {' '}
                        <span className="cost">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="viewcart-checkout">
                        <a className="viewcart" href="/cart">View cart</a>
                        <a className="checkout" href="/checkout">Check out</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Desktop Navigation Menu */}
      <div className="menu-area hidden-sm hidden-xs">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="menu">
                <nav>
                  <ul className="menu-list">
                    <li>
                      <a href="/">HOME</a>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop?category=Men">MEN&apos;S SCRUBS</a>
                      <ul className="menu-dropdown">
                        <li>
                          <a href="/products/regal-round-neck-male-medical-scrubs-pakistan">Regal Scrub Suits (Round Neck)</a>
                        </li>
                        <li>
                          <a href="/products/forte-v-neck-male-medical-scrubs-pakistan">Forte Scrub Suits (V-Neck)</a>
                        </li>
                        <li>
                          <a href="/shop?category=Men">All Men&apos;s Scrubs</a>
                        </li>
                      </ul>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop?category=Women">WOMEN&apos;S SCRUBS</a>
                      <span className="hot">POPULAR</span>
                      <ul className="menu-dropdown">
                        <li>
                          <a href="/products/muse-v-neck-female-medical-scrubs-pakistan">Muse Scrub Suits (V-Neck)</a>
                        </li>
                        <li>
                          <a href="/products/rebel-collar-neck-female-medical-scrubs-pakistan">Rebel Scrub Suits (Collar Neck)</a>
                        </li>
                        <li>
                          <a href="/shop?category=Women">All Women&apos;s Scrubs</a>
                        </li>
                      </ul>
                    </li>
                    {' '}
                    <li>
                      <a href="/shop">COLLECTIONS</a>
                      <div className="mega-menu-area">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mega-menu-part">
                              <div className="mega-menu-content">
                                <a className="mega-menu-title" href="/shop?category=Men">Men&apos;s Lineup</a>
                                <ul>
                                  <li>
                                    <a href="/products/regal-round-neck-male-medical-scrubs-pakistan">Regal Tailored Scrubs</a>
                                  </li>
                                  <li>
                                    <a href="/products/forte-v-neck-male-medical-scrubs-pakistan">Forte Active V-Neck</a>
                                  </li>
                                  <li>
                                    <a href="/shop?category=Men">All Men&apos;s Medical Apparel</a>
                                  </li>
                                  <li className="special-collection">
                                    <a href="/shop">ZERO-FADING GUARANTEE</a>
                                  </li>
                                </ul>
                              </div>
                              {' '}
                              <div className="mega-menu-img">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/img/real-product-images/regal/regal-thumbnail.webp" alt="Men's Scrubs" style={{ maxHeight: 180, width: 'auto', objectFit: 'cover' }} />
                              </div>
                            </div>
                          </div>
                          {' '}
                          <div className="col-md-6">
                            <div className="mega-menu-part">
                              <div className="mega-menu-content">
                                <a className="mega-menu-title" href="/shop?category=Women">Women&apos;s Lineup</a>
                                <ul>
                                  <li>
                                    <a href="/products/muse-v-neck-female-medical-scrubs-pakistan">Muse Tailored Silhouette</a>
                                  </li>
                                  <li>
                                    <a href="/products/rebel-collar-neck-female-medical-scrubs-pakistan">Rebel Collar &amp; V-Neck</a>
                                  </li>
                                  <li>
                                    <a href="/shop?category=Women">All Women&apos;s Medical Apparel</a>
                                  </li>
                                  <li className="special-collection">
                                    <a href="/shop">4-WAY ERGONOMIC STRETCH</a>
                                  </li>
                                </ul>
                              </div>
                              {' '}
                              <div className="mega-menu-img">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/img/real-product-images/muse/muse-thumbnail.webp" alt="Women's Scrubs" style={{ maxHeight: 180, width: 'auto', objectFit: 'cover' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    {/* <li>
                      <a href="/track-order">TRACK ORDER</a>
                    </li> */}
                    {/* <li>
                      <a href="/size-guide">SIZE GUIDE</a>
                    </li> */}
                    {/* <li>
                      <a href="/blog">JOURNAL</a>
                    </li> */}
                    {/* <li>
                      <a href="/about">ABOUT</a>
                    </li> */}
                    <li>
                      <a href="/contact">CONTACT</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            {' '}
            <div className="col-md-3">
              <div className="menu-area-right">
                <div className="currency">
                  <a href="#">PKR (Rs)</a>
                </div>
                {' '}
                <div className="my-account">
                  <a href="/auth/sign-in">Login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="mobile-menu-area visible-xs visible-sm">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="mobile_menu">
                <nav id="mobile_menu_active">
                  <ul className="menu-list">
                    <li>
                      <a href="/">HOME</a>
                    </li>
                    <li>
                      <a href="/shop?category=Men">MEN&apos;S SCRUBS</a>
                      <ul>
                        <li><a href="/products/regal-round-neck-male-medical-scrubs-pakistan">Regal Scrub Suits</a></li>
                        <li><a href="/products/forte-v-neck-male-medical-scrubs-pakistan">Forte V-Neck Scrubs</a></li>
                        <li><a href="/shop?category=Men">All Men&apos;s Scrubs</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="/shop?category=Women">WOMEN&apos;S SCRUBS</a>
                      <ul>
                        <li><a href="/products/muse-v-neck-female-medical-scrubs-pakistan">Muse Scrub Suits</a></li>
                        <li><a href="/products/rebel-collar-neck-female-medical-scrubs-pakistan">Rebel Scrub Suits</a></li>
                        <li><a href="/shop?category=Women">All Women&apos;s Scrubs</a></li>
                      </ul>
                    </li>
                    <li>
                      <a href="/shop">ALL SCRUB COLLECTIONS</a>
                    </li>
                    <li>
                      <a href="/track-order">TRACK YOUR ORDER</a>
                    </li>
                    <li>
                      <a href="/size-guide">SIZE CHART & GUIDE</a>
                    </li>
                    <li>
                      <a href="/blog">CLINICAL JOURNAL</a>
                    </li>
                    <li>
                      <a href="/about">ABOUT MEDIXA</a>
                    </li>
                    <li>
                      <a href="/contact">CONTACT & WHATSAPP</a>
                    </li>
                    <li>
                      <a href="/favourite">MY FAVOURITES</a>
                    </li>
                    <li>
                      <a href="/cart">MY CART ({count})</a>
                    </li>
                    <li>
                      <a href="/auth/sign-in">MY ACCOUNT</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Interactive Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
          }}
        >
          {/* Dimmed backdrop */}
          <div
            onClick={() => setMobileNavOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(19,27,46, 0.65)',
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* Sliding panel */}
          <div
            style={{
              position: 'relative',
              width: '85%',
              maxWidth: 360,
              background: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
              overflowY: 'auto',
              zIndex: 1,
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                borderBottom: '1px solid #eef1f4',
                background: '#fafcfd',
              }}
            >
              <a href="/" onClick={() => setMobileNavOpen(false)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/logo.png" alt="Medixa" style={{ maxHeight: 36, width: 'auto' }} />
              </a>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close Menu"
                style={{
                  background: '#e9edf5',
                  color: '#131b2e',
                  border: 'none',
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Mobile Search */}
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #eef1f4' }}>
              <form
                onSubmit={(e) => {
                  setMobileNavOpen(false);
                  handleSearchSubmit(e);
                }}
              >
                <div style={{ display: 'flex', borderRadius: 8, border: '1px solid #dbe4eb', overflow: 'hidden' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search scrub suits..."
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '10px 12px',
                      fontSize: 12,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    style={{
                      background: '#052263',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0 14px',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </form>
            </div>

            {/* Navigation Links */}
            <div style={{ flex: 1, padding: '12px 18px', overflowY: 'auto' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <li>
                  <a
                    href="/"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'block', padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#131b2e', textDecoration: 'none' }}
                  >
                    🏠 Home
                  </a>
                </li>
                <li>
                  <a
                    href="/shop?category=Men"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'block', padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#131b2e', textDecoration: 'none' }}
                  >
                    🩺 Men&apos;s Scrubs (Regal &amp; Forte)
                  </a>
                </li>
                <li>
                  <a
                    href="/shop?category=Women"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'block', padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#131b2e', textDecoration: 'none' }}
                  >
                    👩‍⚕️ Women&apos;s Scrubs (Muse &amp; Rebel)
                  </a>
                </li>
                <li>
                  <a
                    href="/shop"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'block', padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#131b2e', textDecoration: 'none' }}
                  >
                    ✨ All Collections
                  </a>
                </li>
                <li style={{ borderTop: '1px solid #f0f4f2', margin: '6px 0' }} />
                <li>
                  <a
                    href="/track-order"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'block', padding: '8px 0', fontSize: 13, fontWeight: 600, color: '#43515f', textDecoration: 'none' }}
                  >
                    📦 Track Your Order
                  </a>
                </li>
                <li>
                  <a
                    href="/size-guide"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'block', padding: '8px 0', fontSize: 13, fontWeight: 600, color: '#43515f', textDecoration: 'none' }}
                  >
                    📏 Size Guide &amp; Chart
                  </a>
                </li>
                <li>
                  <a
                    href="/blog"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'block', padding: '8px 0', fontSize: 13, fontWeight: 600, color: '#43515f', textDecoration: 'none' }}
                  >
                    📖 Clinical Journal
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'block', padding: '8px 0', fontSize: 13, fontWeight: 600, color: '#43515f', textDecoration: 'none' }}
                  >
                    🏢 About Medixa
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'block', padding: '8px 0', fontSize: 13, fontWeight: 600, color: '#43515f', textDecoration: 'none' }}
                  >
                    📞 Contact Us
                  </a>
                </li>
                <li style={{ borderTop: '1px solid #f0f4f2', margin: '6px 0' }} />
                <li>
                  <a
                    href="/favourite"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#ff4c6b', textDecoration: 'none' }}
                  >
                    <span>❤️ My Favourites</span>
                    {favCount > 0 && (
                      <span style={{ background: '#ff4c6b', color: '#fff', borderRadius: 10, padding: '2px 8px', fontSize: 11 }}>
                        {favCount}
                      </span>
                    )}
                  </a>
                </li>
                <li>
                  <a
                    href="/cart"
                    onClick={() => setMobileNavOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#052263', textDecoration: 'none' }}
                  >
                    <span>🛍️ My Cart</span>
                    <span style={{ background: '#052263', color: '#fff', borderRadius: 10, padding: '2px 8px', fontSize: 11 }}>
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={currentUser ? '/account' : '/auth/sign-in'}
                    onClick={() => setMobileNavOpen(false)}
                    style={{
                      display: 'block',
                      padding: '10px 0',
                      fontSize: 13,
                      fontWeight: 700,
                      color: currentUser ? '#052263' : '#43515f',
                      textDecoration: 'none',
                    }}
                  >
                    👤 {currentUser ? `Hi, ${currentUser.name.split(' ')[0]} (My Account & Tracking)` : 'Account / Sign In'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick WhatsApp Support Bar */}
            <div style={{ padding: '14px 18px', borderTop: '1px solid #eef1f4', background: '#fafcfd' }}>
              <a
                href="https://wa.me/923435114065"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: '#25D366',
                  color: '#ffffff',
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <i className="fa fa-whatsapp" style={{ fontSize: 16 }}></i>
                WhatsApp Sizing &amp; Support
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
