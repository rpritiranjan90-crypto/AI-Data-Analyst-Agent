/**
 * JWT helpers — minimal, no signature verification (server-side concern).
 * Used to (a) detect expired tokens on client and (b) schedule proactive refresh.
 */

/** Decoded JWT payload shape. Only fields we actually use. */
export interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  email?: string;
  role?: string;
}

/** Decode a JWT payload without verifying the signature. Returns null on any error. */
export function decodeJwt(token: string | null | undefined): JwtPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    // JWT uses base64url, not standard base64.
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    // atob requires padded input; pad to multiple of 4.
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

/** Returns true if the token's `exp` claim is in the past. Treats missing `exp` as expired
 *  to force re-auth rather than silently accept an unverifiable token. */
export function isJwtExpired(token: string | null | undefined, leewaySec = 30): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  const nowSec = Math.floor(Date.now() / 1000);
  return payload.exp - leewaySec <= nowSec;
}

/** Returns ms until the token expires, or 0 if it's already expired / missing. */
export function msUntilExpiry(token: string | null | undefined): number {
  const payload = decodeJwt(token);
  if (!payload?.exp) return 0;
  const nowMs = Date.now();
  return Math.max(0, payload.exp * 1000 - nowMs);
}
