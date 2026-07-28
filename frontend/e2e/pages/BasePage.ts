import { Page } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  async getTitle() {
    return await this.page.title();
  }

  async waitForHeader(text: string) {
    await this.page.waitForSelector(`text=${text}`);
  }
}
