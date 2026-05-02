"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";

interface WishlistItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category?: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  wishlistIds: Set<string>;
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
  count: number;
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_KEY = "ld_wishlist";

// ✅ SAFE localStorage reader (no SSR crash)
function getInitialWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  // ✅ Lazy initialization (NO useEffect hydration)
  const [items, setItems] = useState<WishlistItem[]>(getInitialWishlist);

  const [isOpen, setIsOpen] = useState(false);

  // ✅ Persist to localStorage (only when items change)
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    } catch {
      // optional: log error in real app
    }
  }, [items]);

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);

  // ✅ Memoized set (prevents re-creation every render)
  const wishlistIds = useMemo(() => {
    return new Set(items.map((i) => i.id));
  }, [items]);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);

      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }

      return [...prev, item];
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isWishlisted = useCallback(
    (id: string) => wishlistIds.has(id),
    [wishlistIds]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      wishlistIds,
      toggleWishlist,
      isWishlisted,
      removeFromWishlist,
      count: items.length,
      isOpen,
      openWishlist,
      closeWishlist,
    }),
    [
      items,
      wishlistIds,
      toggleWishlist,
      isWishlisted,
      removeFromWishlist,
      isOpen,
      openWishlist,
      closeWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}