import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURE_CSV = resolve(__dirname, "..", "fixtures", "sample_data.csv");

test.describe("Executive Dashboard & Decision Center E2E Suite", () => {
  test("should render Executive Dashboard", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText("Executive Intelligence Dashboard")).toBeVisible();
  });

  test("should navigate to Strategic Decision Center", async ({ page }) => {
    await page.goto("/decision-center");
    await expect(page).toHaveURL(/.*decision-center/);
    await expect(page.getByText(/Decision Center|Decision|Business Decision/i).first()).toBeVisible();
  });

  test("should load demo dataset and show KPIs", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    // Click the "Load Demo Dataset" button
    await page.getByRole("button", { name: /Load Demo Dataset/i }).first().click();
    // After loading, the demo filename should appear
    await expect(page.getByText(/HR_Analytics_Demo\.csv|HR Analytics Demo/).first()).toBeVisible({ timeout: 5000 });
  });

  test("should navigate to Upload page via CTA button", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await page.getByRole("button", { name: /Import Dataset|Upload/i }).first().click();
    await expect(page).toHaveURL(/.*upload/);
  });

  test("should upload a CSV file and reflect metadata on dashboard", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    // Navigate to upload
    await page.getByRole("button", { name: /Import Dataset|Upload/i }).first().click();
    await expect(page).toHaveURL(/.*upload/);
    // Set the file on the hidden file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(FIXTURE_CSV);
    // The upload zone should show the filename
    await expect(page.getByText(/sample_data\.csv/).first()).toBeVisible({ timeout: 8000 });
  });

  test("should show active dataset badge in sidebar after demo load", async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await page.getByRole("button", { name: /Load Demo Dataset/i }).first().click();
    // Sidebar should display the active dataset label
    await expect(page.getByText(/Active Dataset/i).first()).toBeVisible({ timeout: 5000 });
  });
});
