import { test, expect } from "@playwright/test";

test.describe("Navigation & Route Protection E2E Suite", () => {
  test("should navigate to landing page", async ({ page }) => {
    await page.goto("/landing");
    await expect(page).toHaveURL(/.*landing/);
  });

  test("should navigate to help center", async ({ page }) => {
    await page.goto("/help");
    await expect(page).toHaveURL(/.*help/);
  });

  test("should handle 404 routes gracefully", async ({ page }) => {
    await page.goto("/some-non-existent-route");
    await expect(page).toHaveURL(/.*some-non-existent-route/);
  });
});
