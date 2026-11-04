'use client';

import React, { useState } from 'react';
import { useWishlist } from '@/lib/wishlist';
import { useCartStore } from '@/lib/cart';
import { useUiStore } from '@/lib/store/ui';
import { getProductBySlug } from '@/lib/products';

interface ProductCardActionsProps {
  slug: string;
  defaultTitle?: string;
  defaultPrice?: number;
  defaultImage?: string;
}

export default function ProductCardActions({
  slug,
  defaultTitle,
  defaultPrice,
  defaultImage,
}: ProductCardActionsProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const addItem = useCartStore((state) => state.addItem);
  const openQuickView = useUiStore((state) => state.openQuickView);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const favorited = isWishlisted(slug);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2200);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(slug);
    showToast(added ? 'Added to Wishlist ❤️' : 'Removed from Wishlist');
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const product = getProductBySlug(slug);
    const title = product?.title || defaultTitle || 'Medical Scrub Suit';
    const price = product?.price || defaultPrice || 3450;
    const compareAt = product?.compareAt || price;
    const image = product?.image || defaultImage || '/img/real-product-images/regal/regal-thumbnail.webp';
    const color = product?.colors?.[0]?.name || 'Standard';
    const size = product?.sizes?.[2] || product?.sizes?.[0] || 'M';

    addItem({
      slug,
      title,
      price,
      compareAt,
      image,
      color,
      size,
      quantity: 1,
    });

    showToast('Added to Cart! 🛍️');
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(slug);
  };

  return (
    <>
      <ul className="clearfix">
        {/* Wishlist Button */}
        <li>
          <a
            href="#"
            onClick={handleFavoriteClick}
            title={favorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
            style={{
              transition: 'all 0.2s',
              color: favorited ? '#e11d48' : undefined,
            }}
          >
            <i className={favorited ? 'fa fa-heart' : 'fa fa-heart-o'}></i>
          </a>
        </li>
        {' '}
        {/* Cart Button */}
        <li>
          <a
            href="#"
            onClick={handleAddToCartClick}
            title="Quick Add to Cart"
            aria-label="Add to Cart"
            style={{ transition: 'all 0.2s' }}
          >
            <i className="fa fa-shopping-bag"></i>
          </a>
        </li>
        {' '}
        {/* Quick View Button */}
        <li>
          <a
            href="#"
            onClick={handlePreviewClick}
            data-toggle="modal"
            data-target="#myModal"
            title="Quick View Product"
            aria-label="Quick View"
            style={{ transition: 'all 0.2s' }}
          >
            <i className="fa fa-eye"></i>
          </a>
        </li>
      </ul>

      {/* Instant Action Feedback Toast */}
      {toastMsg && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            background: 'rgba(19,27,46, 0.95)',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
            zIndex: 100,
            pointerEvents: 'none',
          }}
        >
          {toastMsg}
        </div>
      )}
    </>
  );
}
