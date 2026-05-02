export const API_BASE = "https://api.lalitdalmia.com";
export const BASE_URL = `${API_BASE}/api/v1`;

type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  errors?: unknown[];
};

type ApiOptions = RequestInit & {
  retry?: boolean;
};

const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
};

const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

const clearAuth = () => {
  localStorage.clear();
};

class ApiError extends Error {
  errors?: unknown[];

  constructor(message: string, errors?: unknown[]) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

export const apiClient = async <T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> => {
  let accessToken = getAccessToken();

  const makeRequest = async () => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && {
          Authorization: `Bearer ${accessToken}`,
        }),
        ...options.headers,
      },
    });
  };

  let res: Response;
  try {
    res = await makeRequest();
  } catch (networkError) {
    const msg =
      networkError instanceof TypeError
        ? "Unable to connect to the server. Please check your internet connection or try again later."
        : "A network error occurred. Please try again.";
    throw new Error(msg);
  }

  let data: ApiResponse<T>;
  try {
    data = await res.json();
  } catch {
    throw new Error("Failed to parse server response.");
  }

  const errorMessage = (data.message || data.error || "").toLowerCase();
  const isAuthError =
    res.status === 401 ||
    errorMessage.includes("jwt") ||
    errorMessage.includes("malformed") ||
    errorMessage.includes("invalid token") ||
    errorMessage.includes("unauthorized");

  if (isAuthError) {
    const existingRefreshToken = getRefreshToken();

    // Agar user logged in hi nahi tha (koi token nahi),
    // toh "session expire" mat bolo — seedha API error throw karo
    if (!accessToken && !existingRefreshToken) {
      throw new ApiError(
        data.message || data.error || "Something went wrong",
        Array.isArray(data.errors) ? data.errors : undefined
      );
    }

    // User logged in tha — token refresh karne ki koshish karo
    if (!options.retry) {
      try {
        if (!existingRefreshToken) throw new Error("No refresh token");

        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: existingRefreshToken }),
        });

        const refreshData = await refreshRes.json();

        if (!refreshData.success || !refreshData.data?.accessToken) {
          throw new Error("Refresh failed");
        }

        const newAccessToken = refreshData.data.accessToken;
        setAccessToken(newAccessToken);
        accessToken = newAccessToken;

        return apiClient<T>(endpoint, { ...options, retry: true });
      } catch {
        clearAuth();
        throw new Error("Your session has expired. Please login again.");
      }
    } else {
      clearAuth();
      throw new Error("Your session has expired. Please login again.");
    }
  }

  // If the response is an array (e.g. /categories), treat it as a successful data payload directly
  if (Array.isArray(data)) {
    return data as unknown as ApiResponse<T>;
  }

  if (typeof data === "object" && data !== null && !("success" in data)) {
    const dataObj = data as Record<string, unknown>;
    if (!dataObj.error && !dataObj.message) {
      // If it's a valid object without 'success' but also without error fields, treat it as data
      return { success: true, data: data as T };
    }
  }

  if (data && !data.success) {
    throw new ApiError(
      data.message || data.error || "Something went wrong",
      Array.isArray(data.errors) ? data.errors : undefined
    );
  }

  return data;
};