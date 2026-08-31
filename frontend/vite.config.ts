import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Pre-bundle heavy deps at startup so the first navigation to a lazy route
  // doesn't trigger an async on-demand pre-bundle (which can race-fail under
  // parallel e2e test load with "TypeError: Importing a module script failed").
  optimizeDeps: {
    include: [
      "recharts",
      "jspdf",
      "html2canvas",
      "lucide-react",
      "duckdb",
      "apache-arrow",
      "axios",
      "zustand",
      "react-router-dom",
      "@tanstack/react-query",
    ],
  },
  // Proxy API calls to the FastAPI backend during dev (E2E tests rely on this).
  // Production uses VITE_API_URL inlined at build time.
  server: {
    proxy: {
      // Actual FastAPI backend endpoints — these return JSON API responses.
      // Paths like /governance, /reports, /admin, /readiness are React Router
      // SPA routes and must NOT be proxied, otherwise the SPA never mounts.
      "/api": "http://localhost:8000",
      "/auth": "http://localhost:8000",
      // /upload is used for POST file uploads; GET /upload is the SPA route.
      "/upload": {
        target: "http://localhost:8000",
        bypass(req) {
          if (req.method === "GET") return "/index.html";
          return undefined;
        },
      },
      "/latest-dataset": "http://localhost:8000",
      "/datasets": "http://localhost:8000",
      "/clean": {
        target: "http://localhost:8000",
        bypass(req) {
          if (req.method === "GET" && (req.url === "/cleaning" || req.url?.startsWith("/cleaning"))) return "/index.html";
          return undefined;
        },
      },
      "/analysis": "http://localhost:8000",
      "/visualization": "http://localhost:8000",
      "/ml": "http://localhost:8000",
      "/generate-report": "http://localhost:8000",
      "/ai": "http://localhost:8000",
      "/api-insights": "http://localhost:8000",
      "/health": "http://localhost:8000",
    },
  },
  build: {
    // Don't ship source maps to production — they leak original code paths
    // and make reverse-engineering trivial. (H14)
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/recharts")) {
            return "vendor-recharts";
          }
          if (id.includes("node_modules/jspdf") || id.includes("node_modules/html2canvas")) {
            return "vendor-pdf";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          if (id.includes("node_modules/duckdb") || id.includes("node_modules/apache-arrow")) {
            return "vendor-duckdb";
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router")) {
            return "vendor-core";
          }
        },
      },
    },
  },
});
