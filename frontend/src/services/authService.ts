/**
 * Auth service — token refresh + logout.
 *
 * C1: tokens are now stored in cookies (ada_access for the access token,
 * ada_refresh httpOnly for the refresh). The browser sends the refresh
 * cookie automatically to /auth/refresh and /auth/logout. The access cookie
 * value is also returned in the response body for backwards compat — we
 * can read either the body or the cookie.
 */
import api from "../api/axios";
import { readAccessCookie, clearAccessCookie } from "../lib/cookie";

/** Exchange the refresh cookie for a new access token. */
export async function refreshToken(): Promise<string> {
  const res = await api.post<{ token?: string }>("/auth/refresh");
  // Backwards-compat: prefer the token in the body, fall back to the cookie.
  const fromBody = res.data?.token;
  if (fromBody) return fromBody;
  const fromCookie = readAccessCookie();
  if (!fromCookie) {
    throw new Error("No access token after refresh (body or cookie)");
  }
  return fromCookie;
}

/** Hit /auth/logout to clear both cookies server-side, then clear the
 *  client-side access cookie. Safe to call even if no cookies are set. */
export async function logoutRequest(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Even if the request fails (network / already-logged-out), clear the
    // client cookie so the UI doesn't stay in an authenticated state.
  }
  clearAccessCookie();
}
