import { Page, expect } from "@playwright/test";

/**
 * Mint a JWT-shaped string for tests. The signature is not verified by
 * the frontend (only the `exp` claim is), so any value works.
 */
function mintTestToken(expiresInSec: number = 3600): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    .replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
  const payload = btoa(
    JSON.stringify({
      sub: "u1",
      email: "test@example.com",
      type: "access",
      exp: Math.floor(Date.now() / 1000) + expiresInSec,
    })
  ).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
  const sig = btoa("test-sig").replace(/=+$/, "");
  return `${header}.${payload}.${sig}`;
}

export class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  async getTitle() {
    return await this.page.title();
  }

  /**
   * Wait for the URL to change away from a pattern.
   * Use this instead of expect().not.toHaveURL() to avoid race conditions
   * where the redirect hasn't fired yet when the assertion runs.
   */
  async waitForUrlNot(urlPattern: RegExp, timeout = 8000): Promise<void> {
    await this.page.waitForURL((url) => !urlPattern.test(url.href), { timeout });
  }

  async waitForHeader(text: string) {
    await this.page.waitForSelector(`text=${text}`);
  }

  /**
   * Pre-authenticate the page as a logged-in user by setting the ada_access
   * cookie (C1) and seeding the Zustand persisted state. After calling this,
   * the next page.goto() will treat the user as authenticated.
   *
   * The cookie (set via addCookies) persists across ALL navigations regardless
   * of the addInitScript. localStorage is wiped by addInitScript on every goto,
   * so we re-seed it after each navigation via gotoAuthenticated().
   */
  async preAuthenticate(
    userOverrides: Partial<{
      id: string;
      email: string;
      name: string;
      role: "Owner" | "Admin" | "Data Scientist" | "Analyst" | "Viewer";
    }> = {}
  ): Promise<void> {
    const user = {
      id: "u1",
      email: "test@example.com",
      name: "Test User",
      role: "Owner" as const,
      ...userOverrides,
    };
    const token = mintTestToken();
    // Navigate to / first so the addInitScript runs (clears any stale state).
    // Then set our auth state AFTER the init script has fired.
    await this.page.goto("/", { waitUntil: "domcontentloaded" });

    // Use Playwright's native addCookies() for reliable cookie persistence
    // across navigations — document.cookie in evaluate() is unreliable with
    // SameSite=Strict in headless contexts.
    await this.page.context().addCookies([
      {
        name: "ada_access",
        value: token,
        domain: "localhost",
        path: "/",
        sameSite: "Strict",
        httpOnly: false,
        secure: false,
      },
    ]);

    // Wait for the cookie to be readable before proceeding.
    await this.page.waitForFunction(
      () => document.cookie.includes("ada_access"),
      { timeout: 5000 }
    );

    // Seed the Zustand persisted store so the auth UI is happy.
    // NOTE: this localStorage will be wiped by the addInitScript on the NEXT
    // goto. See gotoAuthenticated() which re-seeds after each navigation.
    await this.page.evaluate(
      ({ user, token }) => {
        localStorage.setItem(
          "ada-auth-storage",
          JSON.stringify({
            state: {
              user,
              token,
              isAuthenticated: true,
              isGuest: false,
              workspaces: [
                {
                  id: "ws_default",
                  name: `${user.name}'s Workspace`,
                  role: "Owner",
                  plan: "free",
                },
              ],
              activeWorkspace: {
                id: "ws_default",
                name: `${user.name}'s Workspace`,
                role: "Owner",
                plan: "free",
              },
            },
          })
        );
      },
      { user, token }
    );

    // Wait for full app load (lazy chunks, etc.) before returning so the caller
    // can immediately navigate without a network-burst.
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Pre-authenticate and then navigate to the given path in one call.
   * Most tests use this rather than the two-step preAuthenticate + goto.
   */
  async gotoAuthenticated(path: string, role: "Owner" | "Admin" | "Analyst" = "Owner"): Promise<void> {
    await this.preAuthenticate({ role });
    // Re-seed localStorage AFTER the goto, because the addInitScript clears it
    // on every navigation. The cookie persists (set via addCookies), so the
    // Zustand store will rehydrate from the cookie + the localStorage we just
    // re-seeded.
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
    await this.page.evaluate(
      ({ role }) => {
        const user = {
          id: "u1",
          email: "test@example.com",
          name: "Test User",
          role,
        };
        const token = (document.cookie.match(/ada_access=([^;]+)/) || [])[1] || "";
        localStorage.setItem(
          "ada-auth-storage",
          JSON.stringify({
            state: {
              user,
              token,
              isAuthenticated: true,
              isGuest: false,
              workspaces: [
                {
                  id: "ws_default",
                  name: `${user.name}'s Workspace`,
                  role: "Owner",
                  plan: "free",
                },
              ],
              activeWorkspace: {
                id: "ws_default",
                name: `${user.name}'s Workspace`,
                role: "Owner",
                plan: "free",
              },
            },
          })
        );
      },
      { role }
    );
    await this.page.waitForLoadState("networkidle");
    // Wait for either the URL to match (success) or to be redirected.
    await expect(this.page).toHaveURL(new RegExp(path.replace(/\//g, "\\/")));
  }

  /**
   * Clear all auth state so the browser starts as unauthenticated.
   * Call this in beforeEach to prevent auth state leaking between tests.
   *
   * We clear cookies via the Playwright API (which is a real client-side
   * clear, not a JS hack) and wipe localStorage after navigating to the
   * app origin. We do this BEFORE any page.goto in the actual test runs.
   */
  async resetAuth(): Promise<void> {
    // 1) Clear all cookies in the browser context. This is a true cookie
    //    clear, not a JS hack — catches cookies with any path/secure flag.
    await this.page.context().clearCookies();
    // 2) Navigate to the app origin so we can touch localStorage.
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
    // 3) Wipe any auth-related localStorage.
    await this.page.evaluate(() => {
      try { localStorage.removeItem("ai_analyst_jwt_token"); } catch {}
      try { localStorage.removeItem("ada-auth-storage"); } catch {}
    });
  }
}
