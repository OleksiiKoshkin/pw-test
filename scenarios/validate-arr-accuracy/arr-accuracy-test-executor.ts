import { expect, test } from '@playwright/test';
import { CommonReportPayload, ScenarioRunContext } from '../../types';
import { AgGridReportModel, getHeaderText, getReportData, hasDifferentVersions } from '../../scenarios-player';

export function testArrNumberChains(params: ScenarioRunContext) {
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

  test.describe('Checking structure', () => {
    test('Should have Total column(s)', async () => {
      const lastMeaningColumnIndex = testData.gridHeaders[0].cols.findIndex((col) => col.value.toLowerCase().includes('total')) - 1;
      expect(lastMeaningColumnIndex).toBeGreaterThan(0);

      const colCounter = testData.gridData[0].cols.length;
      expect(lastMeaningColumnIndex).toBeLessThan(colCounter);

      lastColumnToCheck = lastMeaningColumnIndex;
    });
  });

  test('Net value of every column equals to the start value of next column', async () => {
    const lastRowIdx = testData.gridData.length - 1;

    let diffCounter = 0;
    const diffVersions = hasDifferentVersions(testData.gridHeaders);

    for (let i = 1; i < lastColumnToCheck; i++) {
      const netValue = testData.gridData[lastRowIdx].cols[i - 1].value;
      const currentTopValue = testData.gridData[0].cols[i].value;

      const netColumnHeader = getHeaderText(testData.gridHeaders, i - 1, diffVersions);
      const currentColumnHeader = getHeaderText(testData.gridHeaders, i, diffVersions);

      if (netValue !== currentTopValue) {
        diffCounter += 1;
      }

      expect.soft(netValue, `${i}. NET ${netValue} !== TOP ${currentTopValue} (${netColumnHeader} - ${currentColumnHeader})`).toBe(currentTopValue);
    }

    expect(diffCounter, `ARR Report has ${diffCounter} gaps on NET-TOP pairs (out of ${lastColumnToCheck} total)`).toBe(0);
  });
}
