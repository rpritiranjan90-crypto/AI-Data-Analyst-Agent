import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class BillingCancelPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/billing/cancel");
  }

  async isCancelMessageVisible(): Promise<boolean> {
    return await this.page.getByText(/cancel/i).first().isVisible();
  }
}
