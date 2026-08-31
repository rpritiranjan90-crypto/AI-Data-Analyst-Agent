import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

/**
 * Protected route redirect E2E Suite.
 * Authenticated pre-auth patterns live in billing-settings.spec.ts.
 * These tests cover unauthenticated redirects only (no setup required).
 */
test.describe("Protected route redirect E2E Suite", () => {
  // Reset auth state to ensure no leak from a previous test.
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await base.resetAuth();
  });

  test("unauthenticated user is redirected from /reports to /login", async ({ page }) => {
    await page.goto("/reports", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });

  test("unauthenticated user is redirected from /admin to /login", async ({ page }) => {
    await page.goto("/admin", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });

  test("unauthenticated user is redirected from /settings/workspace to /login", async ({ page }) => {
    await page.goto("/settings/workspace", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });

  test("unauthenticated user is redirected from /upload to /login", async ({ page }) => {
    await page.goto("/upload", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });

  test("unauthenticated user is redirected from /governance to /login", async ({ page }) => {
    await page.goto("/governance", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });

  test("unauthenticated user is redirected from /settings/usage to /login", async ({ page }) => {
    await page.goto("/settings/usage", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });

  test("unauthenticated user is redirected from /settings/gdpr to /login", async ({ page }) => {
    await page.goto("/settings/gdpr", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });
});
