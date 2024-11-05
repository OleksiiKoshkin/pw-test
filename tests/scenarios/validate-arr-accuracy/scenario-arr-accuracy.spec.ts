import { expect, Page, test } from '@playwright/test';
import { isTargetDomain, isTargetTenant, navigateTo } from '../../shared/common-utils';
import { scenarioTarget } from './target';
import { BoardPage } from '../../../models/board-page';
import { ARRReport } from './models/arr-report-model';
import { extractDataFromAgGrid, GridData, GridHeaders } from '../helpers/ag-grid-helpers';
import { AgGridReportModel } from '../helpers/ag-grid-report-model';

test.skip(!isTargetDomain(scenarioTarget.domain), 'Incorrect target domain');
test.skip(!isTargetTenant(scenarioTarget.tenant), 'Incorrect target tenant');
test.describe.configure({ mode: 'serial' });

let page: Page;
let report: ARRReport;
let reportGrid: AgGridReportModel;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await navigateTo(page, scenarioTarget.url);
});

test.afterAll(async () => {
  await page.close();
});

const gridData: GridData = [];
const gridHeaders: GridHeaders = [];

test.describe('Check ARR report numbers', { tag: ['@scenario', '@arr_report'] }, async () => {

  test('Should load board page', async () => {

    const boardPage = new BoardPage(page);
    await boardPage.waitBoardPageVisibility();

    const boardTitle = await boardPage.boardTitle.innerText();
    expect(boardTitle).toBeDefined();
    expect(boardTitle.trim()).toBe(scenarioTarget.boardTitle);

    report = new ARRReport(page);
  });

  test('Should load report widget', async () => {
    await report.waitReportVisibility();
  });

  test('Should load report grid', async () => {
    reportGrid = new AgGridReportModel(report.reportContainer);
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
    await extractDataFromAgGrid(page, report, gridData, gridHeaders);
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

  test('Net value of every column equals to the start value of next column', async () => {

    const colCounter = gridData[0].cols.length;
    const lastRowIdx = gridData.length - 1;

    let diffCounter = 0;

    for (let i = 1; i < colCounter; i++) {
      const netValue = gridData[lastRowIdx].cols[i - 1].value;
      const currentTopValue = gridData[0].cols[i].value;

      const netColumnHeader = gridHeaders.map((row) => (row.cols[i - 1].value)).join(', ');
      const currentColumnHeader = gridHeaders.map((row) => (row.cols[i].value)).join(', ');

      if (netValue !== currentTopValue) {
        diffCounter += 1;
      }

      expect.soft(netValue, `NET ${netValue} !== TOP ${currentTopValue} (${netColumnHeader}) - (${currentColumnHeader})`).toBe(currentTopValue);
    }

    expect(diffCounter, `ARR Report has ${diffCounter} gaps on NET-TOP chain (${colCounter})`).toBe(0);
  });
});
