import { test, expect } from "@playwright/test";
import { StatusPage } from "../pages/StatusPage";
import { BasePage } from "../pages/BasePage";

/**
 * Public pages E2E Suite.
 * Note: /pricing, /privacy-policy, /terms-of-service, /billing/* are inside
 * RequireAuth and redirect to /login for unauthenticated users. They are tested
 * in billing-settings.spec.ts (authenticated) and billing.spec.ts (redirect).
 */
test.describe("Public pages E2E Suite", () => {
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await base.resetAuth();
  });

  test("status page renders without auth", async ({ page }) => {
    const statusPage = new StatusPage(page);
    await statusPage.goto();
    await expect(page).toHaveURL(/.*status/);
  });

  test("unauthenticated users are redirected from /pricing to /login", async ({ page }) => {
    await page.goto("/pricing", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });

  test("unauthenticated users are redirected from /privacy-policy to /login", async ({ page }) => {
    await page.goto("/privacy-policy", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });

  test("unauthenticated users are redirected from /terms-of-service to /login", async ({ page }) => {
    await page.goto("/terms-of-service", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
  });
});
