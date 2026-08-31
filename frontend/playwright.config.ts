import { defineConfig, devices } from "@playwright/test";

const FRONTEND_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:5173";
const FRONTEND_PORT = "5173";

export default defineConfig({
  testDir: "./e2e/specs",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],
  use: {
    baseURL: FRONTEND_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Test isolation: clear all persisted client state synchronously before
    // every page load so unauthenticated redirect tests are never contaminated
    // by state from a previous test. addInitScript runs before page scripts.
    addInitScript() {
      return `
        try {
          localStorage.removeItem('ada-auth-storage');
          localStorage.removeItem('ai_analyst_jwt_token');
          localStorage.removeItem('ai-dataset-storage');
          localStorage.removeItem('ai-pinboard-storage');
        } catch(e){}
      `;
    },
  },
  // Auto-start the Vite dev server before running tests (skipped in CI which pre-starts it).
  // reuseExistingServer: false ensures the server picks up any vite.config.ts changes.
  webServer: process.env.CI
    ? undefined
    : {
        command: `npm run dev -- --port ${FRONTEND_PORT}`,
        url: FRONTEND_URL,
        reuseExistingServer: true,
        timeout: 60 * 1000,
        stdout: "ignore",
        stderr: "pipe",
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome (Pixel 7)",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "Mobile Safari (iPhone 13)",
      use: { ...devices["iPhone 13"] },
    },
  ],
});
