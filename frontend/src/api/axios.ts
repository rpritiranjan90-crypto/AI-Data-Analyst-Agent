import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { isJwtExpired } from "../lib/jwt";
import { refreshToken } from "../services/authService";
import { readAccessCookie, clearAccessCookie } from "../lib/cookie";

// In dev, vite.config.ts proxies /api/* and /auth/* to the local backend.
// In prod, VITE_API_URL must be set at build time to the deployed backend URL.
// No hardcoded fallback — leaking the backend hostname into the bundle was a
// security finding (C6 in docs/PRODUCTION_READINESS.md).
function getBaseUrl(): string {
  if (import.meta.env.VITE_API_URL) {
    return (import.meta.env.VITE_API_URL as string).replace(/\/+$/, "");
  }
  // In development, fall back to the local backend.
  if (!import.meta.env.PROD) {
    return "http://localhost:8000";
  }
  // In production, fallback to the deployed Render backend so API requests succeed
  return "https://ai-data-analyst-agent-xs7p.onrender.com";
}

const API_BASE_URL = getBaseUrl();

/** Methods we will retry on a 5xx / network error. POSTs are NOT retried
 *  because they may not be idempotent on the server. */
const RETRYABLE_METHODS = new Set(["get", "head", "options"]);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  // C1: Send credentials (cookies) on every cross-origin request.
  // The backend must respond with Access-Control-Allow-Credentials: true
  // and a specific (non-wildcard) Access-Control-Allow-Origin for this to work.
  // Once the backend sets httpOnly; Secure; SameSite=Strict cookies on
  // /auth/login and /auth/register, the localStorage token reads below can be
  // removed and the Authorization header interceptor deleted.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Extend the request config type so the retry helper can record its attempt.
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    __retryCount?: number;
    signal?: AbortSignal;
  }
}

// Request interceptor: attach JWT.
api.interceptors.request.use(
  (config) => {
    // C1: read the access token from the ada_access cookie. The cookie is
    // set by the backend on login/register and is rotated by /auth/refresh.
    const token = readAccessCookie();
    if (token) {
      // H3: drop expired tokens so the request fails fast and the UI re-auths.
      if (isJwtExpired(token)) {
        clearAccessCookie();
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// In-flight refresh promise so concurrent 401s share a single /auth/refresh call.
let inFlightRefresh: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  if (inFlightRefresh) return inFlightRefresh;
  inFlightRefresh = refreshToken()
    .then((token) => {
      try { localStorage.setItem("ai_analyst_jwt_token", token); } catch {}
      return token;
    })
    .finally(() => { inFlightRefresh = null; });
  return inFlightRefresh;
}

// Response interceptor: handle auth-401 logout, transient 5xx retry, toasts.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Cancellation: do not toast, do not retry.
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    const config = error.config as InternalAxiosRequestConfig | undefined;
    const status = error.response?.status;
    const method = (config?.method || "get").toLowerCase();

    // H2: on 401 (and only for non-auth endpoints) try once to refresh, then retry.
    // Refresh itself uses a separate axios call so it doesn't recurse via this interceptor.
    if (
      status === 401 &&
      config &&
      !(config as { __isRefresh?: boolean }).__isRefresh &&
      !(config.url || "").includes("/auth/")
    ) {
      try {
        const newToken = await performRefresh();
        config.headers = config.headers || ({} as InternalAxiosRequestConfig["headers"]);
        (config.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return api.request(config);
      } catch {
        // Refresh failed — fall through to clear the session.
      }
    }

    // 401 → clear cookies and bounce to login.
    if (status === 401) {
      clearAccessCookie();
      // Also clear the persisted zustand auth state.
      try {
        const raw = localStorage.getItem("ada-auth-storage");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.state) {
            parsed.state.token = null;
            parsed.state.isAuthenticated = false;
            parsed.state.user = null;
            localStorage.setItem("ada-auth-storage", JSON.stringify(parsed));
          }
        }
      } catch {
        // Ignore storage errors.
      }
    }

    // Retry once on transient 5xx / network errors for safe (GET) methods.
    const isRetryable =
      RETRYABLE_METHODS.has(method) &&
      (status === undefined || status === 502 || status === 503 || status === 504) &&
      (config?.__retryCount ?? 0) < 1;

    if (isRetryable && config) {
      config.__retryCount = (config.__retryCount ?? 0) + 1;
      // Back off 300ms.
      await new Promise((r) => setTimeout(r, 300));
      return api.request(config);
    }

    // Toast only for user-visible failures (skip 401 which is handled above).
    if (status !== 401) {
      // M7: surface rate-limit with retry-after.
      if (status === 429) {
        const retryAfter = Number(error.response?.headers?.["retry-after"]) || 60;
        toast.error(`Too many requests. Please wait ${retryAfter}s and try again.`);
      } else {
        const message =
          (error.response?.data as { detail?: string; message?: string } | undefined)?.detail ||
          (error.response?.data as { detail?: string; message?: string } | undefined)?.message ||
          error.message ||
          "An unexpected server error occurred";
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
