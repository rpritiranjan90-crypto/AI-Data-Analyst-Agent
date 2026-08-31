import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/signup");
  }

  async signup(name: string, email: string, password: string, company?: string) {
    await this.page.fill('input[autocomplete="name"]', name);
    await this.page.fill('input[type="email"]', email);
    if (company) {
      await this.page.fill('input[autocomplete="organization"]', company);
    }
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}