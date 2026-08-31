import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ForgotPasswordPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/forgot-password");
  }

  async requestReset(email: string) {
    await this.page.fill('input[type="email"]', email);
    await this.page.click('button[type="submit"]');
  }
}