import { Locator, Page } from '@playwright/test';

export class ReportWidget {
  readonly reportContainer: Locator;

  private readonly widgetId: string;
  private readonly page: Page;

  constructor(page: Page, reportWidgetId: string) {
    this.page = page;
    this.widgetId = reportWidgetId;

    this.reportContainer = this.page.getByTestId(this.widgetId);
  }

  async waitReportWidgetVisibility() {
    await this.reportContainer.waitFor({ state: 'visible' });
  }
}
