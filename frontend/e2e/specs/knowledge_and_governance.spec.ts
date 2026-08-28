import { test, expect } from "@playwright/test";
import { KnowledgePage } from "../pages/KnowledgePage";

test.describe("RAG Knowledge & AI Governance E2E Suite", () => {
  test("should render RAG Knowledge Base", async ({ page }) => {
    const knowledge = new KnowledgePage(page);
    await knowledge.goto();
    await expect(page).toHaveURL(/.*knowledge/);
  });

  test("should render AI Governance Telemetry", async ({ page }) => {
    await page.goto("/governance");
    await expect(page).toHaveURL(/.*governance/);
    // Should show token consumption or similar live metrics
    await expect(page.getByText(/Token|Consumption|Request|Governance/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("should render Production Readiness Assessment", async ({ page }) => {
    await page.goto("/readiness");
    await expect(page).toHaveURL(/.*readiness/);
    // Page shows a loading spinner first, then the diagnostics button appears
    await expect(page.getByText(/Production Operations|Deployment Readiness/i).first()).toBeVisible({ timeout: 5000 });
  });

  test("should run production readiness checks and show a grade", async ({ page }) => {
    await page.goto("/readiness");
    // Page auto-runs checks on mount; wait for the grade text to appear
    await expect(page.getByText(/Grade [A-F]\+?/i).first()).toBeVisible({ timeout: 30000 });
    // Should show the scorecard with points/checks text
    await expect(page.getByText(/points across|automated checks/i).first()).toBeVisible({ timeout: 30000 });
  });
});
