import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AdminPortalPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/admin");
  }

  async isAdminPanelVisible(): Promise<boolean> {
    return await this.page.getByText(/Admin|admin/i).first().isVisible();
  }
}
