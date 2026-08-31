import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { readAccessCookie } from "../../lib/cookie";
import { isJwtExpired } from "../../lib/jwt";

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Wraps protected routes. Redirects unauthenticated users to /login.
 * Guests (preview mode) are scoped to public pages only — access to
 * MainLayout routes (dashboard, upload, admin, etc.) requires a real session.
 *
 * Public routes allowed for guests: /landing, /login, /signup, /forgot-password,
 * /pricing, /privacy-policy, /terms-of-service, /status.
 */
const GUEST_ALLOWED = new Set([
  "/landing",
  "/login",
  "/signup",
  "/forgot-password",
  "/pricing",
  "/privacy-policy",
  "/terms-of-service",
  "/status",
]);

/**
 * Reads the current auth state synchronously from the cookie + localStorage.
 * Used to make an immediate routing decision before Zustand rehydrates.
 */
function readStorageAuth(): boolean {
  try {
    // C1: check the ada_access cookie first (source of truth for current session).
    const cookieToken = readAccessCookie();
    if (cookieToken && !isJwtExpired(cookieToken)) return true;
    // Fall back to the Zustand persisted state.
    const raw = localStorage.getItem("ada-auth-storage");
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { state?: { isAuthenticated?: boolean; token?: string } };
    const state = parsed?.state;
    if (!state) return false;
    if (state.isAuthenticated && state.token && !isJwtExpired(state.token)) return true;
    return false;
  } catch {
    return false;
  }
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isGuest, token } = useAuthStore();
  const location = useLocation();

  // Read auth synchronously from storage for immediate routing.
  const hasStorageAuth = readStorageAuth();

  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist.hasHydrated() ?? hasStorageAuth
  );

  useEffect(() => {
    if (hasStorageAuth) {
      setHydrated(true);
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return () => { unsub(); };
  }, [hasStorageAuth]);

  // While the persist layer is restoring from localStorage, show a small loader
  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FC] dark:bg-[#080C15]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  // Unauthenticated, non-guest users → login
  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Guests are only allowed on public pages; redirect to /landing otherwise
  if (isGuest && !GUEST_ALLOWED.has(location.pathname)) {
    return <Navigate to="/landing" replace />;
  }

  // Authenticated users need a token for protected routes
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
