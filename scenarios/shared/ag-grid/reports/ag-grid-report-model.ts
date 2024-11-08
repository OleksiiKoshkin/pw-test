/* eslint-disable no-param-reassign */
import { Locator } from '@playwright/test';

export class AgGridReportModel {
  readonly agGridWrapper: Locator;
  readonly agGridRows: Locator;
  readonly netCellGroup: Locator;
  readonly dataRows: Locator;
  readonly scrollableContent: Locator;
  readonly hClipper: Locator;
  readonly hScroller: Locator;
  readonly vScroller: Locator;
  readonly firstRow: Locator;
  readonly lastRow: Locator;
  readonly firstRowCells: Locator;
  readonly lastRowCells: Locator;

  readonly headerMenuButton: Locator;
  readonly expandAllButton: Locator;
  readonly collapseAllButton: Locator;

  readonly headersContainer: Locator;
  readonly headerRows: Locator;

  readonly groupRowContainer: Locator;
  readonly groupRows: Locator;

  private initialMaxHeight = 0;
  private initialMaxWidth = 0;
  private visibleHeight = 0;
  private visibleWidth = 0;

  private containerLocator: Locator;

  constructor(containerLocator: Locator) {
    this.containerLocator = containerLocator;

    this.agGridWrapper = this.containerLocator.locator('div.ag-root-wrapper');
    this.agGridRows = this.agGridWrapper.locator('div.ag-row');

    this.headerMenuButton = this.agGridWrapper.locator('.ag-header-cell-menu-button');
    this.expandAllButton = this.agGridWrapper.getByText('Expand All');
    this.collapseAllButton = this.agGridWrapper.getByText('Collapse All');

    this.netCellGroup = this.agGridRows.getByRole('gridcell', { name: 'Net' });

    this.dataRows = this.agGridWrapper.locator('div.ag-center-cols-container[role=rowgroup]');

    this.scrollableContent = this.containerLocator.locator('div.ag-body-viewport'); // initial height
    this.hClipper = this.containerLocator.locator('div.ag-center-cols-clipper'); // initial width

    this.hScroller = this.containerLocator.locator('div.ag-center-cols-viewport');
    this.vScroller = this.containerLocator.locator('div.ag-body-viewport'); // the same as scrollableContent

    this.firstRow = this.dataRows.locator('css=div.ag-row-first');
    this.lastRow = this.dataRows.locator('css=div.ag-row-last');

    this.firstRowCells = this.firstRow.locator('css=div.ag-cell-value');
    this.lastRowCells = this.lastRow.locator('css=div.ag-cell-value');

    this.headersContainer = this.agGridWrapper.locator('css=div.ag-header-viewport ');
    this.headerRows = this.headersContainer.locator('css=div.ag-header-row');

    this.groupRowContainer = this.agGridWrapper.locator('css=div.ag-pinned-left-cols-container');
    this.groupRows = this.groupRowContainer.locator('css=div.ag-row');
  }

  async waitGridVisibility() {
    await this.containerLocator.waitFor({ state: 'visible' });
    await this.agGridWrapper.waitFor({ state: 'visible' });
    await this.scrollableContent.waitFor({ state: 'visible' });
  }

  async expandAll() {
    await this.headerMenuButton.first().click();
    await this.expandAllButton.waitFor({ state: 'visible' });
    await this.expandAllButton.click();
    await this.expandAllButton.waitFor({ state: 'hidden' });
  }

  async collapseAll() {
    await this.headerMenuButton.first().click();
    await this.collapseAllButton.waitFor({ state: 'visible' });
    await this.collapseAllButton.click();
    await this.collapseAllButton.waitFor({ state: 'hidden' });
  }

  async resetScroll(vertical = true, horizontal = true) {
    if (vertical) {
      await this.vScroller.evaluate((e) => {
        e.scrollTop = 0;
      });
    }

    if (horizontal) {
      await this.hScroller.evaluate((e) => {
        e.scrollLeft = 0;
      });
    }
  }

  async getReportBoundary() {
    this.initialMaxHeight = await this.vScroller.evaluate((node) => node.scrollHeight);
    this.initialMaxWidth = await this.hScroller.evaluate((node) => node.scrollWidth);

    this.visibleHeight = await this.vScroller.evaluate((node) => node.clientHeight);
    this.visibleWidth = await this.hClipper.evaluate((node) => node.clientWidth);

    return {
      initialMaxHeight: this.initialMaxHeight,
      initialMaxWidth: this.initialMaxWidth,
      visibleHeight: this.visibleHeight,
      visibleWidth: this.visibleWidth
    };
  }

  async stepScrollY() {
    if (this.visibleHeight === 0) {
      throw new Error('Please specify a height (call getReportBoundary)');
    }

    await this.vScroller.evaluate((e, params) => {
      e.scrollTop += params.visibleHeight * .8; // overlap
    }, { visibleHeight: this.visibleHeight });
  }

  async stepScrollX() {
    if (this.visibleWidth === 0) {
      throw new Error('Please specify a width (call getReportBoundary)');
    }

    await this.hScroller.evaluate((e, params) => {
      e.scrollLeft += params.visibleWidth * .8; // overlap
    }, { visibleWidth: this.visibleWidth });
  }

  async getScrollY() {
    return await this.scrollableContent.evaluate((node) => node.scrollTop);
  }

  async getScrollX() {
    return await this.hScroller.evaluate((node) => node.scrollLeft);
  }
}
