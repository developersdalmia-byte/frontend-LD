import { apiClient } from "@/lib/apiClient";

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  payment: {
    _id: string;
    status: string;
  };
  order: {
    _id: string;
    paymentStatus: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    paidAt: string;
  };
}

/**
 * Creates a Razorpay order for an existing internal order.
 */
export async function createRazorpayOrder(orderId: string): Promise<RazorpayOrderResponse> {
  const response = await apiClient<RazorpayOrderResponse>("/payments/create-order", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });

  if (!response.data) {
    throw new Error("Failed to create Razorpay order");
  }

  return response.data;
}

/**
 * Verifies a Razorpay payment signature.
 */
export async function verifyPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> {
  const response = await apiClient<VerifyPaymentResponse>("/payments/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.data) {
    throw new Error("Failed to verify payment");
  }

  return response.data;
}
