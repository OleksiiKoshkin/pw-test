import { Locator, Page } from '@playwright/test';

export class VersionsPage {
  readonly pageContainer: Locator;
  readonly versionsList: Locator;
  readonly quickSearch: Locator;
  readonly gridRoot: Locator;
  readonly topBar: Locator;
  readonly agGridWrapper: Locator;
  readonly agGridRows: Locator;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = this.page.getByTestId('layout-v2-app-root');
    this.versionsList = this.page.getByTestId('versions-list-v3-root');
    this.quickSearch = this.page.getByTestId('quick-search');
    this.gridRoot = this.page.getByTestId('base-grid-root');
    this.topBar = this.page.getByTestId('topbar-container');
    this.agGridWrapper = this.page.locator('div.ag-root-wrapper');
    this.agGridRows = this.page.locator('div.ag-row');
  }

  async waitVersionPageVisibility() {
    await this.pageContainer.waitFor({ state: 'visible' });
    await this.versionsList.waitFor({ state: 'visible' });
    await this.quickSearch.waitFor({ state: 'visible' });
    await this.gridRoot.waitFor({ state: 'visible' });
    await this.topBar.waitFor({ state: 'visible' });
    await this.agGridWrapper.waitFor({ state: 'visible' });
  }
}
