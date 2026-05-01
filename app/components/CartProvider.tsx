"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  style: string;
  description: string;
  image?: string;
  extraImages?: string[];
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  shape: string;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, shape: string, size: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// For backward compatibility while components mount if they don't eagerly use the hook
export const products: Product[] = [];

export function useProducts() {
  const [productData, setProductData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("HTTP error " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        setProductData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProductData([]);
        setLoading(false);
      });
  }, []);

  return { products: productData, loading };
}

// ─── localStorage helpers ───────────────────────────────────────────────────

const STORAGE_KEY = "nail_me_amore_cart";

function saveToLocalStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Silently fail — localStorage may be full or unavailable
  }
}

function loadFromLocalStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Silently fail
  }
  return [];
}

// ─── Cart Provider ──────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSyncing = useRef(false);

  // ─── Initialize: load from localStorage, then fetch from server ───────
  useEffect(() => {
    const localItems = loadFromLocalStorage();

    // Fetch server-side cart
    fetch("/api/cart", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const serverItems: CartItem[] = (data.items || []).map((item: any) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          category: "",
          style: "",
          description: "",
          image: item.imageUrl || undefined,
          cartItemId: `${item.productId}-${item.shape}-${item.size}`,
          quantity: item.quantity,
          shape: item.shape,
          size: item.size,
        }));

        // Merge: server items take priority, then add local-only items
        const merged = [...serverItems];
        for (const localItem of localItems) {
          if (!merged.find((m) => m.cartItemId === localItem.cartItemId)) {
            merged.push(localItem);
          }
        }

        setItems(merged);
        setInitialized(true);

        // Save merged result
        if (merged.length > 0) {
          saveToLocalStorage(merged);
        }
      })
      .catch(() => {
        // Fallback to localStorage only
        if (localItems.length > 0) {
          setItems(localItems);
        }
        setInitialized(true);
      });
  }, []);

  // ─── Debounced sync to server (2 seconds of inactivity) ───────────────
  const syncToServer = useCallback((cartItems: CartItem[]) => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              productId: item.id,
              name: item.name,
              price: item.price,
              imageUrl: item.image || null,
              shape: item.shape,
              size: item.size,
              quantity: item.quantity,
            })),
          }),
        });
      } catch (err) {
        console.error("Failed to sync cart:", err);
      } finally {
        isSyncing.current = false;
      }
    }, 2000);
  }, []);

  // ─── Persist on every change (after initialization) ───────────────────
  useEffect(() => {
    if (!initialized) return;
    saveToLocalStorage(items);
    syncToServer(items);
  }, [items, initialized, syncToServer]);

  // ─── Cart operations ──────────────────────────────────────────────────

  const addToCart = useCallback((product: Product, shape: string, size: string, quantity: number = 1) => {
    setItems((prev) => {
      const cartItemId = `${product.id}-${shape}-${size}`;
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, cartItemId, shape, size, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
