/**
 * C1: cookie helpers.
 *
 * The backend sets two cookies on login/register:
 *   - ada_access   (Secure; SameSite=Strict)  — short-lived, readable by JS
 *   - ada_refresh  (httpOnly; Secure; SameSite=Strict) — invisible to JS
 *
 * The access cookie is read here so the axios interceptor can attach it as
 * Authorization: Bearer … on every request. The refresh cookie is never
 * touched by JS — the browser only sends it to /auth/refresh.
 */
const ACCESS_COOKIE_NAME = "ada_access";

/** Read the current access token from document.cookie. Returns null if missing. */
export function readAccessCookie(): string | null {
  if (typeof document === "undefined") return null;
  const jar = document.cookie || "";
  // Match either "ada_access=..." or "; ada_access=...".
  const match = jar.match(/(?:^|;\s*)ada_access=([^;]+)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/** Clear the access cookie on the client (logout). The refresh cookie
 *  is cleared server-side by /auth/logout because it is httpOnly. */
export function clearAccessCookie(): void {
  if (typeof document === "undefined") return;
  // Match whatever path/secure attributes the server used so we actually
  // overwrite the live cookie. Server uses path=/, Secure only in prod.
  const isHttps =
    typeof location !== "undefined" && location.protocol === "https:";
  document.cookie = `${ACCESS_COOKIE_NAME}=; Path=/; Max-Age=0${
    isHttps ? "; Secure" : ""
  }; SameSite=Strict`;
}
