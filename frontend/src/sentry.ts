/**
 * Sentry integration for the frontend.
 * Initializes error tracking and performance monitoring.
 * Only active when VITE_SENTRY_DSN is set.
 */
import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

if (dsn && dsn.trim().length > 10) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_NAME ?? "ai-data-analyst-agent",
    integrations: [
      // Capture errors in React components
      Sentry.browserTracingIntegration(),
      // Capture unhandled promise rejections
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance: sample 20% of page loads
    tracesSampleRate: 0.2,
    // Session replay: sample 1% of users for privacy
    replaysSessionSampleRate: 0.01,
    // Replay on errors: capture full session when an error occurs
    replaysOnErrorSampleRate: 1.0,
    // Don't capture PII (passwords, tokens)
    sendDefaultPii: false,
    // Ignore common third-party noise
    ignoreErrors: [
      "ResizeObserver loop",
      "Non-Error promise rejection",
      "Network Error",  // Axios network errors are handled by the app
    ],
  });
}

export { Sentry };
