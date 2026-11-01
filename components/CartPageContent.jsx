'use client';

/* eslint-disable @next/next/no-html-link-for-pages */
import { formatPrice } from '@/lib/products';
import { useCart } from '@/lib/cart';
import styles from './CartPageContent.module.css';

export default function CartPageContent() {
  const { items, count, subtotal, updateCartQuantity, removeFromCart, clearCart } = useCart();

  return (
    <main className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Cart</span>
        </nav>

        {items.length === 0 ? (
          <section className={styles.empty} aria-labelledby="empty-cart-heading">
            <span className={styles.emptyIcon} aria-hidden="true">
              <i className="fa fa-shopping-basket" />
            </span>
            <p className={styles.eyebrow}>Your cart</p>
            <h1 id="empty-cart-heading" className={styles.emptyTitle}>
              Your cart is empty
            </h1>
            <p className={styles.emptyText}>
              Looks like you have not added anything yet. Explore our scrubs and find your
              perfect fit.
            </p>
            <a href="/" className={styles.primaryButton}>
              Continue Shopping
            </a>
          </section>
        ) : (
          <>
            <header className={styles.pageHead}>
              <div>
                <p className={styles.eyebrow}>Your selection</p>
                <h1 className={styles.title}>Shopping Cart</h1>
                <p className={styles.subtitle}>
                  {count} {count === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
              <button type="button" className={styles.clearButton} onClick={clearCart}>
                Clear cart
              </button>
            </header>

            <div className={styles.layout}>
              <section className={styles.items} aria-label="Cart items">
                {items.map((item) => (
                  <article className={styles.item} key={item.id}>
                    <a className={styles.itemImage} href={`/products/${item.slug}`}>
                      <img src={item.image} alt={item.title} />
                    </a>

                    <div className={styles.itemBody}>
                      <span className={styles.itemMeta}>
                        {item.color} / {item.size}
                      </span>
                      <a className={styles.itemName} href={`/products/${item.slug}`}>
                        {item.title}
                      </a>
                      <span className={styles.itemPrice}>{formatPrice(item.price)}</span>

                      <div className={styles.itemActions}>
                        <div className={styles.quantity}>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.title}`}
                          >
                            <i className="fa fa-minus" aria-hidden="true" />
                          </button>
                          <span aria-live="polite">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 99}
                            aria-label={`Increase quantity of ${item.title}`}
                          >
                            <i className="fa fa-plus" aria-hidden="true" />
                          </button>
                        </div>

                        <button
                          type="button"
                          className={styles.removeButton}
                          onClick={() => removeFromCart(item.id)}
                        >
                          <i className="fa fa-trash-o" aria-hidden="true" /> Remove
                        </button>
                      </div>
                    </div>

                    <div className={styles.lineTotal}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </article>
                ))}

                <a href="/" className={styles.continueLink}>
                  <i className="fa fa-arrow-left" aria-hidden="true" /> Continue Shopping
                </a>
              </section>

              <aside className={styles.summary} aria-labelledby="summary-heading">
                <h2 id="summary-heading" className={styles.summaryTitle}>
                  Order Summary
                </h2>

                <div className={styles.summaryRows}>
                  <div className={styles.summaryRow}>
                    <span>
                      Subtotal ({count} {count === 1 ? 'item' : 'items'})
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Delivery</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <a href="/checkout" className={styles.checkoutButton}>
                  Proceed to Checkout
                </a>
                <a href="/" className={styles.secondaryButton}>
                  Continue Shopping
                </a>

                <p className={styles.note}>
                  <i className="fa fa-lock" aria-hidden="true" /> Secure checkout · Cash on
                  delivery available
                </p>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
