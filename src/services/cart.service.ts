import { apiClient } from "@/lib/apiClient";

export interface CartItemApi {
  itemId: string;
  productId: string;
  quantity: number;
  price?: number;
}

export interface CartDataApi {
  userId?: string;
  items: CartItemApi[];
  subtotal?: number;
  totalItems: number;
}

/**
 * Fetches the user's current cart from the backend.
 */
export async function getCart(): Promise<CartDataApi> {
  const response = await apiClient<CartDataApi>("/cart");
  return response.data || { items: [], totalItems: 0, subtotal: 0 };
}

/**
 * Adds a new product to the cart.
 */
export async function addToCart(productId: string, quantity: number = 1): Promise<CartDataApi> {
  const response = await apiClient<CartDataApi>("/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
  return response.data || { items: [], totalItems: 0, subtotal: 0 };
}

/**
 * Updates the quantity of a specific cart item.
 */
export async function updateCartItem(itemId: string, quantity: number): Promise<CartDataApi> {
  const response = await apiClient<CartDataApi>("/cart", {
    method: "PATCH",
    body: JSON.stringify({ itemId, quantity }),
  });
  return response.data || { items: [], totalItems: 0, subtotal: 0 };
}

/**
 * Removes an item entirely from the cart.
 */
export async function removeCartItem(itemId: string): Promise<CartDataApi> {
  const response = await apiClient<CartDataApi>(`/cart/item/${itemId}`, {
    method: "DELETE",
  });
  return response.data || { items: [], totalItems: 0, subtotal: 0 };
}

/**
 * Syncs the local guest cart with the user's backend cart after login.
 * action: "MERGE" combines items, "REPLACE" overwrites the backend with local cart.
 */
export async function syncCart(
  action: "MERGE" | "REPLACE",
  items: Array<{ productId: string; quantity: number }>
): Promise<CartDataApi> {
  const response = await apiClient<CartDataApi>("/cart/sync", {
    method: "POST",
    body: JSON.stringify({ action, items }),
  });
  return response.data || { items: [], totalItems: 0, subtotal: 0 };
}
