import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";

test.describe("Executive Dashboard & Decision Center E2E Suite", () => {
  test("should render Executive Dashboard", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("should navigate to Strategic Decision Center", async ({ page }) => {
    await page.goto("/decision-center");
    await expect(page).toHaveURL(/.*decision-center/);
  });
});
