import { expect, test } from '@playwright/test';
import { CommonReportPayload, ScenarioRunContext } from '../../../types';
import {
  AgGridReportModel,
  getHeaderText,
  getNumberValue,
  getReportData,
  hasDifferentVersions
} from '../../../scenarios-player';

export async function testPnlLines(params: ScenarioRunContext) {
  const testData: CommonReportPayload = {
    reportGrid: {} as AgGridReportModel,
    gridData: [],
    gridHeaders: [],
    groupRowHeaders: []
  };

  test.beforeAll(async () => {
    testData.reportGrid = {} as AgGridReportModel;
    testData.gridData.length = 0;
    testData.gridHeaders.length = 0;
    testData.groupRowHeaders.length = 0;
  });

  let lastColumnToCheck = 0;

  // not async!
  test.describe('Collecting data', () => {
    getReportData(params, testData);
  });

  test('Should have Total column(s)', async () => {
    const lastMeaningColumnIndex = testData.gridHeaders[0].cols.findIndex((col) => col.value.toLowerCase().includes('total')) - 1;
    expect(lastMeaningColumnIndex).toBeGreaterThan(0);
    const colCounter = testData.gridData[0].cols.length;
    expect(lastMeaningColumnIndex).toBeLessThan(colCounter);

    lastColumnToCheck = lastMeaningColumnIndex;
  });

  test('Check 10x diff between columns', async () => {
    let diffCounter = 0;
    const diffVersions = hasDifferentVersions(testData.gridHeaders);

    for (let rowIdx = 0; rowIdx < testData.gridData.length - 1; rowIdx++) {
      const row = testData.gridData[rowIdx];

      for (let colIdx = 1; colIdx < lastColumnToCheck; colIdx++) {
        const prevValue = row.cols[colIdx - 1].value;
        const thisValue = row.cols[colIdx].value;

        const prevNumber = getNumberValue(prevValue);
        const thisNumber = getNumberValue(thisValue);
        const multiplier = Math.max(prevNumber, thisNumber) / Math.min(prevNumber, thisNumber);

        if (multiplier > 10) {
          diffCounter += 1;
          const rowHeader = testData.groupRowHeaders[rowIdx];
          const prevHeader = getHeaderText(testData.gridHeaders, colIdx - 1, diffVersions);
          const thisHeader = getHeaderText(testData.gridHeaders, colIdx, diffVersions);

          const message = `${rowHeader.value || 'Row'} (${prevHeader} - ${thisHeader}): ${prevValue} and ${thisValue} have more than 10x diff (x${multiplier.toFixed(1)}, ${prevNumber} and ${thisNumber})`;

          expect.soft(
            multiplier, message
          ).toBeLessThan(10);
        }
      }
    }

    if (diffCounter > 0) {
      expect(
        diffCounter,
        `PNL Report should has ${diffCounter} of 10x violations  (${testData.gridData.length - 1}x${testData.gridData[0].cols.length} total)`
      ).toBe(0);
    }
  });
}
