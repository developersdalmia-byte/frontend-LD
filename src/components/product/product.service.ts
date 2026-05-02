import { apiClient } from "@/lib/apiClient";
import type { Product } from "@/types";

// ─── API Response shapes (as returned by backend) ────────────────────────────

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

export interface ProductsApiResponse {
  products: ApiProduct[];
  total: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasMore: boolean;
}

// ─── Mapper: API shape → frontend Product type ────────────────────────────────

export function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p._id,
    name: p.title,
    slug: p._id,

    category: (p.category as Product["category"]) ?? "womenswear",
    subcategory: p.subcategory,

    price: p.price,
    currency: "INR",

    images:
      p.images && p.images.length > 0
        ? p.images
        : ["/images/1.webp"],

    description: p.description ?? "",

    fabric: p.attributes?.fabric ?? p.fabric,
    care: p.care,

    availability: p.availability ?? "available",
    collection: p.collection,

    featured: p.featured ?? false,
    new: p.new ?? false,

    tags: p.tags ?? [],

    // ✅ FIXED: sizes added (required field)
    sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["Free Size"],
  };
}

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Fetch paginated product list
 * Usage: getProducts({ page: 1, limit: 20 })
 */
export async function getProducts(
  params: { page?: number; limit?: number; category?: string } = {}
): Promise<{ products: Product[]; hasMore: boolean; total: number }> {
  const { page = 1, limit = 20, category } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(category ? { category } : {}),
  });

  const res = await apiClient<ProductsApiResponse>(
    `/products?${query.toString()}`
  );

  const data = res.data!;

  return {
    products: data.products.map(mapApiProduct),
    hasMore: data.hasMore,
    total: data.total,
  };
}

/**
 * Fetch single product by ID
 * Usage: getProductById("abc123")
 */
export async function getProductById(id: string): Promise<Product> {
  const res = await apiClient<ApiProduct>(`/products/${id}`);
  return mapApiProduct(res.data!);
}