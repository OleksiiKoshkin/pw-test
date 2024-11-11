import { Locator, Page } from '@playwright/test';

export class BoardPage {
  readonly pageContainer: Locator;
  readonly boardPage: Locator;
  readonly boardView: Locator;
  readonly boardTitle: Locator;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = this.page.getByTestId('layout-v2-app-root');
    this.boardPage = this.page.getByTestId('page-layout');
    this.boardView = this.page.getByTestId('board-view');
    this.boardTitle = this.page.locator('h1#static-text-name');
  }

  async waitBoardPageVisibility() {
    await this.pageContainer.waitFor({ state: 'visible' });
    await this.boardPage.waitFor({ state: 'visible' });
    await this.boardView.waitFor({ state: 'visible' });
    await this.boardTitle.waitFor({ state: 'visible' });
  }
}
