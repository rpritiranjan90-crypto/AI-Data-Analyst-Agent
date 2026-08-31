import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIXTURE_CSV = resolve(__dirname, "..", "fixtures", "sample_data.csv");

test.describe("Executive Dashboard & Decision Center E2E Suite", () => {
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await base.resetAuth();
  });

  test("should render Executive Dashboard", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/dashboard");
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText("Executive Intelligence Dashboard")).toBeVisible({ timeout: 8000 });
  });

  test("should navigate to Strategic Decision Center", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/decision-center");
    await expect(page).toHaveURL(/.*decision-center/);
    await expect(page.getByText(/Decision Center|Decision|Business Decision/i).first()).toBeVisible({ timeout: 8000 });
  });

  test("should load demo dataset and show KPIs", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/dashboard");
    // Click the "Load Demo Dataset" button
    await page.getByRole("button", { name: /Load Demo Dataset/i }).first().click();
    // After loading, the demo filename should appear
    await expect(page.getByText(/HR_Analytics_Demo\.csv|HR Analytics Demo/).first()).toBeVisible({ timeout: 8000 });
  });

  test("should navigate to Upload page via CTA button", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/dashboard");
    // Wait for dashboard to be fully loaded
    await page.waitForLoadState("networkidle");
    const uploadBtn = page.getByRole("button", { name: /Import Dataset|Upload/i }).first();
    await uploadBtn.waitFor({ state: "visible" });
    await uploadBtn.click();
    // Wait for navigation to complete
    await page.waitForURL(/.*upload/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*upload/);
  });

  test("should upload a CSV file and reflect metadata on dashboard", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/dashboard");
    await page.waitForLoadState("networkidle");
    // Navigate to upload
    const uploadBtn = page.getByRole("button", { name: /Import Dataset|Upload/i }).first();
    await uploadBtn.waitFor({ state: "visible" });
    await uploadBtn.click();
    await page.waitForURL(/.*upload/, { timeout: 10000 });
    // Wait for the upload page to be ready before setting files
    await page.waitForLoadState("networkidle");
    // Set the file on the hidden file input — wait for it explicitly
    const fileInput = page.locator('input[type="file"]');
    await fileInput.waitFor({ state: "attached", timeout: 10000 });
    await fileInput.setInputFiles(FIXTURE_CSV);
    // The upload zone should show the filename
    await expect(page.getByText(/sample_data\.csv/).first()).toBeVisible({ timeout: 10000 });
  });

  test("should show active dataset badge in sidebar after demo load", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/dashboard");
    await page.getByRole("button", { name: /Load Demo Dataset/i }).first().click();
    // Sidebar should display the active dataset label
    await expect(page.getByText(/Active Dataset/i).first()).toBeVisible({ timeout: 8000 });
  });
});
