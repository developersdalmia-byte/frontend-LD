"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

interface AuthUser {
  phone: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Safe localStorage read (NO useEffect needed)
function getInitialUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const storedUser = localStorage.getItem("authUser");
    const token = localStorage.getItem("accessToken");

    if (token && storedUser) {
      return JSON.parse(storedUser);
    }
  } catch {}

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // ✅ Lazy initialization (fixes your error)
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);

  // ✅ Handle Google redirect ONLY
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) return;

    try {
      const params = new URLSearchParams(hash.replace("#", ""));

      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      if (accessToken && refreshToken) {
        const authUser: AuthUser = {
          phone: params.get("phone") || "Google User",
          name: params.get("name") || "User",
        };

        // persist
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("authUser", JSON.stringify(authUser));

        // ✅ SAFE: event-based update (not hydration)
        setUser(authUser);

        // clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    } catch (err) {
      console.error("Google auth error:", err);
    }
  }, []);

  const login = useCallback(
    (accessToken: string, refreshToken: string, authUser: AuthUser) => {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("authUser", JSON.stringify(authUser));

      setUser(authUser);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");

    setUser(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoggedIn: !!user,
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};