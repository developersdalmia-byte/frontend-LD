import { apiClient } from "@/lib/apiClient";
import type { Product, PaginatedResponse, ProductCategory } from "@/types";

/**
 * Raw product shape from the backend API
 */
export interface ApiProduct {
  _id: string;
  title: string;
  slug: string;
  price: number;
  priceSubtitle?: string;
  sizes: string[];
  images: string[];
  shippingTime?: string;
  shippingAndDelivery?: string;
  fitting?: {
    [size: string]: {
      bust?: string;
      waist?: string;
      hip?: string;
      shoulder?: string;
    };
  };
  productDetails?: {
    description?: string;
    mrpIncludes?: string;
    material?: string;
    color?: string;
    careGuide?: string;
    madeToOrder?: string;
    modelInfo?: string;
  };
  sku?: string;
  manufacturerDetails?: {
    address?: string;
    email?: string;
    phone?: string;
    countryOfOrigin?: string;
  };
  disclaimer?: string;
  attributes?: {
    occasion?: string;
    fabric?: string;
    style?: string;
    weddingType?: string[];
  };
  mainCategoryId?: { _id: string; name: string; slug: string; isActive: boolean };
  categoryId?: { _id: string; name: string; slug: string; isActive: boolean };
  subCategoryId?: { _id: string; name: string; slug: string; isActive: boolean };
  inventoryType?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields fallback
  description?: string;
  fabric?: string;
  care?: string;
  availability?: "available" | "made-to-order" | "sold-out";
  collection?: string;
  featured?: boolean;
  new?: boolean;
  tags?: string[];
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
  const id = p._id;
  
  // Normalize category slugs for frontend consumption
  const mapMainCategory = (slug?: string): ProductCategory => {
    if (slug === "womens-wear") return "womenswear";
    if (slug === "mens-wear") return "menswear";
    return (slug as any) || "womenswear";
  };

  return {
    id: id,
    name: p.title,
    slug: p.slug || id,
    category: mapMainCategory(p.mainCategoryId?.slug),
    subcategory: p.categoryId?.name,
    subCategoryId: p.subCategoryId?._id,
    categoryId: p.categoryId?._id,
    mainCategoryId: p.mainCategoryId?._id,
    price: typeof p.price === "number" ? p.price : parseFloat(String(p.price).replace(/[^0-9.]/g, "")) || 0,
    priceSubtitle: p.priceSubtitle,
    currency: "INR",
    images: p.images || [],
    sizes: p.sizes || [],
    description: p.productDetails?.description || p.description || "",
    fabric: p.attributes?.fabric || p.productDetails?.material || p.fabric || "",
    care: p.productDetails?.careGuide || p.care || "",
    availability: p.availability || (p.productDetails?.madeToOrder ? "made-to-order" : "available"),
    shippingTime: p.shippingTime,
    shippingAndDelivery: p.shippingAndDelivery,
    fitting: p.fitting,
    productDetails: p.productDetails,
    sku: p.sku,
    manufacturerDetails: p.manufacturerDetails,
    disclaimer: p.disclaimer,
    collection: p.collection || "",
    featured: p.featured || false,
    new: p.new || false,
    tags: p.tags || [],
    attributes: p.attributes ? {
      occasion: p.attributes.occasion,
      style: p.attributes.style,
      weddingType: p.attributes.weddingType,
      fabric: p.attributes.fabric
    } : undefined,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt
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
  mainCategory?: string;
  category?: string;
  subCategory?: string;
  occasion?: string;
  search?: string;
  sort?: string;
  availability?: string;
  minPrice?: number;
  maxPrice?: number;
} = {}): Promise<{ products: Product[]; hasMore: boolean; total: number }> {
  const { 
    page = 1, 
    limit = 20, 
    mainCategory, 
    category, 
    subCategory, 
    occasion, 
    search, 
    sort, 
    availability,
    minPrice,
    maxPrice
  } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(mainCategory && { mainCategory }),
    ...(category && { category }),
    ...(subCategory && { subCategory }),
    ...(occasion && { occasion }),
    ...(search && { search }),
    ...(sort && { sort }),
    ...(availability && { availability }),
    ...(minPrice !== undefined && { minPrice: String(minPrice) }),
    ...(maxPrice !== undefined && { maxPrice: String(maxPrice) }),
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

  let rawProducts = data.products?.length ? data.products : (data.items ?? []);
  
  // --- PRODUCTION-GRADE SORTING FALLBACK ---
  // If the API sorting is unreliable or if we want to ensure perfect order on the current batch
  if (sort === "price") {
    rawProducts = [...rawProducts].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  } else if (sort === "-price") {
    rawProducts = [...rawProducts].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  } else if (sort === "-createdAt" || sort === "newest") {
    rawProducts = [...rawProducts].sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
  }
  
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
