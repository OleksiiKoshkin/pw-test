import { expect, Page, test } from '@playwright/test';
import { navigateTo } from '../../../shared/common-utils';
import { scenarioTarget } from '../target';
import { BoardPage } from '../../../../models/board-page';
import { extractDataFromAgGrid, GridData, GridHeaders } from '../../ag-grid/ag-grid-helpers';
import { AgGridReportModel } from '../../ag-grid/ag-grid-report-model';
import { ScenarioUrl } from '../../../shared/types';
import { getHeaderText, hasDifferentVersions } from '../../helpers/headers-helpers';
import { ReportWidget } from '../../models/report-widget-model';

export async function testArrTarget(target: ScenarioUrl) {
  test.describe(`Check ${target.name}`, async () => {
    test.describe.configure({ mode: 'serial' });

    let page: Page;
    let reportWidget: ReportWidget;
    let reportGrid: AgGridReportModel;

    const gridData: GridData = [];
    const gridHeaders: GridHeaders = [];

    let lastColumnToCheck = 0;

    test.beforeAll('Open page', async ({ browser }) => {
      page = await browser.newPage();
      await navigateTo(page, target.url);
    });

    test.afterAll(async () => {
      await page.close();
    });

    test('Should load board page', async () => {
      const boardPage = new BoardPage(page);
      await boardPage.waitBoardPageVisibility();

      const boardTitle = await boardPage.boardTitle.innerText();
      expect(boardTitle).toBeDefined();
      expect(boardTitle.trim()).toBe(scenarioTarget.specific!.boardTitle);

      reportWidget = new ReportWidget(page, 'board-widget-arr');
    });

    test('Should load report widget', async () => {
      await reportWidget.waitReportWidgetVisibility();
    });

    test('Should load report grid', async () => {
      reportGrid = new AgGridReportModel(reportWidget.reportContainer);
      await reportGrid.waitGridVisibility();
    });

    test('Should have headers', async () => {
      await reportGrid.headersContainer.waitFor({ state: 'visible' });
      expect(await reportGrid.headerRows.count()).toBeGreaterThan(0);
    });

    test('Should have Net cell', async () => {
      const netGroupCell = await reportGrid.netCellGroup.count();
      expect(netGroupCell).toBe(1);
    });

    test('Should collapse all records', async () => {
      await reportGrid.collapseAll();
    });

    test('Should collect all the data from grid', async () => {
      await extractDataFromAgGrid(page, reportWidget, gridData, gridHeaders);
    });

    test('Data should exist and have correct shape', async () => {
      expect(gridData.length, 'Data is too short').toBeGreaterThan(1);
      const colCounter = gridData[0].cols.length;
      expect(colCounter, 'Columns list is too short').toBeGreaterThan(1);

      let hasInconsistency = false;
      gridData.forEach((row) => {
        if (row.cols.length !== colCounter) {
          hasInconsistency = true;
        }
      });

      expect(hasInconsistency, 'Has shape inconsistency').toBeFalsy();
    });

    test('Headers should exist and have correct shape', async () => {
      expect(gridHeaders.length, 'Headers is too short').toBeGreaterThan(0);
      const headerColCounter = gridHeaders[0].cols.length;
      expect(headerColCounter, 'Headers columns list is too short').toBeGreaterThan(1);

      const dataColCounter = gridData[0].cols.length;
      expect(
        headerColCounter,
        `Headers columns length (${headerColCounter}) does not match data columns length (${dataColCounter})`
      ).toBe(dataColCounter);

      let hasInconsistency = false;
      gridHeaders.forEach((row) => {
        if (row.cols.length !== headerColCounter) {
          hasInconsistency = true;
        }
      });

      expect(hasInconsistency, 'Has header shape inconsistency').toBeFalsy();
    });

    test('Should have Total column(s)', async () => {
      const lastMeaningColumnIndex = gridHeaders[0].cols.findIndex((col) => col.value.toLowerCase().includes('total')) - 1;
      expect(lastMeaningColumnIndex).toBeGreaterThan(0);
      const colCounter = gridData[0].cols.length;
      expect(lastMeaningColumnIndex).toBeLessThan(colCounter);

      lastColumnToCheck = lastMeaningColumnIndex;
    });

    test('Net value of every column equals to the start value of next column', async () => {
      const lastRowIdx = gridData.length - 1;

      let diffCounter = 0;
      const diffVersions = hasDifferentVersions(gridHeaders);

      for (let i = 1; i < lastColumnToCheck; i++) {
        const netValue = gridData[lastRowIdx].cols[i - 1].value;
        const currentTopValue = gridData[0].cols[i].value;

        const netColumnHeader = getHeaderText(gridHeaders, i - 1, diffVersions);
        const currentColumnHeader = getHeaderText(gridHeaders, i, diffVersions);

        if (netValue !== currentTopValue) {
          diffCounter += 1;
        }

        expect.soft(netValue, `${i}. NET ${netValue} !== TOP ${currentTopValue} (${netColumnHeader} - ${currentColumnHeader})`).toBe(currentTopValue);
      }

      expect(diffCounter, `ARR Report has ${diffCounter} gaps on NET-TOP pairs (out of ${lastColumnToCheck} total)`).toBe(0);
    });
  });
}
