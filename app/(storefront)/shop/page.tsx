'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice, products as defaultProducts, type Product } from '@/lib/products';
import { useCart } from '@/lib/cart';

function ShopContent() {
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get('category');
  const paramSearch = searchParams.get('search');

  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);
  const [localCategory, setLocalCategory] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState<string | null>(null);
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');

  const category = localCategory ?? (paramCategory || 'ALL');
  const setCategory = (cat: string) => setLocalCategory(cat);

  const search = localSearch ?? (paramSearch || '');
  const setSearch = (q: string) => setLocalSearch(q);

  const { addToCart } = useCart();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!ignore && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== 'ALL') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q),
      );
    }

    if (selectedColor !== 'ALL') {
      list = list.filter((p) => p.colors?.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase()));
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return list;
  }, [products, category, search, selectedColor, sort]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors?.forEach((c) => set.add(c.name)));
    return Array.from(set);
  }, [products]);

  const handleQuickAdd = (product: Product) => {
    addToCart({
      id: `${product.slug}-default`,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: product.sizes?.[2] || 'M',
      color: product.colors?.[0]?.name || 'Standard',
    });
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 2000);
  };

  return (
    <>
      <Header />

      {/* Breadcrumb Area */}
      <div className="breadcrumbs-area" style={{ background: '#f6f9fb', padding: '30px 0', borderBottom: '1px solid #e7ecf0' }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <div className="breadcrumbs">
                <h1 style={{ fontSize: 24, fontWeight: 700, color: '#131b2e', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Medical Scrubs Catalog
                </h1>
                <ul className="breadcrumbs-list" style={{ marginTop: 8, display: 'flex', gap: 8, fontSize: 13, color: '#7b8997', listStyle: 'none', padding: 0 }}>
                  <li>
                    <Link href="/" style={{ color: '#052263', textDecoration: 'none' }}>Home</Link>
                  </li>
                  <li>/</li>
                  <li>Shop</li>
                  {category !== 'ALL' && (
                    <>
                      <li>/</li>
                      <li style={{ color: '#131b2e', fontWeight: 600 }}>{category}&apos;s Scrubs</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Body */}
      <div className="shop-main-area" style={{ padding: '50px 0 80px' }}>
        <div className="container">
          <div className="row">
            {/* Sidebar Filters */}
            <div className="col-md-3 col-sm-4 col-xs-12">
              <div className="shop-sidebar" style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #e7ecf0', padding: '24px 20px', marginBottom: 30 }}>
                {/* Search */}
                <div style={{ marginBottom: 28 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#131b2e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    Search Scrubs
                  </h4>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Title, style or SKU…"
                      style={{
                        width: '100%',
                        height: 40,
                        borderRadius: 10,
                        border: '1px solid #dbe2e9',
                        padding: '0 12px',
                        fontSize: 13,
                        outline: 'none',
                        background: '#fafcfd',
                      }}
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', color: '#99a5af', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div style={{ marginBottom: 28 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: '#131b2e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
                    Categories
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'All Collections', value: 'ALL' },
                      { label: "Men's Medical Scrubs", value: 'Men' },
                      { label: "Women's Medical Scrubs", value: 'Women' },
                      { label: 'Unisex & Lab Coats', value: 'Unisex' },
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        style={{
                          textAlign: 'left',
                          background: category === cat.value ? '#e9ecf4' : 'transparent',
                          color: category === cat.value ? '#052263' : '#52626f',
                          fontWeight: category === cat.value ? 700 : 500,
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 13,
                          transition: 'all 0.2s',
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Swatch Filters */}
                {allColors.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#131b2e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                      Filter by Color
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => setSelectedColor('ALL')}
                        style={{
                          fontSize: 11,
                          padding: '4px 10px',
                          borderRadius: 20,
                          border: selectedColor === 'ALL' ? '1px solid #052263' : '1px solid #dee6ed',
                          background: selectedColor === 'ALL' ? '#052263' : '#ffffff',
                          color: selectedColor === 'ALL' ? '#ffffff' : '#496058',
                          cursor: 'pointer',
                        }}
                      >
                        All Colors
                      </button>
                      {allColors.map((clr) => (
                        <button
                          key={clr}
                          type="button"
                          onClick={() => setSelectedColor(clr)}
                          style={{
                            fontSize: 11,
                            padding: '4px 10px',
                            borderRadius: 20,
                            border: selectedColor === clr ? '1px solid #052263' : '1px solid #dee6ed',
                            background: selectedColor === clr ? '#052263' : '#ffffff',
                            color: selectedColor === clr ? '#ffffff' : '#496058',
                            cursor: 'pointer',
                          }}
                        >
                          {clr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assurance Card */}
                <div style={{ background: '#f5f6fa', borderRadius: 12, padding: 16, marginTop: 24, border: '1px solid #e5e8f1' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#131b2e' }}>★ Zero Fading Guarantee</p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#687786', lineHeight: 1.5 }}>
                    International vat dyeing ensures scrubs never fade over 100+ hospital washes.
                  </p>
                </div>
              </div>
            </div>

            {/* Product Grid Area */}
            <div className="col-md-9 col-sm-8 col-xs-12">
              {/* Top Controls Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#ffffff',
                  border: '1px solid #e7ecf0',
                  borderRadius: 14,
                  padding: '14px 20px',
                  marginBottom: 24,
                }}
              >
                <div style={{ fontSize: 13, color: '#61717f' }}>
                  Showing <strong style={{ color: '#131b2e' }}>{filtered.length}</strong> medical apparel items
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label htmlFor="shop-sort" style={{ fontSize: 12, fontWeight: 600, color: '#4d635a', margin: 0 }}>
                    Sort by:
                  </label>
                  <select
                    id="shop-sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    style={{
                      height: 36,
                      borderRadius: 8,
                      border: '1px solid #dbe2e9',
                      padding: '0 10px',
                      fontSize: 12,
                      background: '#fafcfd',
                      color: '#131b2e',
                      outline: 'none',
                    }}
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Products List */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#7a8896' }}>
                  <p>Loading Medixa catalog…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: 16, border: '1px solid #e7ecf0' }}>
                  <h3 style={{ fontSize: 18, color: '#131b2e', fontWeight: 700, margin: '0 0 8px' }}>No scrubs match your filter</h3>
                  <p style={{ color: '#7a8896', fontSize: 13, margin: '0 0 20px' }}>Try resetting your category or search keywords.</p>
                  <button
                    onClick={() => {
                      setCategory('ALL');
                      setSearch('');
                      setSelectedColor('ALL');
                    }}
                    style={{
                      background: '#052263',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px 20px',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="row">
                  {filtered.map((product) => (
                    <div key={product.slug} className="col-md-4 col-sm-6 col-xs-12" style={{ marginBottom: 30 }}>
                      <div
                        style={{
                          background: '#ffffff',
                          borderRadius: 16,
                          border: '1px solid #e7ecf0',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          height: '100%',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                      >
                        {/* Image Container */}
                        <div style={{ position: 'relative', aspectRatio: '3/4', background: '#f2f5f8', overflow: 'hidden' }}>
                          <Link href={`/products/${product.slug}`} style={{ display: 'block', height: '100%' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Link>

                          {/* Category Tag */}
                          <span
                            style={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                              background: 'rgba(19,27,46, 0.85)',
                              color: '#ffffff',
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                              padding: '4px 8px',
                              borderRadius: 6,
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            {product.category}&apos;s Scrubs
                          </span>

                          {product.compareAt && product.compareAt > product.price && (
                            <span
                              style={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                background: '#e04f67',
                                color: '#ffffff',
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '4px 8px',
                                borderRadius: 6,
                              }}
                            >
                              SALE
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div style={{ padding: '14px 14px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ fontSize: 11, color: '#7a8896', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {product.collection}
                          </div>
                          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#131b2e', margin: '4px 0', lineHeight: 1.3 }}>
                            <Link href={`/products/${product.slug}`} style={{ color: '#131b2e', textDecoration: 'none' }}>
                              {product.title}
                            </Link>
                          </h3>
                          <p style={{ fontSize: 12, color: '#73867f', margin: '0 0 8px', lineHeight: 1.4, flex: 1 }}>
                            {product.subtitle}
                          </p>

                          {/* Color Swatches preview */}
                          {product.colors && product.colors.length > 0 && (
                            <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                              {product.colors.map((c) => (
                                <span
                                  key={c.name}
                                  title={c.name}
                                  style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: '50%',
                                    backgroundColor: c.value,
                                    border: '1px solid rgba(0,0,0,0.15)',
                                    display: 'inline-block',
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          {/* Price & Action */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, marginTop: 'auto', borderTop: '1px solid #edf1f5' }}>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 800, color: '#052263', lineHeight: 1.2 }}>
                                {formatPrice(product.price)}
                              </div>
                              {product.compareAt ? (
                                <div style={{ fontSize: 11, color: '#9aa6b0', textDecoration: 'line-through', lineHeight: 1.2 }}>
                                  {formatPrice(product.compareAt)}
                                </div>
                              ) : null}
                            </div>

                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <Link
                                href={`/products/${product.slug}`}
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: '#052263',
                                  background: '#eff2f9',
                                  height: 30,
                                  padding: '0 12px',
                                  borderRadius: 6,
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  lineHeight: 1,
                                  boxSizing: 'border-box',
                                  transition: 'background 0.15s',
                                }}
                              >
                                View
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleQuickAdd(product)}
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: '#ffffff',
                                  background: addedSlug === product.slug ? '#052263' : '#131b2e',
                                  border: 'none',
                                  height: 30,
                                  padding: '0 12px',
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  lineHeight: 1,
                                  boxSizing: 'border-box',
                                  transition: 'background 0.2s',
                                }}
                              >
                                {addedSlug === product.slug ? 'Added ✓' : '+ Cart'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px 0' }}>Loading Medixa Shop…</div>}>
      <ShopContent />
    </Suspense>
  );
}
