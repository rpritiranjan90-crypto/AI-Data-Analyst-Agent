import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TermsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/terms-of-service");
  }
}