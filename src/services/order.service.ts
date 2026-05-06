import { apiClient } from "@/lib/apiClient";

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

export interface AddressData {
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItemData {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  products: OrderItemData[];
  address: {
    name: string;
    phone: string;
    email: string;
    pincode: string;
    state: string;
    city: string;
    addressLine: string;
  };
}

export interface OrderResponseApi {
  orderId: string;
  _id: string;
  orderType: string;
  status: string;
  paymentStatus: string;
}

/**
 * Creates a new order on the backend.
 * Note: Online order creation automatically clears the authenticated user's cart on the server upon success.
 */
export async function createOrder(payload: CreateOrderPayload): Promise<OrderResponseApi> {
  const response = await apiClient<OrderResponseApi>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.data) {
    throw new Error("Failed to retrieve order data from response");
  }

  return response.data;
}

/**
 * Updates an order's status.
 * Customers can use this to cancel their own order while it is PENDING, CONFIRMED, or PROCESSING.
 * Admins use this same endpoint to progress the order.
 */
export async function updateOrderStatus(
  orderId: string,
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
): Promise<{ _id: string; status: string }> {
  const response = await apiClient<{ _id: string; status: string }>(`/orders/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  if (!response.data) {
    throw new Error("Failed to update order status");
  }

  return response.data;
}
