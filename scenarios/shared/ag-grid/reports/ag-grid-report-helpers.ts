import { Locator, Page } from '@playwright/test';
import { AgGridReportModel } from './ag-grid-report-model';
import { Widget } from '../../models';
import { GridData, GridDataRow, GridGroupRowHeaders, GridHeaderRow, GridHeaders } from './types';

// CSS selectors are xN faster than Playwright's
const scanVisibleCells = async (dataRows: Locator, mutableData: GridData) => {

  const currentDataPiece = await dataRows.evaluate((e) => {

    const currentData: GridData = [];

    const rows = e.querySelectorAll('div.ag-row');

    rows.forEach((row) => {
      const rowId = row.getAttribute('row-id');
      const rowIndex = row.getAttribute('aria-rowindex');

      if (!rowId) {
        throw 'Row Id not found';
      }

      if (!rowIndex || isNaN(parseInt(rowIndex))) {
        throw 'Row Index not found';
      }

      const tempRow: GridDataRow = {
        rowId: rowId,
        rowIndex: parseInt(rowIndex, 10),
        cols: []
      };

      const columns = row.querySelectorAll('div.ag-cell');

      columns.forEach((column) => {
        const cellText = column.textContent;
        const colId = column.getAttribute('col-id');
        const colIndex = column.getAttribute('aria-colindex');

        if (!colId) {
          throw 'Col Id not found';
        }

        if (!colIndex || isNaN(parseInt(colIndex))) {
          throw 'Col Index not found';
        }

        tempRow.cols.push({
          colId: colId,
          colIndex: parseInt(colIndex, 10),
          value: cellText || ''
        });
      });

      currentData.push(tempRow);
    });

    return currentData;
  });

  currentDataPiece.forEach((row) => {
    const existingRowIndex = mutableData.findIndex((r) => r.rowId === row.rowId);

    if (existingRowIndex === -1) {
      mutableData.push(row); // push all the columns
      return;
    }

    row.cols.forEach((col) => {
      const existingColIdx = mutableData[existingRowIndex].cols.findIndex((c) => c.colId === col.colId);

      if (existingColIdx === -1) {
        mutableData[existingRowIndex].cols.push(col);
      }
    });
  });
};

/*
export const _slow_scanVisibleCells = async (dataRows: Locator, data: GridData) => {
  const rows = await dataRows.locator('css=div.ag-row');// .getByRole('row');
  const rowsCount = await rows.count();

  for (let i = 0; i < rowsCount; ++i) {
    const rowId = await rows.nth(i).getAttribute('row-id');
    const rowIndex = await rows.nth(i).getAttribute('aria-rowindex');

    if (!rowId) {
      throw 'Row Id not found';
    }

    if (!rowIndex || isNaN(parseInt(rowIndex))) {
      throw 'Row Index not found';
    }

    let existingRow = data.find((r) => r.rowId === rowId);
    if (!existingRow) {
      data.push({
        rowId: rowId,
        rowIndex: parseInt(rowIndex, 10),
        cols: []
      });

      existingRow = data.find((r) => r.rowId === rowId);
    }

    const columns = rows.nth(i).locator('css=div.ag-cell'); // .getByRole('gridcell');
    const columnsCount = await columns.count();

    for (let j = 0; j < columnsCount; ++j) {
      const cell = columns.nth(j);
      const colId = await cell.getAttribute('col-id');
      const colIndex = await cell.getAttribute('aria-colindex');

      if (!colId) {
        throw 'Col Id not found';
      }

      if (!colIndex || isNaN(parseInt(colIndex))) {
        throw 'Col Index not found';
      }
      const existingCell = existingRow?.cols.find((c) => c.colId === colId);

      if (!existingCell) {
        const cellText = await cell.textContent();

        existingRow?.cols.push({
          colId: colId,
          colIndex: parseInt(colIndex, 10),
          value: cellText || ''
        });
      }
    }
  }
};
*/

const scanVisibleHeaders = async (headerRowsContainer: Locator, mutableHeadersData: GridHeaders) => {
  const currentHeadersPiece = await headerRowsContainer.evaluate((e) => {
    const currentHeaders: GridHeaders = [];

    const rows = e.querySelectorAll('div.ag-header-row');

    rows.forEach((row) => {
      const rowIndex = row.getAttribute('aria-rowindex');

      if (!rowIndex || isNaN(parseInt(rowIndex))) {
        throw 'Row Index not found';
      }

      const tempRow: GridHeaderRow = {
        rowIndex: parseInt(rowIndex, 10),
        cols: []
      };

      const columns = row.querySelectorAll('div[role=columnheader]');

      columns.forEach((column) => {
        const colId = column.getAttribute('col-id');
        const colIndex = column.getAttribute('aria-colindex');

        if (!colId) {
          throw 'Col Id not found';
        }

        if (!colIndex || isNaN(parseInt(colIndex))) {
          throw 'Col Index not found';
        }

        const cellText = (column.textContent || '')
          .replace(/\n/, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        tempRow.cols.push({
          headerColId: colId,
          headerColIndex: parseInt(colIndex, 10),
          value: cellText || ''
        });
      });

      currentHeaders.push(tempRow);
    });

    return currentHeaders;
  });

  currentHeadersPiece.forEach((row) => {
    const existingRowIndex = mutableHeadersData.findIndex((r) => r.rowIndex === row.rowIndex);

    if (existingRowIndex === -1) {
      mutableHeadersData.push(row); // push all the columns
      return;
    }

    row.cols.forEach((col) => {
      const existingColIdx = mutableHeadersData[existingRowIndex].cols
        .findIndex((c) => c.headerColId === col.headerColId);

      if (existingColIdx === -1) {
        mutableHeadersData[existingRowIndex].cols.push(col);
      }
    });
  });
};

const scanGroupRowHeaders = async (groupRowContainer: Locator, mutableGroupHeadersData: GridGroupRowHeaders) => {
  const currentGroupRowHeadersPiece = await groupRowContainer.evaluate((e) => {
    const currentHeaders: GridGroupRowHeaders = [];

    const rows = e.querySelectorAll('div.ag-row');

    rows.forEach((row) => {
      const rowId = row.getAttribute('row-id');
      const rowIndex = row.getAttribute('aria-rowindex');

      if (!rowId) {
        throw 'GroupRow Id not found';
      }

      if (!rowIndex || isNaN(parseInt(rowIndex))) {
        throw 'GroupRow Index not found';
      }

      const column = row.querySelector('div[role=gridcell]');
      const cellText = (column.textContent || '')
        .replace(/\n/, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      currentHeaders.push({
        rowId: rowId,
        rowIndex: parseInt(rowIndex, 10),
        value: cellText
      });
    });

    return currentHeaders;
  });

  currentGroupRowHeadersPiece.forEach((row) => {
    const existingRowIndex = mutableGroupHeadersData.findIndex((r) => r.rowId === row.rowId);

    if (existingRowIndex === -1) {
      mutableGroupHeadersData.push(row); // push all the columns
      return;
    }
  });
};

export const extractDataFromAgGrid = async (
  page: Page,
  report: Widget,
  mutableData: GridData,
  mutableHeadersData: GridHeaders,
  mutableGroupRowHeadersData: GridGroupRowHeaders
) => {

  const gridReport = new AgGridReportModel(report.targetContainer);

  await gridReport.resetScroll();
  await page.waitForTimeout(100);

  const {
    initialMaxHeight,
    initialMaxWidth,
    visibleHeight,
    visibleWidth
  } = await gridReport.getReportBoundary();

  let shouldScrollY = true;
  let shouldScrollX = true;
  let lastPass = false;

  while (shouldScrollX) {
    shouldScrollY = true;
    await scanVisibleHeaders(gridReport.headersContainer, mutableHeadersData);

    while (shouldScrollY) {
      await scanVisibleCells(gridReport.dataRows, mutableData);
      await scanGroupRowHeaders(gridReport.groupRowContainer, mutableGroupRowHeadersData);

      await gridReport.stepScrollY();
      await page.waitForTimeout(100); // rows are faster

      const curScrollY = await gridReport.getScrollY();

      shouldScrollY = curScrollY < initialMaxHeight - visibleHeight;

      if (!shouldScrollY) {
        // scan last portion of rows
        await scanVisibleCells(gridReport.dataRows, mutableData);
        await scanGroupRowHeaders(gridReport.groupRowContainer, mutableGroupRowHeadersData);
      }
    }

    await gridReport.resetScroll(true, false);
    await page.waitForTimeout(100);

    await gridReport.stepScrollX();
    await page.waitForTimeout(200);

    const curScrollX = await gridReport.getScrollX();

    if (curScrollX >= initialMaxWidth - visibleWidth) {
      // end of X scroll reached, need one more Y scan
      if (!lastPass) {
        lastPass = true;
      } else {
        shouldScrollX = false;
      }
    }
  }
};