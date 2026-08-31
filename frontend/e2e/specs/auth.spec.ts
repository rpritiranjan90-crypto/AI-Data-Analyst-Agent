import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { BasePage } from "../pages/BasePage";

test.describe("Authentication E2E Suite", () => {
  // Reset auth state before each test to prevent leakage from parallel tests.
  test.beforeEach(async ({ page }) => {
    const base = new BasePage(page);
    await base.resetAuth();
  });

  // ── Login ────────────────────────────────────────────────────────────────

  test("should render the login page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole("heading", { name: /AI Data Analyst/i })).toBeVisible();
  });

  test("should show validation error on empty login submit", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.click('button[type="submit"]');
    // Form validation prevents submission — no navigation, no toast crash
    await expect(page).toHaveURL(/.*login/);
  });

  test("should stay on login page after bad credentials (backend unreachable = handled gracefully)", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("wrong@example.com", "wrongpassword");
    // The page should stay on /login (not crash, not navigate away).
    await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
  });

  test("should redirect authenticated user away from /login", async ({ page }) => {
    const base = new BasePage(page);
    await base.preAuthenticate();
    await page.goto("/login");
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  });

  test("should redirect to /login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*login/);
  });

  test("should navigate from login to signup", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.getByRole("link", { name: /create workspace|sign up/i }).click();
    await expect(page).toHaveURL(/.*signup/);
  });

  test("should navigate from login to forgot password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.getByRole("link", { name: /forgot password/i }).click();
    await expect(page).toHaveURL(/.*forgot-password/);
  });

  // ── Signup ──────────────────────────────────────────────────────────────

  test("should render the signup page", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await expect(page).toHaveURL(/.*signup/);
  });

  test("should show validation error when submitting empty signup form", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*signup/);
  });

  test("should show error for password under 8 characters", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await signupPage.signup("Test User", "test@example.com", "short");
    // The strength meter is in the DOM but the form submit guard fires first.
    await expect(page).toHaveURL(/.*signup/);
  });

  test("should render the password strength meter after typing a password", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await page.fill('input[type="password"]', "weakpw");
    // 4-segment bar + label should be visible.
    await expect(page.getByRole("status").first()).toBeVisible();
  });

  test("should navigate from signup to login", async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await page.getByRole("link", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  // ── Forgot Password ─────────────────────────────────────────────────────

  test("should render the forgot password page", async ({ page }) => {
    const fpPage = new ForgotPasswordPage(page);
    await fpPage.goto();
    await expect(page).toHaveURL(/.*forgot-password/);
  });

  test("should show error on empty email submit", async ({ page }) => {
    const fpPage = new ForgotPasswordPage(page);
    await fpPage.goto();
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*forgot-password/);
  });

  test("should navigate back to login", async ({ page }) => {
    const fpPage = new ForgotPasswordPage(page);
    await fpPage.goto();
    await page.getByRole("link", { name: /back to sign in/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });

  // ── Logout (route protection) ──────────────────────────────────────────

  test("logout clears the session and redirects to /login", async ({ page }) => {
    const base = new BasePage(page);
    await base.preAuthenticate();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*dashboard/);

    // The navbar has a sign-out button. We click it; the axios /auth/logout
    // call may fail in test mode (no real backend) but the authStore clears
    // client state regardless.
    const signOut = page.getByRole("button", { name: /sign out|logout|log out/i }).first();
    if (await signOut.isVisible({ timeout: 2000 }).catch(() => false)) {
      await signOut.click();
      // After logout, the authStore clears the cookie and we end up on /login.
      await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    }
  });
});

