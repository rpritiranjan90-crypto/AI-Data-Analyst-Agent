import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Wraps protected routes. Redirects unauthenticated users to /login.
 * Guests (preview mode) can view only the Landing page; everything
 * inside MainLayout requires a real account.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isGuest, token } = useAuthStore();
  const location = useLocation();
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist.hasHydrated() ?? false
  );

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // If already hydrated before subscription, ensure flag is set
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return () => {
      unsub();
    };
  }, []);

  // While the persist layer is restoring from localStorage, show a small loader
  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FC] dark:bg-[#080C15]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (!token && !isGuest) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
