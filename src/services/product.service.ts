import { apiClient } from "@/lib/apiClient";
import type { Product, PaginatedResponse } from "@/types";

/**
 * Raw product shape from the backend API
 */
export interface ApiProduct {
  _id: string;
  title: string;
  price: number;
  sizes?: string[];
  images?: string[];
  description?: string;
  fabric?: string;
  care?: string;
  availability?: "available" | "made-to-order" | "sold-out";
  collection?: string;
  featured?: boolean;
  new?: boolean;
  tags?: string[];
  category?: string;
  subcategory?: string;
  attributes?: {
    occasion?: string;
    fabric?: string;
    style?: string;
    weddingType?: string[];
  };
}

/**
 * Backend response shape for paginated products
 */
export interface ProductsApiResponse {
  products?: ApiProduct[];
  items?: ApiProduct[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasMore: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function mapApiProduct(p: ApiProduct): Product {
  const id = p._id || (p as any).id;
  return {
    id: id,
    name: p.title,
    slug: id, // Ideally, backend should provide a slug
    category: (p.category as Product["category"]) || ("" as any),
    subcategory: p.subcategory,
    price: p.price || 0,
    currency: "INR", // Keep currency constant as it's an Indian brand
    images: p.images && p.images.length > 0 ? p.images : [], // No fake local images
    description: p.description || "",
    fabric: p.attributes?.fabric || p.fabric || "",
    care: p.care || "",
    availability: p.availability || "available",
    collection: p.collection || "",
    featured: p.featured || false,
    new: p.new || false,
    tags: p.tags || [],
    sizes: p.sizes || ["S", "M", "L"], // fallback to default sizes if API doesn't provide
    attributes: p.attributes ? {
      occasion: p.attributes.occasion,
      style: p.attributes.style,
      weddingType: p.attributes.weddingType,
    } : undefined,
  };
}

// --- Client-Side In-Memory Cache for SPA Navigation ---
// Mimics SWR/React Query caching behavior for instantaneous page transitions
const cache = new Map<string, { data: { products: Product[]; hasMore: boolean; total: number }; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches a list of products with optional filters and pagination.
 */
export async function getProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  occasion?: string;
  search?: string;
  sort?: string;
  availability?: string;
} = {}): Promise<{ products: Product[]; hasMore: boolean; total: number }> {
  const { page = 1, limit = 20, category, subcategory, occasion, search, sort, availability } = params;

  // Map frontend main categories to backend expected mainCategory slugs
  const mapMainCategory = (cat?: string) => {
    if (cat === "womenswear") return "womens-wear";
    if (cat === "menswear") return "mens-wear";
    return cat;
  };

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(category && { mainCategory: mapMainCategory(category) }),
    ...(subcategory && { category: subcategory }), // frontend subcategory = backend category
    ...(occasion && { occasion }),
    ...(search && { search }),
    ...(sort && { sort }),
    ...(availability && { availability }),
  });

  const cacheKey = query.toString();

  // 1. Check in-memory cache first (only for browser/client-side to allow instant SPA transitions)
  if (typeof window !== "undefined") {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data; // Instant return!
    }
  }

  // 2. Fetch from network
  const response = await apiClient<ProductsApiResponse>(`/products?${cacheKey}`);
  const data = response.data;

  if (!data) {
    return { products: [], hasMore: false, total: 0 };
  }

  const rawProducts = data.products?.length ? data.products : (data.items ?? []);
  
  const result = {
    products: rawProducts.map(mapApiProduct),
    hasMore: data.hasMore ?? false,
    total: data.total ?? data.pagination?.total ?? 0,
  };

  // 3. Save to cache
  if (typeof window !== "undefined") {
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
  }

  return result;
}

/**
 * Fetches a single product by its ID.
 */
export async function getProductById(id: string): Promise<Product> {
  const response = await apiClient<ApiProduct>(`/products/${id}`);

  if (!response.success || !response.data) {
    throw new Error(response.message || "Product not found");
  }

  return mapApiProduct(response.data);
}
