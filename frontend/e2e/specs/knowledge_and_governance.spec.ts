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
  });

  test("should render Production Readiness Assessment", async ({ page }) => {
    await page.goto("/readiness");
    await expect(page).toHaveURL(/.*readiness/);
  });
});
