import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AnalysisPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/analysis");
  }

  async sendQuery(query: string) {
    await this.page.fill('input[placeholder*="Ask"]', query);
    await this.page.click('button[type="submit"]');
  }
}
