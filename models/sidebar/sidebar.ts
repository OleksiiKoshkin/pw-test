import { Locator, Page } from '@playwright/test';

export class Sidebar {
  readonly versionsButton: Locator;
  readonly boardsButton: Locator;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.boardsButton = this.page.getByTestId('sidebar-bar-item-button-boards');
    this.versionsButton = this.page.getByTestId('sidebar-bar-item-button-versions');
  }

  getSidebarSelector() {
    return this.page.locator('div[data-testid="sidebar-bar"]');
  }

  async getSidebar() {
    return this.getSidebarSelector().waitFor({ state: 'visible' });
  }
}
