import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/dashboard");
  }

  async isKpiVisible() {
    return await this.page.isVisible('text="Total Rows"');
  }
}
