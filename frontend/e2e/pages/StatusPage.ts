import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class StatusPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/status");
  }
}