'use client';

/* eslint-disable @next/next/no-html-link-for-pages -- legacy theme scripts require full page loads */
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/products';
import styles from './Header.module.css';

export default function Header() {
  const { items, count, subtotal, removeFromCart } = useCart();

  return (
    <header>
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-sm-4 col-xs-12">
              <div className="header-top-left">
                <div className="logo">
                  <a href="/">
                    <img src="/img/logo.png" alt="" />
                  </a>
                </div>
                {" "}
                <div className="htl-title">
                  <span>We are open 9 am - 10pm</span>
                </div>
              </div>
            </div>
            {" "}
            <div className="col-md-7 col-sm-8 col-xs-12">
              <div className="header-top-right">
                <div className="htr-search">
                  <form action="#">
                    <div className="htr-search-content">
                      <input type="text" placeholder="Search here..." />
                      {" "}
                      <button>
                        <i className="fa fa-search"></i>
                      </button>
                    </div>
                  </form>
                </div>
                {" "}
                <div className="login-or-register">
                  <span id="login_register">Login or Register</span>
                  {" "}
                  <div className="login-register-content" id="login_register_content">
                    <div className="lrc-login">
                      <h4 className="lrc-title">My account</h4>
                      <div className="lrc-login-form">
                        <form action="#">
                          <div className="account-name">
                            <i className="fa fa-user"></i>
                            {" "}
                            <input type="text" placeholder="Account name" />
                          </div>
                          <div className="password">
                            <i className="fa fa-lock"></i>
                            {" "}
                            <input type="password" placeholder="Password" />
                          </div>
                          <div className="remember-help">
                            <input type="checkbox" />
                            {" "}
                            <label>remember me</label>
                            {" "}
                            <a href="#">Help ?</a>
                          </div>
                          <div className="lrc-submit">
                            <input className="hvr-bs" type="submit" value="Login" />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lrc-register">
                      <h4 className="lrc-title">Or register</h4>
                      <div className="lrc-register-form">
                        <form action="#">
                          <input type="text" placeholder="Your mail" />
                          {" "}
                          <input type="password" placeholder="Password" />
                          <div className="lrc-register-btn">
                            <input className="hvr-bs" type="submit" value="Register" />
                          </div>
                        </form>
                      </div>
                      <div className="or-register-to">
                        <span>or register to</span>
                        <ul>
                          <li>
                            <a href="#">
                              <i className="fa fa-facebook"></i>
                            </a>
                          </li>
                          {" "}
                          <li>
                            <a href="#">
                              <i className="fa fa-twitter"></i>
                            </a>
                          </li>
                          {" "}
                          <li>
                            <a href="#">
                              <i className="fa fa-instagram"></i>
                            </a>
                          </li>
                          {" "}
                          <li>
                            <a href="#">
                              <i className="fa fa-google"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {" "}
                <div className="top-checkout">
                  <a href="/checkout">Checkout</a>
                </div>
                {" "}
                <div className="top-cart">
                  <span id="top_cart">
                    <i className="fa fa-shopping-basket"></i>
                    Cart
                    {" "}
                    <span className="cart-number">({count})</span>
                  </span>
                  {" "}
                  <div className="my-cart" id="my_cart">
                    <div className="my-cart-products">
                      {items.length ? (
                        <>
                          {items.slice(0, 3).map((item) => (
                            <div className="single-mcp clearfix" key={item.id}>
                              <div className="single-mcp-img">
                                <a href={`/products/${item.slug}`}>
                                  <img src={item.image} alt={item.title} />
                                </a>
                              </div>
                              {" "}
                              <div className="single-mcp-content">
                                <a className="mcp-product-name" href={`/products/${item.slug}`}>
                                  {item.title}
                                </a>
                                <span className="mcp-pro-quantity">
                                  {item.quantity} x{" "}
                                  <span className="mcp-pro-price">{formatPrice(item.price)}</span>
                                </span>
                                <span className={styles.variant}>
                                  {item.color} / {item.size}
                                </span>
                              </div>
                              {" "}
                              <button
                                type="button"
                                className={`mcp-pro-delete ${styles.deleteButton}`}
                                onClick={() => removeFromCart(item.id)}
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
                        <p className={styles.empty}>Your cart is empty.</p>
                      )}
                    </div>
                    <div className="my-cart-total-cost">
                      <span>Total cost</span>
                      {" "}
                      <span className="cost">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="viewcart-checkout">
                      <a className="viewcart" href="/cart">View cart</a>
                      <a className="checkout" href="/checkout">Check out</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="menu-area hidden-sm hidden-xs">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="menu">
                <nav>
                  <ul className="menu-list">
                    <li className="active">
                      <a href="">HOME</a>
                      <ul className="menu-dropdown">
                        <li>
                          <a href="01_Home-Page.html">Home One</a>
                        </li>
                        <li>
                          <a href="02_Home-Page.html">Home Two</a>
                        </li>
                        <li>
                          <a href="03_Home-Page.html">Home Three</a>
                          <ul className="thirdlevel-menu">
                            <li>
                              <a href="#">Thirdlevel</a>
                            </li>
                            <li>
                              <a href="#">Thirdlevel</a>
                            </li>
                            <li>
                              <a href="#">Thirdlevel</a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    {" "}
                    <li>
                      <a href="#">ABOUT</a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">SHOP</a>
                      <div className="mega-menu-area">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mega-menu-part">
                              <div className="mega-menu-content">
                                <a className="mega-menu-title" href="#">Shop Women</a>
                                <ul>
                                  <li>
                                    <a href="#">Men’s Clothing</a>
                                  </li>
                                  <li>
                                    <a href="#">Tops</a>
                                  </li>
                                  <li className="special-collection">
                                    <a href="#">SUMMER CLOTH</a>
                                  </li>
                                  <li>
                                    <a href="#">T-Shirts</a>
                                  </li>
                                  <li>
                                    <a href="#">Lifestyle</a>
                                  </li>
                                  <li>
                                    <a href="#">Bras</a>
                                  </li>
                                </ul>
                              </div>
                              {" "}
                              <div className="mega-menu-img">
                                <img src="/img/mega-menu/menu1.jpg" alt="" />
                              </div>
                            </div>
                          </div>
                          {" "}
                          <div className="col-md-6">
                            <div className="mega-menu-part">
                              <div className="mega-menu-content">
                                <a className="mega-menu-title" href="#">Shop Girl</a>
                                <ul>
                                  <li>
                                    <a href="#">Men’s Clothing</a>
                                  </li>
                                  <li>
                                    <a href="#">Tops</a>
                                  </li>
                                  <li>
                                    <a href="#">T-Shirts</a>
                                  </li>
                                  <li>
                                    <a href="#">Lifestyle</a>
                                  </li>
                                  <li>
                                    <a href="#">Bras</a>
                                  </li>
                                </ul>
                              </div>
                              {" "}
                              <div className="mega-menu-img">
                                <img src="/img/mega-menu/menu2.jpg" alt="" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    {" "}
                    <li>
                      <a href="#">WOMEN</a>
                      <span className="hot">HOT</span>
                    </li>
                    {" "}
                    <li>
                      <a href="#">ACCESSORIES</a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">WATCHES</a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">BLOG</a>
                    </li>
                    {" "}
                    <li>
                      <a href="#">PAGES</a>
                      <ul className="menu-dropdown">
                        <li>
                          <a href="04_Shop-Grid-Left-Sidebar.html">Shop Left Sidebar</a>
                          <ul className="thirdlevel-menu">
                            <li>
                              <a href="05_Shop-Grid-Right-Sidebar.html">Shop Right Sidebar</a>
                            </li>
                            <li>
                              <a href="06_Shop-No-Sidebar-Fullwith.html">Shop No sidebar</a>
                            </li>
                            <li>
                              <a href="08_Simple-Single-Product.html">Simple Single Product</a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="/cart">Cart Page</a>
                          <ul className="thirdlevel-menu">
                            <li>
                              <a href="10_Checkout.html">Checkout</a>
                            </li>
                            <li>
                              <a href="11_Wishlist.html">Wishlist</a>
                            </li>
                            <li>
                              <a href="12_Order-Traker-page.html">Order Tracker</a>
                            </li>
                            <li>
                              <a href="13_My-Account.html">My Account</a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="14_About-Us.html">About Us</a>
                          <ul className="thirdlevel-menu">
                            <li>
                              <a href="15_NewsBlog.html">News Blog</a>
                            </li>
                            <li>
                              <a href="16_NewsBlog-Single-page.html">News Blog Single</a>
                            </li>
                            <li>
                              <a href="17_Contact-Us.html">Contact us</a>
                            </li>
                            <li>
                              <a href="18_Product-Comparison-Page.html">Product Comparison</a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="20_404-page.html">404</a>
                          <ul className="thirdlevel-menu">
                            <li>
                              <a href="21_Comming-Soon-Page.html">Coming Soon</a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            {" "}
            <div className="col-md-4">
              <div className="menu-area-right">
                <div className="my-account">
                  <a href="#">My Account</a>
                  <ul className="menu-right-dropdown">
                    <li>
                      <a href="#">Your Account</a>
                    </li>
                    <li>
                      <a href="#">His Account</a>
                    </li>
                    <li>
                      <a href="#">Her Account</a>
                    </li>
                  </ul>
                </div>
                {" "}
                <div className="currency">
                  <a href="#">USD</a>
                  <ul className="menu-right-dropdown">
                    <li>
                      <a href="#">GBP</a>
                    </li>
                    <li>
                      <a href="#">EUR</a>
                    </li>
                    <li>
                      <a href="#">CNY</a>
                    </li>
                  </ul>
                </div>
                {" "}
                <div className="language">
                  <a href="#">
                    <img src="/img/flag/english.png" alt="" />
                    English
                  </a>
                  <ul className="menu-right-dropdown">
                    <li>
                      <a href="#">
                        <img src="/img/flag/arabic.png" alt="" />
                        Arabic
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img src="/img/flag/chinese.png" alt="" />
                        Chinese
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img src="/img/flag/hibru.png" alt="" />
                        Hibru
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <img src="/img/flag/spanish.png" alt="" />
                        Spanish
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {" "}
      <div className="mobile-menu-area visible-xs visible-sm">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="mobile_menu">
                <nav id="mobile_menu_active">
                  <ul className="menu-list">
                    <li>
                      <a href="01_Home-Page.html">HOME</a>
                      <ul>
                        <li>
                          <a href="01_Home-Page.html">Home One</a>
                        </li>
                        <li>
                          <a href="02_Home-Page.html">Home Two</a>
                        </li>
                        <li>
                          <a href="03_Home-Page.html">Home Three</a>
                          <ul>
                            <li>
                              <a href="#">Thirdlevel</a>
                            </li>
                            <li>
                              <a href="#">Thirdlevel</a>
                            </li>
                            <li>
                              <a href="#">Thirdlevel</a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">ABOUT</a>
                    </li>
                    <li>
                      <a href="#">SHOP</a>
                      <ul>
                        <li>
                          <a href="#">Men’s Clothing</a>
                        </li>
                        <li>
                          <a href="#">Tops</a>
                        </li>
                        <li className="special-collection">
                          <a href="#">SUMMER CLOTH</a>
                        </li>
                        <li>
                          <a href="#">T-Shirts</a>
                        </li>
                        <li>
                          <a href="#">Lifestyle</a>
                        </li>
                        <li>
                          <a href="#">Bras</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">WOMEN</a>
                    </li>
                    <li>
                      <a href="#">ACCESSORIES</a>
                    </li>
                    <li>
                      <a href="#">WATCHES</a>
                    </li>
                    <li>
                      <a href="#">BLOG</a>
                    </li>
                    <li>
                      <a href="#">PAGES</a>
                      <ul>
                        <li>
                          <a href="04_Shop-Grid-Left-Sidebar.html">Shop Left Sidebar</a>
                          <ul>
                            <li>
                              <a href="05_Shop-Grid-Right-Sidebar.html">Shop Right Sidebar</a>
                            </li>
                            <li>
                              <a href="06_Shop-No-Sidebar-Fullwith.html">Shop No sidebar</a>
                            </li>
                            <li>
                              <a href="08_Simple-Single-Product.html">Simple Single Product</a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="/cart">Cart Page</a>
                          <ul>
                            <li>
                              <a href="10_Checkout.html">Checkout</a>
                            </li>
                            <li>
                              <a href="11_Wishlist.html">Wishlist</a>
                            </li>
                            <li>
                              <a href="12_Order-Traker-page.html">Order Tracker</a>
                            </li>
                            <li>
                              <a href="13_My-Account.html">My Account</a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="14_About-Us.html">About Us</a>
                          <ul>
                            <li>
                              <a href="15_NewsBlog.html">News Blog</a>
                            </li>
                            <li>
                              <a href="16_NewsBlog-Single-page.html">News Blog Single</a>
                            </li>
                            <li>
                              <a href="17_Contact-Us.html">Contact us</a>
                            </li>
                            <li>
                              <a href="18_Product-Comparison-Page.html">Product Comparison</a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="20_404-page.html">404</a>
                          <ul>
                            <li>
                              <a href="21_Comming-Soon-Page.html">Coming Soon</a>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {" "}
    </header>
  );
}
