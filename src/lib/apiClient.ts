// export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://192.168.1.44:5000";
export const API_BASE = "https://api.lalitdalmia.com"
// export const API_BASE = "http://192.168.1.44:5000";
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
  baseUrl?: string;
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
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth-session-expired"));
  }
};

class ApiError extends Error {
  errors?: unknown[];

  constructor(message: string, errors?: unknown[]) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { baseUrl, ...fetchOptions } = options;
  const url = `${baseUrl || BASE_URL}${endpoint}`;
  let accessToken = getAccessToken();

  const makeRequest = async () => {
    const currentToken = getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      if (currentToken) {
        console.log(`[apiClient] Authorized Request: ${url}`);
      } else if (fetchOptions.method && fetchOptions.method !== "GET") {
        console.warn(`[apiClient] Request without token: ${url}`);
      }
    }

    if (options.headers && typeof options.headers === "object" && !Array.isArray(options.headers)) {
      Object.assign(headers, options.headers);
    }

    return fetch(url, {
      ...fetchOptions,
      headers,
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
    errorMessage.includes("unauthorized") ||
    errorMessage.includes("authentication required");

  if (isAuthError) {
    const existingRefreshToken = getRefreshToken();

    if (!accessToken && !existingRefreshToken) {
      throw new ApiError(
        data.message || data.error || "Something went wrong",
        Array.isArray(data.errors) ? data.errors : undefined
      );
    }

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

  if (Array.isArray(data)) {
    return data as unknown as ApiResponse<T>;
  }

  if (typeof data === "object" && data !== null && !("success" in data)) {
    const dataObj = data as Record<string, unknown>;
    if (!dataObj.error && !dataObj.message) {
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