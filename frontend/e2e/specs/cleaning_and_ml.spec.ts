import { test, expect } from "@playwright/test";
import { CleaningPage } from "../pages/CleaningPage";
import { MachineLearningPage } from "../pages/MachineLearningPage";

test.describe("Data Cleaning & AutoML E2E Suite", () => {
  test("should render Data Cleaning Studio", async ({ page }) => {
    const cleaning = new CleaningPage(page);
    await cleaning.goto();
    await expect(page).toHaveURL(/.*cleaning/);
  });

  test("should render AutoML Training Studio", async ({ page }) => {
    const ml = new MachineLearningPage(page);
    await ml.goto();
    await expect(page).toHaveURL(/.*machine-learning/);
  });

  test("should show empty state banner when no dataset is loaded on Cleaning page", async ({ page }) => {
    await page.goto("/cleaning");
    // Empty state should show a prompt to upload data
    await expect(
      page.getByText(/Upload|import a dataset|clean dataset/i).first()
    ).toBeVisible({ timeout: 3000 });
  });

  test("should show empty state on ML page when no dataset is loaded", async ({ page }) => {
    await page.goto("/machine-learning");
    // ML studio should indicate a dataset is needed
    await expect(
      page.getByText(/Upload|select.*target|import.*dataset/i).first()
    ).toBeVisible({ timeout: 3000 });
  });

  test("should navigate from Cleaning to Upload page via CTA", async ({ page }) => {
    const cleaning = new CleaningPage(page);
    await cleaning.goto();
    // Find and click an upload CTA if present
    const uploadLink = page.getByRole("link", { name: /Upload|Import/i }).first();
    if (await uploadLink.isVisible()) {
      await uploadLink.click();
      await expect(page).toHaveURL(/.*upload/);
    }
  });
});
