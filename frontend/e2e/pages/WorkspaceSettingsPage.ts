import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class WorkspaceSettingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/settings/workspace");
  }

  async getPageHeading(): Promise<string> {
    return await this.page.getByRole("heading").first().textContent() ?? "";
  }

  async getCurrentPlan(): Promise<string | null> {
    return await this.page.getByText(/free|pro|enterprise/i).first().textContent();
  }
}
