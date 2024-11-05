import { Locator, Page } from '@playwright/test';

export class ARRReport {
  readonly widgetId = 'board-widget-arr';
  readonly reportContainer: Locator;
  private page: Page;

  constructor(page: Page) {
    this.page = page;

    this.reportContainer = this.page.getByTestId(this.widgetId);
  }

  async waitReportVisibility() {
    await this.reportContainer.waitFor({ state: 'visible' });
  }
}
