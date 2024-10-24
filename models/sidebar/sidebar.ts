import { Page } from '@playwright/test';

export class Sidebar {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getSidebarSelector() {
    return this.page.locator('div[data-testid="sidebar-bar"]');
  }

  async getSidebar() {
    return this.getSidebarSelector().waitFor({ state: 'visible' });
  }
}
