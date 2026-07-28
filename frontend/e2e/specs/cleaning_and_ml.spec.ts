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
});
