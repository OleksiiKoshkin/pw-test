/* eslint-disable no-param-reassign */
import { expect, Page, test } from '@playwright/test';
import { BoardPage } from '../../../models/board-page';
import { ReportWidget } from './models/report-widget-model';
import { AgGridReportModel } from './ag-grid/ag-grid-report-model';
import { extractDataFromAgGrid, GridData, GridGroupRowHeaders, GridHeaders } from './ag-grid/ag-grid-helpers';

export type CommonReportPayload = {
  page: Page;
  reportWidget?: ReportWidget;
  reportGrid?: AgGridReportModel;
  gridData: GridData;
  gridHeaders: GridHeaders;
  groupRowHeaders: GridGroupRowHeaders;
}

export type CommonParams = {
  payload: CommonReportPayload,
  reportWidgetId: string,
  boardTitle: string,
}

export async function commonReportCheck({
                                          payload,
                                          reportWidgetId,
                                          boardTitle
                                        }: CommonParams) {

  test('Should load board page', async () => {
    const boardPage = new BoardPage(payload.page);
    await boardPage.waitBoardPageVisibility();

    const curBoardTitle = await boardPage.boardTitle.innerText();
    expect(curBoardTitle).toBeDefined();
    expect(curBoardTitle.trim()).toBe(boardTitle);

    payload.reportWidget = new ReportWidget(payload!.page, reportWidgetId);
  });

  test('Should load report widget', async () => {
    await payload.reportWidget?.waitReportWidgetVisibility();
  });

  test('Should load report grid', async () => {
    payload.reportGrid = new AgGridReportModel(payload.reportWidget!.reportContainer);
    await payload.reportGrid.waitGridVisibility();
  });

  test('Should have headers', async () => {
    await payload.reportGrid!.headersContainer.waitFor({ state: 'visible' });
    expect(await payload.reportGrid!.headerRows.count()).toBeGreaterThan(0);
  });

  test('Should have Net cell', async () => {
    const netGroupCell = await payload.reportGrid!.netCellGroup.count();
    expect(netGroupCell).toBe(1);
  });

  test('Should collapse all records', async () => {
    await payload.reportGrid!.collapseAll();
  });

  test('Should collect all the data from grid', async () => {
    await extractDataFromAgGrid(
      payload.page,
      payload.reportWidget!,
      payload.gridData,
      payload.gridHeaders,
      payload.groupRowHeaders);

    console.log('groupRowHeaders', payload.groupRowHeaders);
  });

  test('Data should exist and have correct shape', async () => {
    expect(payload.gridData.length, 'Data is too short').toBeGreaterThan(1);
    const colCounter = payload.gridData[0].cols.length;
    expect(colCounter, 'Columns list is too short').toBeGreaterThan(1);

    let hasInconsistency = false;
    payload.gridData.forEach((row) => {
      if (row.cols.length !== colCounter) {
        hasInconsistency = true;
      }
    });

    expect(hasInconsistency, 'Has shape inconsistency').toBeFalsy();
  });

  test('Headers should exist and have correct shape', async () => {
    expect(payload.gridHeaders.length, 'Headers is too short').toBeGreaterThan(0);
    const headerColCounter = payload.gridHeaders[0].cols.length;
    expect(headerColCounter, 'Headers columns list is too short').toBeGreaterThan(1);

    const dataColCounter = payload.gridData[0].cols.length;
    expect(
      headerColCounter,
      `Headers columns length (${headerColCounter}) does not match data columns length (${dataColCounter})`
    ).toBe(dataColCounter);

    let hasInconsistency = false;
    payload.gridHeaders.forEach((row) => {
      if (row.cols.length !== headerColCounter) {
        hasInconsistency = true;
      }
    });

    expect(hasInconsistency, 'Has header shape inconsistency').toBeFalsy();
  });

  test('Row headers should exist and have correct shape', async () => {
    expect(payload.groupRowHeaders.length, 'Group row headers is too short').toBeGreaterThan(0);

    const dataRowCounter = payload.gridData.length;
    expect(
      payload.groupRowHeaders.length,
      `Group row headers columns length (${payload.groupRowHeaders.length}) does not match data length (${dataRowCounter})`
    ).toBe(dataRowCounter);
  });
}