import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class GDPRPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/settings/gdpr");
  }
}
