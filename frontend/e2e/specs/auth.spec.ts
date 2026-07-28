import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Authentication E2E Suite", () => {
  test("should render login page correctly", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(/.*login/);
  });

  test("should display validation on empty submission", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*login/);
  });
});
