import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

// In dev, vite.config.ts proxies /api/* and /auth/* to the local backend.
// In prod, VITE_API_URL is set on Vercel to point at the deployed backend.
// We intentionally do NOT fall back to a hardcoded third-party URL — if the
// env var is missing we use a relative path so requests hit the same origin
// (e.g. when the backend is reverse-proxied by Vercel rewrites).
const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  (import.meta.env.PROD ? "" : "http://localhost:8000");

/** Methods we will retry on a 5xx / network error. POSTs are NOT retried
 *  because they may not be idempotent on the server. */
const RETRYABLE_METHODS = new Set(["get", "head", "options"]);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
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
    const token = localStorage.getItem("ai_analyst_jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle auth-401 logout, transient 5xx retry, toasts.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Cancellation: do not toast, do not retry.
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    // 401 → clear token so the next render bounces the user to /login.
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem("ai_analyst_jwt_token");
        // Also clear the persisted zustand auth state.
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
    const config = error.config as InternalAxiosRequestConfig | undefined;
    const method = (config?.method || "get").toLowerCase();
    const status = error.response?.status;
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
      const message =
        (error.response?.data as { detail?: string; message?: string } | undefined)?.detail ||
        (error.response?.data as { detail?: string; message?: string } | undefined)?.message ||
        error.message ||
        "An unexpected server error occurred";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
