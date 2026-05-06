import { apiClient, API_BASE } from "@/lib/apiClient";

interface AuthResponse {
  user: {
    _id: string;
    name: string;
    phone: string;
    email: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// ── REAL API helpers ──────────────────────────────────────────────────────────

export const requestOtp = (phone: string, name: string) =>
  apiClient("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ phone, name }),
  });

export const verifyOtp = (phone: string, otp: string, name: string) =>
  apiClient<AuthResponse>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phone, otp, name }),
  });

export const refreshToken = () =>
  apiClient("/auth/refresh", { method: "POST" });

export const googleLogin = () => {
  window.location.href = `${API_BASE}/api/v1/auth/google`;
};