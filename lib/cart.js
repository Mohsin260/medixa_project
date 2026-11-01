'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'medixa-cart';
const EMPTY_CART = [];
let cartSnapshot = null;
const listeners = new Set();
let storageBound = false;

const isBrowser = () => typeof window !== 'undefined';

const buildItemId = (slug, color, size) => `${slug}::${color || ''}::${size || ''}`;

function sanitizeItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const { slug, title, image, color, size } = item;
  const price = Number(item.price);
  const compareAt = Number(item.compareAt);
  const quantity = Number(item.quantity ?? 1);

  if (typeof slug !== 'string' || !slug) return null;
  if (typeof title !== 'string' || !title) return null;
  if (typeof image !== 'string' || !image) return null;
  if (!Number.isFinite(price) || price < 0) return null;
  if (!Number.isFinite(quantity) || quantity < 1) return null;

  return {
    id: item.id || buildItemId(slug, color, size),
    slug,
    title,
    image,
    price,
    compareAt: Number.isFinite(compareAt) ? compareAt : price,
    color: typeof color === 'string' ? color : '',
    size: typeof size === 'string' ? size : '',
    quantity: Math.min(99, Math.floor(quantity)),
  };
}

function readStoredCart() {
  if (!isBrowser()) {
    return EMPTY_CART;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return EMPTY_CART;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return EMPTY_CART;
    }
    const items = parsed.map(sanitizeItem).filter(Boolean);
    return items.length ? items : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function getCartSnapshot() {
  if (cartSnapshot === null) {
    cartSnapshot = readStoredCart();
  }
  return cartSnapshot;
}

function saveCart(items) {
  cartSnapshot = items.length ? items : EMPTY_CART;

  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartSnapshot));
    } catch (error) {
      void error;
    }
  }

  listeners.forEach((listener) => listener());
}

function handleStorageChange(event) {
  if (event.key !== STORAGE_KEY) {
    return;
  }
  cartSnapshot = readStoredCart();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener) {
  listeners.add(listener);

  if (isBrowser() && !storageBound) {
    window.addEventListener('storage', handleStorageChange);
    storageBound = true;
  }

  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot() {
  return getCartSnapshot();
}

export function getServerSnapshot() {
  return EMPTY_CART;
}

export function addToCart(item) {
  const cleanItem = sanitizeItem(item);
  if (!cleanItem) {
    return;
  }

  const current = getCartSnapshot();
  const existing = current.find((cartItem) => cartItem.id === cleanItem.id);

  if (existing) {
    saveCart(
      current.map((cartItem) =>
        cartItem.id === cleanItem.id
          ? {
              ...cartItem,
              quantity: Math.min(99, cartItem.quantity + cleanItem.quantity),
            }
          : cartItem,
      ),
    );
    return;
  }

  saveCart([...current, cleanItem]);
}

export function removeFromCart(id) {
  saveCart(getCartSnapshot().filter((item) => item.id !== id));
}

export function updateCartQuantity(id, quantity) {
  const nextQuantity = Number(quantity);
  if (!Number.isFinite(nextQuantity)) {
    return;
  }

  if (nextQuantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart(
    getCartSnapshot().map((item) =>
      item.id === id
        ? { ...item, quantity: Math.min(99, Math.floor(nextQuantity)) }
        : item,
    ),
  );
}

export function clearCart() {
  saveCart([]);
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return {
    items,
    count,
    subtotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  };
}
