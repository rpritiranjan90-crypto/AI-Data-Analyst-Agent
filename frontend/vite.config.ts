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
  // Proxy API calls to the FastAPI backend during dev (E2E tests rely on this).
  // Production uses VITE_API_URL inlined at build time.
  server: {
    proxy: {
      "/api": "http://localhost:8000",
      "/auth": "http://localhost:8000",
      "/upload": "http://localhost:8000",
      "/latest-dataset": "http://localhost:8000",
      "/datasets": "http://localhost:8000",
      "/clean": "http://localhost:8000",
      "/analysis": "http://localhost:8000",
      "/visualization": "http://localhost:8000",
      "/ml": "http://localhost:8000",
      "/report": "http://localhost:8000",
      "/generate-report": "http://localhost:8000",
      "/reports": "http://localhost:8000",
      "/ai": "http://localhost:8000",
      "/api-insights": "http://localhost:8000",
      "/admin": "http://localhost:8000",
      "/governance": "http://localhost:8000",
      "/readiness": "http://localhost:8000",
      "/recommendation": "http://localhost:8000",
      "/health": "http://localhost:8000",
    },
  },
  build: {
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
