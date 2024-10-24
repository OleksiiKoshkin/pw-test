import { Page } from '@playwright/test';

export class SidebarBoards {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getBoardsButton() {
    return this.page.locator('button[data-testid="sidebar-bar-item-button-boards"]');
  }

  getBoardsSideMenu() {
    return this.page.locator('div[data-testid="sidebar-submenu"]');
  }

  async clickBoardsButton() {
    const boardBtn = this.getBoardsButton();
    return boardBtn.click();
  }
}
