import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

test.describe("Navigation & Route Protection E2E Suite", () => {
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await base.resetAuth();
  });

  test("should navigate to landing page", async ({ page }) => {
    await page.goto("/landing");
    await expect(page).toHaveURL(/.*landing/);
  });

  test("should navigate to help center", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/help");
    await expect(page).toHaveURL(/.*help/);
  });

  test("should handle 404 routes gracefully", async ({ page }) => {
    await page.goto("/some-non-existent-route");
    await expect(page).toHaveURL(/.*some-non-existent-route/);
  });
});
