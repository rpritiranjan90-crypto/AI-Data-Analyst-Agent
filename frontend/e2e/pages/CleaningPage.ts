import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CleaningPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/cleaning");
  }

  async clickAutoClean() {
    await this.page.click("button:has-text('Auto Clean')");
  }
}
