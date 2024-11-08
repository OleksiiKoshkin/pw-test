import { expect, test } from '@playwright/test';
import {
  AgGridReportModel,
  CommonReportPayload,
  getHeaderText,
  getNumberValueOrZero,
  getReportData,
  hasDifferentVersions,
  ScenarioRunContext
} from '../../shared';

export async function testNetCalc(params: ScenarioRunContext) {
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

  let revenueIdx = -1;
  let costOfGoodSoldIdx = -1;
  let operatingExpensesIdx = -1;
  let otherIncomeIdx = -1;
  let otherExpensesIdx = -1;
  let netIdx = -1;

  // not async!
  test.describe('Collecting data', () => {
    getReportData(params, testData);
  });

  test('Should include critical lines', async () => {
    revenueIdx = testData.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('1. revenue'));
    costOfGoodSoldIdx = testData.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('2. cost of goods sold'));
    operatingExpensesIdx = testData.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('3. operating expenses'));
    otherIncomeIdx = testData.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('4. other income'));
    otherExpensesIdx = testData.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('5. other expenses'));
    netIdx = testData.groupRowHeaders.findIndex((group) => group.value.toLowerCase() === 'net');

    expect(revenueIdx, '1. Revenue').toBeGreaterThan(-1);

    expect(costOfGoodSoldIdx, '2. Cost of good sold').toBeGreaterThan(-1);
    expect(operatingExpensesIdx, '3. Operating expenses').toBeGreaterThan(-1);
    expect(otherIncomeIdx, '4. Other income').toBeGreaterThan(-1);
    expect(otherExpensesIdx, '5. Other expenses').toBeGreaterThan(-1);
    expect(netIdx, 'Net').toBeGreaterThan(-1);
    expect(netIdx, 'Net to data').toBe(testData.gridData.length - 1); // idx from 0
  });

  test('Check Net calculation', async () => {
    let diffCounter = 0;
    const diffVersions = hasDifferentVersions(testData.gridHeaders);

    for (let colIdx = 0; colIdx < testData.gridData[0].cols.length; colIdx++) {
      const revenueValue = getNumberValueOrZero(testData.gridData[revenueIdx].cols[colIdx].value);
      const costOfGoodSold = getNumberValueOrZero(testData.gridData[costOfGoodSoldIdx].cols[colIdx].value);
      const operatingExpenses = getNumberValueOrZero(testData.gridData[operatingExpensesIdx].cols[colIdx].value);
      const otherIncome = getNumberValueOrZero(testData.gridData[otherIncomeIdx].cols[colIdx].value);
      const otherExpenses = getNumberValueOrZero(testData.gridData[otherExpensesIdx].cols[colIdx].value);
      const net = getNumberValueOrZero(testData.gridData[netIdx].cols[colIdx].value);

      // Net line is calculated as follows (for the example below - we can tune for other PnL templates):
      // Revenue+COST OF GOOD SOLD+OPERATING EXPENSES+Other Income-Other Expenses
      const result = revenueValue + costOfGoodSold + operatingExpenses + otherIncome - otherExpenses;

      if (result !== net) {
        diffCounter += 1;
        const colHeader = getHeaderText(testData.gridHeaders, colIdx, diffVersions);
        // console.log('colHeader', colHeader);
        // console.log('revenueValue', revenueValue);
        // console.log('costOfGoodSold', costOfGoodSold);
        // console.log('operatingExpenses', operatingExpenses);
        // console.log('otherIncome', otherIncome);
        // console.log('otherExpenses', otherExpenses);
        // console.log('net', net);

        const message = `${colHeader || 'Column'}: ${result} != NET (${net}) != ${revenueValue} + ${costOfGoodSold} + ${operatingExpenses} + ${otherIncome} - ${otherExpenses}`;

        expect.soft(
          result, message
        ).toBe(net);
      }
    }

    if (diffCounter > 0) {
      expect(
        diffCounter,
        `PNL Report Net Calc has ${diffCounter} error(s) (on ${testData.gridData[0].cols.length} columns total)`
      ).toBe(0);
    }
  });
}
