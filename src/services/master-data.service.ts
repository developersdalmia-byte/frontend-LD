import { apiClient } from "@/lib/apiClient";

export interface Buyer {
  _id: string;
  type: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Occasion {
  _id: string;
  type: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

// In-memory cache for SPA navigation
const cache = {
  buyers: { data: null as Buyer[] | null, timestamp: 0 },
  occasions: { data: null as Occasion[] | null, timestamp: 0 },
};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour (master data rarely changes)

/**
 * Fetches the list of buyers from master data.
 * The backend automatically filters out 'self', 'niece', 'nephew' for unauthenticated users.
 */
export async function getBuyers(): Promise<Buyer[]> {
  // 1. Check cache
  if (typeof window !== "undefined" && cache.buyers.data) {
    if (Date.now() - cache.buyers.timestamp < CACHE_TTL_MS) {
      return cache.buyers.data;
    }
  }

  // 2. Fetch from API
  const response = await apiClient<Buyer[]>("/master-data/buyers");
  const buyers = response.data ?? [];

  // 3. Save to cache
  if (typeof window !== "undefined") {
    cache.buyers.data = buyers;
    cache.buyers.timestamp = Date.now();
  }

  return buyers;
}

/**
 * Fetches the list of occasions from master data.
 */
export async function getOccasions(): Promise<Occasion[]> {
  // 1. Check cache
  if (typeof window !== "undefined" && cache.occasions.data) {
    if (Date.now() - cache.occasions.timestamp < CACHE_TTL_MS) {
      return cache.occasions.data;
    }
  }

  // 2. Fetch from API
  const response = await apiClient<Occasion[]>("/master-data/occasions");
  const occasions = response.data ?? [];

  // 3. Save to cache
  if (typeof window !== "undefined") {
    cache.occasions.data = occasions;
    cache.occasions.timestamp = Date.now();
  }

  return occasions;
}
