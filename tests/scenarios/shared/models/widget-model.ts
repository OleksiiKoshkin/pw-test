import { Locator, Page } from '@playwright/test';

export class Widget {
  readonly targetContainer: Locator;

  private readonly widgetId: string;
  private readonly page: Page;

  constructor(page: Page, reportWidgetId: string) {
    this.page = page;
    this.widgetId = reportWidgetId;

    this.targetContainer = this.page.getByTestId(this.widgetId);
  }

  async waitWidgetVisibility() {
    await this.targetContainer.waitFor({ state: 'visible' });
  }
}
