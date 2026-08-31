import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/BasePage";

test.describe("RAG Knowledge & AI Governance E2E Suite", () => {
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await base.resetAuth();
  });

  test("authenticated user can access RAG Knowledge Base", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/knowledge");
    await expect(page).toHaveURL(/.*knowledge/);
  });

  test("authenticated user can access AI Governance page", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/governance");
    // URL assertion is primary; heading check confirms the right page rendered.
    await expect(page).toHaveURL(/.*governance/, { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: /AI Governance/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("authenticated user can access Production Readiness page", async ({ page }) => {
    const base = new BasePage(page);
    await base.gotoAuthenticated("/readiness");
    // URL assertion is primary; heading check confirms the right page rendered.
    await expect(page).toHaveURL(/.*readiness/, { timeout: 10000 });
    await expect(
      page.getByRole("heading", { name: /Production/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });
});
