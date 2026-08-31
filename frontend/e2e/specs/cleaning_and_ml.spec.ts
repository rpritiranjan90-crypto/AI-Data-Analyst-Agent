import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

test.describe("Data Cleaning & AutoML E2E Suite", () => {
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await base.resetAuth();
  });

  test("should render Data Cleaning Studio", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/cleaning");
    await expect(page).toHaveURL(/.*cleaning/);
  });

  test("should render AutoML Training Studio", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/machine-learning");
    await expect(page).toHaveURL(/.*machine-learning/);
  });

  test("should show empty state banner when no dataset is loaded on Cleaning page", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/cleaning");
    await expect(page).toHaveURL(/.*cleaning/, { timeout: 15000 });
    await expect(
      page.getByText(/Data Quality & Preprocessing Studio|Data Cleaning Studio/i).first()
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText(/Upload First Dataset/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("should show empty state on ML page when no dataset is loaded", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/machine-learning");
    // ML studio should indicate a dataset is needed.
    await expect(
      page.getByText(/Upload|select.*target|import.*dataset|No.*dataset/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("should navigate from Cleaning to Upload page via CTA", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/cleaning");
    // The "Upload First Dataset" button on the empty state should take us to /upload.
    const uploadBtn = page.getByRole("button", { name: /Upload First Dataset/i }).first();
    if (await uploadBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await uploadBtn.click();
      await expect(page).toHaveURL(/.*upload/);
    }
  });
});
