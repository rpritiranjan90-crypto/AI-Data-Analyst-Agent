import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class UploadPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.navigateTo("/upload");
  }

  async uploadFile(filePath: string) {
    await this.page.setInputFiles('input[type="file"]', filePath);
  }
}
