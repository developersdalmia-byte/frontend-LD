import { apiClient, API_BASE } from "@/lib/apiClient";

const MOCK_MODE = false; // Using real backend at https://api.lalitdalmia.com

// ── MOCK helpers ─────────────────────────────────────────────────────────────

const mockDelay = () => new Promise((res) => setTimeout(res, 1000));

const mockRequestOtp = async () => {
  await mockDelay();
  return { success: true, message: "OTP sent successfully" };
};

const mockVerifyOtp = async (otp: string) => {
  await mockDelay();
  if (otp !== "123456") {
    throw new Error("Invalid OTP. Please try again.");
  }
  return {
    success: true,
    message: "Login successful",
    data: {
      accessToken: "mock-access-token-xyz",
      refreshToken: "mock-refresh-token-xyz",
    },
  };
};

const mockRefreshToken = async () => {
  await mockDelay();
  return {
    success: true,
    data: { accessToken: "mock-access-token-xyz" },
  };
};

// ── REAL API helpers ──────────────────────────────────────────────────────────

const realRequestOtp = (phone: string, name: string) =>
  apiClient("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ phone, name }),
  });

type AuthResponse = { accessToken: string; refreshToken: string; };

const realVerifyOtp = (phone: string, otp: string, name: string) =>
  apiClient<AuthResponse>("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phone, otp, name }),
  });

const realRefreshToken = () =>
  apiClient("/auth/refresh", { method: "POST" });

// ── Exported functions (auto-switch based on MOCK_MODE) ───────────────────────

export const requestOtp = (phone: string, name: string) =>
  MOCK_MODE ? mockRequestOtp() : realRequestOtp(phone, name);

export const verifyOtp = (phone: string, otp: string, name: string) =>
  MOCK_MODE ? mockVerifyOtp(otp) : realVerifyOtp(phone, otp, name);

export const refreshToken = () =>
  MOCK_MODE ? mockRefreshToken() : realRefreshToken();

export const googleLogin = () => {
  if (MOCK_MODE) {
    return new Promise((res) => setTimeout(res, 1500)).then(() => ({
      success: true,
      message: "Google login successful",
      data: {
        accessToken: "mock-google-access-token",
        refreshToken: "mock-google-refresh-token",
        user: { phone: "Google User", name: "Google Account" },
      },
    }));
  }

  window.location.href = `${API_BASE}/api/v1/auth/google`;
};