import { apiClient } from "@/lib/apiClient";

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  subcategories?: SubCategory[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories?: SubCategory[];
}

// In-memory cache for SPA navigation
const cache = {
  data: null as Category[] | null,
  timestamp: 0
};
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes for categories as they rarely change

/**
 * Fetches all categories and their nested subcategories
 */
export async function getCategories(): Promise<Category[]> {
  // 1. Check in-memory cache
  if (typeof window !== "undefined" && cache.data) {
    if (Date.now() - cache.timestamp < CACHE_TTL_MS) {
      return cache.data;
    }
  }

  // 2. Fetch from API
  // Note: /categories returns a direct array according to the API spec
  const response = await apiClient<Category[]>("/categories");
  
  // Depending on how apiClient handles the raw array response, 
  // response could be the array itself or { data: [...] }
  const categories = Array.isArray(response) ? response : (response.data ?? []);

  // 3. Save to cache
  if (typeof window !== "undefined") {
    cache.data = categories;
    cache.timestamp = Date.now();
  }

  return categories;
}
