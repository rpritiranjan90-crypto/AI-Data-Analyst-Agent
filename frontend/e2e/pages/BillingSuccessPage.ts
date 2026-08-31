import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BillingSuccessPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/billing/success");
  }

  async getSuccessMessage(): Promise<string> {
    return await this.page.getByText(/success|activated|plan/i).first().textContent() ?? "";
  }
}
