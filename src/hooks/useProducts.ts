"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Product } from "@/types";
import { getProducts } from "@/services/product.service";

interface UseProductsOptions {
  limit?: number;
  category?: string;
  subcategory?: string;
  occasion?: string;
  search?: string;
  initialPage?: number;
  pollInterval?: number;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  page: number;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProducts(
  options: UseProductsOptions = {}
): UseProductsResult {
  const {
    limit = 20,
    category,
    subcategory,
    occasion,
    search,
    initialPage = 1,
    pollInterval = 0,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch products handler
   */
  const fetchProducts = useCallback(
    async (pageNum: number, isNewSearch = false) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (isNewSearch) {
          setLoading(true);
          setProducts([]); // Senior Fix: Clear stale data immediately on filter change
        } else {
          setLoadingMore(true);
        }

        setError(null);

        const result = await getProducts({
          page: pageNum,
          limit,
          category,
          subcategory,
          occasion,
          search,
        });

        setProducts((prev) =>
          isNewSearch
            ? result.products
            : [...prev, ...result.products]
        );

        setHasMore(result.hasMore);
        setTotal(result.total);
        setPage(pageNum);
      } catch (err: unknown) {
        // Abort error (ignore)
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        // Safe error handling
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load products.");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [limit, category, subcategory, occasion, search]
  );

  /**
   * Initial load + filters change
   */
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      await fetchProducts(initialPage, true);
    };

    load();

    return () => {
      isMounted = false;
      abortControllerRef.current?.abort();
    };
  }, [fetchProducts, initialPage, category, subcategory, occasion, search]);

  /**
   * Polling (optional)
   */
  useEffect(() => {
    if (pollInterval <= 0) return;

    const intervalId = setInterval(() => {
      if (page === initialPage) {
        fetchProducts(initialPage, true);
      }
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [fetchProducts, initialPage, pollInterval, page]);

  /**
   * Load more (pagination)
   */
  const loadMore = useCallback(async () => {
    if (!loading && !loadingMore && hasMore) {
      await fetchProducts(page + 1, false);
    }
  }, [fetchProducts, loading, loadingMore, hasMore, page]);

  /**
   * Manual refresh
   */
  const refresh = useCallback(async () => {
    await fetchProducts(initialPage, true);
  }, [fetchProducts, initialPage]);

  return {
    products,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    page,
    loadMore,
    refresh,
  };
}