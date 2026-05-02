"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";

export interface CartItem {
  id: string;
  name: string;

  // ❗ keep only number internally
  price: number;

  image: string;
  category?: string;
  size?: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;

  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQty: (id: string, size: string | undefined, delta: number) => void;

  totalItems: number;
  totalPrice: number;

  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "ld_cart";

// ✅ Safe + SSR-friendly loader
function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ✅ Lazy init (NO useEffect hydration)
  const [items, setItems] = useState<CartItem[]>(getInitialCart);
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // optionally log
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === newItem.id && i.size === newItem.size
      );

      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id && i.size === newItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...newItem, quantity: 1 }];
    });

    // open cart on add
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string, size?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size))
    );
  }, []);

  const updateQty = useCallback(
    (id: string, size: string | undefined, delta: number) => {
      setItems((prev) =>
        prev
          .map((i) =>
            i.id === id && i.size === size
              ? { ...i, quantity: Math.max(0, i.quantity + delta) }
              : i
          )
          .filter((i) => i.quantity > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  // ✅ Memoized calculations (performance)
  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQty,
      totalItems,
      totalPrice,
      clearCart,
    }),
    [
      items,
      isOpen,
      openCart,
      closeCart,
      addToCart,
      removeFromCart,
      updateQty,
      totalItems,
      totalPrice,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}