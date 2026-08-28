/**
 * Screenshot capture script — run via Playwright to generate project screenshots.
 *
 * Usage:
 *   cd frontend
 *   npm run dev &
 *   sleep 5
 *   npx tsx ../docs/screenshots/capture-screenshots.ts
 *
 * Prerequisites:
 *   npm install -D playwright @playwright/test
 *   npx playwright install chromium
 *
 * Output: docs/screenshots/*.png (1920x1080, full page capture)
 */

import { chromium, type Page, type Browser } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE_URL = process.env.SCREENSHOT_BASE_URL || "http://localhost:5173";
const OUTPUT_DIR = path.resolve(__dirname);
const VIEWPORT = { width: 1920, height: 1080 };
const SCALE = 1; // 100% zoom

// Pages to capture — must be reachable without login first
const PAGES = [
  { name: "01-landing", path: "/", waitFor: "body" },
  { name: "02-login", path: "/login", waitFor: "form" },
  { name: "03-upload", path: "/upload", waitFor: "[data-testid='dropzone']", fallback: "body" },
  { name: "04-dashboard", path: "/dashboard", waitFor: "[data-testid='kpi-grid']", fallback: "body" },
  { name: "05-cleaning", path: "/cleaning", waitFor: "[data-testid='cleaning-studio']", fallback: "body" },
  { name: "06-visualization", path: "/visualization", waitFor: "[data-testid='chart-grid']", fallback: "body" },
  { name: "07-analysis", path: "/analysis", waitFor: "[data-testid='analysis-studio']", fallback: "body" },
  { name: "08-ml", path: "/machine-learning", waitFor: "[data-testid='ml-studio']", fallback: "body" },
  { name: "09-reports", path: "/reports", waitFor: "[data-testid='report-builder']", fallback: "body" },
  { name: "10-ai-insights", path: "/ai-insights", waitFor: "[data-testid='ai-panel']", fallback: "body" },
  { name: "11-recommendations", path: "/recommendations", waitFor: "[data-testid='rec-grid']", fallback: "body" },
  { name: "12-knowledge", path: "/knowledge", waitFor: "[data-testid='rag-search']", fallback: "body" },
  { name: "13-governance", path: "/governance", waitFor: "[data-testid='governance-panel']", fallback: "body" },
  { name: "14-readiness", path: "/readiness", waitFor: "[data-testid='readiness-score']", fallback: "body" },
  { name: "15-admin", path: "/admin", waitFor: "[data-testid='admin-stats']", fallback: "body" },
  { name: "16-decision", path: "/decision", waitFor: "[data-testid='decision-grid']", fallback: "body" },
];

// Pages that require login — will be captured in authenticated state
const AUTHED_PAGES = [
  { name: "17-dashboard-authed", path: "/dashboard", waitFor: "[data-testid='kpi-grid']", fallback: "body" },
];

async function waitForElement(page: Page, selector: string, timeout = 5000): Promise<void> {
  try {
    await page.waitForSelector(selector, { timeout });
  } catch {
    // Element not found within timeout — page loaded without the specific element
  }
}

async function capturePage(
  browser: Browser,
  url: string,
  name: string,
  waitFor: string,
  fallback: string,
  theme: "light" | "dark" = "light"
): Promise<void> {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: theme,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await waitForElement(page, waitFor);
  await page.waitForTimeout(1000); // Let animations settle

  const outputPath = path.join(
    OUTPUT_DIR,
    `${name}${theme === "dark" ? "-dark" : ""}.png`
  );
  await page.screenshot({ path: outputPath, fullPage: false });
  console.log(`✓ Captured: ${path.basename(outputPath)}`);
  await context.close();
}

async function main(): Promise<void> {
  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  console.log(`\n🔍 Screenshot capture for: ${BASE_URL}\n`);

  // 1. Public pages (no auth)
  for (const page of PAGES) {
    const url = `${BASE_URL}${page.path}`;
    console.log(`  → ${page.name}: ${url}`);
    await capturePage(browser, url, page.name, page.waitFor, page.fallback!);
  }

  // 2. Authenticated pages
  //    To capture authed pages, we need a logged-in session.
  //    Set SCREENSHOT_AUTH_TOKEN env var to skip auth and use an existing session,
  //    or set SCREENSHOT_EMAIL + SCREENSHOT_PASSWORD to log in automatically.
  if (process.env.SCREENSHOT_EMAIL && process.env.SCREENSHOT_PASSWORD) {
    const ctx = await browser.newContext({ viewport: VIEWPORT });
    const pg = await ctx.newPage();
    await pg.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    await pg.fill('input[type="email"]', process.env.SCREENSHOT_EMAIL);
    await pg.fill('input[type="password"]', process.env.SCREENSHOT_PASSWORD);
    await pg.click('button[type="submit"]');
    await pg.waitForURL(/dashboard|upload/, { timeout: 10000 });
    await ctx.close();

    console.log("\n  🔐 Logged in — capturing authed pages...");
    for (const page of AUTHED_PAGES) {
      const url = `${BASE_URL}${page.path}`;
      await capturePage(browser, url, page.name, page.waitFor, page.fallback!);
    }
  } else {
    console.log(
      "\n  ⏭ Skipping authed pages (set SCREENSHOT_EMAIL + SCREENSHOT_PASSWORD to capture)"
    );
  }

  // 3. Dark mode variants (subset of key pages)
  const darkModePages = ["01-landing", "02-login", "04-dashboard", "08-ml"];
  console.log("\n  🌙 Capturing dark mode variants...");
  for (const pageName of darkModePages) {
    const page = PAGES.find((p) => p.name === pageName)!;
    await capturePage(
      browser,
      `${BASE_URL}${page.path}`,
      page.name,
      page.waitFor,
      page.fallback!,
      "dark"
    );
  }

  await browser.close();
  console.log(`\n✅ All screenshots saved to: ${OUTPUT_DIR}\n`);
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
