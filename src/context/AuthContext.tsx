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
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  /** Opens the login modal. Pass redirectPath to auto-redirect after login (e.g. "/checkout") */
  openLoginModal: (redirectPath?: string) => void;
  closeLoginModal: () => void;
  /** Consumed once after successful login when a redirect was requested */
  pendingRedirect: string | null;
  clearPendingRedirect: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getInitialUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const storedUser = localStorage.getItem("authUser");
    const token = localStorage.getItem("accessToken");
    if (token && storedUser) return JSON.parse(storedUser);
  } catch {}
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const openLoginModal = useCallback((redirectPath?: string) => {
    if (typeof redirectPath === "string") {
      setPendingRedirect(redirectPath);
      sessionStorage.setItem("pendingRedirect", redirectPath);
    }
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    // Do NOT clear pendingRedirect here — login handler will consume it
  }, []);

  const clearPendingRedirect = useCallback(() => {
    setPendingRedirect(null);
    sessionStorage.removeItem("pendingRedirect");
  }, []);

  // Handle Google OAuth redirect (#accessToken=...&refreshToken=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || !hash.includes("accessToken")) return;

    try {
      const params = new URLSearchParams(hash.replace("#", ""));
      const authStatus = params.get("authStatus");
      const accessToken = params.get("accessToken")?.replace(/^"|"$/g, "");
      const refreshToken = params.get("refreshToken")?.replace(/^"|"$/g, "");
      const userStr = params.get("user");

      if (authStatus === "FAILED") {
        console.error("Authentication failed:", params.get("message"));
        return;
      }

      if (accessToken && refreshToken) {
        let authUser: AuthUser = {
          phone: "",
          name: "User",
        };

        if (userStr) {
          try {
            // User might be double encoded or quoted
            const decodedUser = JSON.parse(userStr.replace(/^"|"$/g, ""));
            authUser = {
              phone: decodedUser.phone || decodedUser.phoneNumber || "",
              name: decodedUser.name || decodedUser.fullName || "User",
              email: decodedUser.email,
            };
          } catch (e) {
            console.warn("Failed to parse user data from URL", e);
          }
        }

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("authUser", JSON.stringify(authUser));

        setUser(authUser);
        // Clean URL without refresh
        window.history.replaceState({}, document.title, window.location.pathname);

        // Consume pending redirect if exists
        const storedRedirect = sessionStorage.getItem("pendingRedirect");
        if (storedRedirect) {
          window.location.href = storedRedirect;
          sessionStorage.removeItem("pendingRedirect");
        }
      }
    } catch (err) {
      console.error("Google auth processing error:", err);
    }
  }, []);

  // Initialize state from storage
  useEffect(() => {
    const storedRedirect = sessionStorage.getItem("pendingRedirect");
    if (storedRedirect) setPendingRedirect(storedRedirect);
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
    sessionStorage.removeItem("pendingRedirect");
    setUser(null);
    setPendingRedirect(null);
  }, []);

  useEffect(() => {
    const handleAuthFailure = () => {
      logout();
      openLoginModal();
    };

    window.addEventListener("auth-session-expired", handleAuthFailure);
    return () => window.removeEventListener("auth-session-expired", handleAuthFailure);
  }, [logout, openLoginModal]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isLoggedIn: !!user,
      login,
      logout,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal,
      pendingRedirect,
      clearPendingRedirect,
    }),
    [user, login, logout, isLoginModalOpen, openLoginModal, closeLoginModal, pendingRedirect, clearPendingRedirect]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};