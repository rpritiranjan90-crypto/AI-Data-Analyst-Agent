import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";
import { WorkspaceSettingsPage } from "../pages/WorkspaceSettingsPage";
import { UsagePage } from "../pages/UsagePage";
import { GDPRPage } from "../pages/GDPRPage";
import { BillingSuccessPage } from "../pages/BillingSuccessPage";
import { BillingCancelPage } from "../pages/BillingCancelPage";

test.describe("Billing & Settings E2E Suite", () => {
  // ── Reset auth state before each test (prevents leakage in parallel runs) ────
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await base.resetAuth();
  });

  // ── Billing pages (protected — inside RequireAuth) ─────────

  test.describe("Billing redirect (unauthenticated)", () => {
    test("unauthenticated user is redirected from /billing/success to /login", async ({ page }) => {
      await page.goto("/billing/success", { waitUntil: "networkidle" });
      await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
    });

    test("unauthenticated user is redirected from /billing/cancel to /login", async ({ page }) => {
      await page.goto("/billing/cancel", { waitUntil: "networkidle" });
      await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
    });
  });

  test.describe("Billing pages (authenticated)", () => {
    let base: BasePage;

    test.beforeEach(async ({ page }) => {
      base = new BasePage(page);
      await base.preAuthenticate();
    });

    test("authenticated user sees billing success page", async ({ page }) => {
      const billingPage = new BillingSuccessPage(page);
      await billingPage.goto();
      // Should land on the billing page, not crash.
      await expect(page).toHaveURL(/.*billing\/success/);
    });

    test("authenticated user sees billing cancel page", async ({ page }) => {
      const billingPage = new BillingCancelPage(page);
      await billingPage.goto();
      await expect(page).toHaveURL(/.*billing\/cancel/);
    });
  });

  // ── Settings pages ──────────────────────────────────────────────────────

  test.describe("Settings redirect (unauthenticated)", () => {
    const settingsPaths = [
      "/settings/workspace",
      "/settings/usage",
      "/settings/gdpr",
    ];

    for (const path of settingsPaths) {
      test(`unauthenticated user is redirected from ${path} to /login`, async ({ page }) => {
        await page.goto(path, { waitUntil: "networkidle" });
        await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
      });
    }
  });

  test.describe("Settings pages (authenticated)", () => {
    let base: BasePage;

    test.beforeEach(async ({ page }) => {
      base = new BasePage(page);
      await base.preAuthenticate();
    });

    test("workspace settings page loads", async ({ page }) => {
      const settingsPage = new WorkspaceSettingsPage(page);
      await settingsPage.goto();
      await expect(page).toHaveURL(/.*settings\/workspace/);
    });

    test("usage page loads", async ({ page }) => {
      const usagePage = new UsagePage(page);
      await usagePage.goto();
      await expect(page).toHaveURL(/.*settings\/usage/);
    });

    test("gdpr page loads", async ({ page }) => {
      const gdprPage = new GDPRPage(page);
      await gdprPage.goto();
      await expect(page).toHaveURL(/.*settings\/gdpr/);
    });
  });

  // ── Reports page ─────────────────────────────────────────────────────────

  test.describe("Reports page", () => {
    test("unauthenticated user is redirected from /reports to /login", async ({ page }) => {
      await page.goto("/reports", { waitUntil: "networkidle" });
      await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
    });

    test("authenticated user can access /reports", async ({ page }) => {
      const base = new BasePage(page);
      await base.preAuthenticate();
      await page.goto("/reports");
      await expect(page).toHaveURL(/.*reports/);
    });
  });

  // ── Admin page ──────────────────────────────────────────────────────────

  test.describe("Admin Portal", () => {
    test("unauthenticated user is redirected from /admin to /login", async ({ page }) => {
      await page.goto("/admin", { waitUntil: "networkidle" });
      await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
    });

    test("authenticated user can access /admin", async ({ page }) => {
      const base = new BasePage(page);
      // Pre-authenticate as Owner so the role guard lets them through.
      await base.preAuthenticate({ role: "Owner" });
      await page.goto("/admin");
      await expect(page).toHaveURL(/.*admin/);
    });
  });
});
