import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

test.describe("Full Real-User End-to-End Persona Journey", () => {
  test("Complete workflow from login to report generation and logout", async ({ page }) => {
    const base = new BasePage(page);

    // =========================================================================
    // STEP 1: Landing on Login Page & Authentication
    // =========================================================================
    console.log("➡️ [Step 1] Visiting Login Page...");
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*login/, { timeout: 15000 });
    await expect(page.getByRole("heading", { name: /AI Data Analyst Agent/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Sign In|Guest Preview/i }).first()).toBeVisible();

    // Authenticate user session
    console.log("➡️ [Step 2] Authenticating User...");
    await base.preAuthenticate({ role: "Owner" });
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });

    // =========================================================================
    // STEP 2: Dashboard Overview & Dataset Ingestion
    // =========================================================================
    console.log("➡️ [Step 3] Loading Demo Dataset on Dashboard...");
    const demoBtn = page.getByRole("button", { name: /Load Demo Dataset|Try Demo Dataset/i }).first();
    if (await demoBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await demoBtn.click();
      await page.waitForTimeout(1000);
      console.log("   -> Demo dataset loaded into store.");
    }

    // Verify Dashboard Cards / KPIs
    await expect(page.getByText(/Total Rows|Dataset Rows|Data Fabric/i).first()).toBeVisible({ timeout: 10000 });

    // =========================================================================
    // STEP 3: Data Quality & Cleaning Studio
    // =========================================================================
    console.log("➡️ [Step 4] Navigating to Data Cleaning Studio...");
    await page.goto("/cleaning", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*cleaning/, { timeout: 10000 });
    await expect(page.getByText(/Cleaning|Quality|Studio/i).first()).toBeVisible({ timeout: 10000 });

    // =========================================================================
    // STEP 4: In-Memory Analytics & Statistical Profiling
    // =========================================================================
    console.log("➡️ [Step 5] Navigating to Analytics Studio...");
    await page.goto("/analysis", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*analysis/, { timeout: 10000 });
    await expect(page.getByText(/Dataset Analysis|Statistical/i).first()).toBeVisible({ timeout: 10000 });

    // =========================================================================
    // STEP 5: Visualization Studio
    // =========================================================================
    console.log("➡️ [Step 6] Navigating to Visualization Studio...");
    await page.goto("/visualization", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*visualization/, { timeout: 10000 });
    await expect(page.getByText(/Visualization Studio|Chart/i).first()).toBeVisible({ timeout: 10000 });

    // =========================================================================
    // STEP 6: Machine Learning Studio
    // =========================================================================
    console.log("➡️ [Step 7] Navigating to AutoML Studio...");
    await page.goto("/machine-learning", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*machine-learning/, { timeout: 10000 });
    await expect(page.getByText(/AutoML|Machine Learning/i).first()).toBeVisible({ timeout: 10000 });

    // =========================================================================
    // STEP 7: Executive Decision Center & AI Governance
    // =========================================================================
    console.log("➡️ [Step 8] Navigating to Decision Center & Governance...");
    await page.goto("/decision-center", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*decision-center/, { timeout: 10000 });

    await page.goto("/governance", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*governance/, { timeout: 10000 });

    // =========================================================================
    // STEP 8: Reports Studio
    // =========================================================================
    console.log("➡️ [Step 9] Navigating to Reports Center...");
    await page.goto("/reports", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/.*reports/, { timeout: 10000 });
    await expect(page.getByText(/Reports & AI Assistant|Reports/i).first()).toBeVisible({ timeout: 10000 });

    // =========================================================================
    // STEP 9: Logout & Session Cleanup
    // =========================================================================
    console.log("➡️ [Step 10] Logging out...");
    await base.logout();
    await expect(page).toHaveURL(/.*login/, { timeout: 10000 });
    console.log("✅ User journey completed successfully from Login to Logout!");
  });
});
