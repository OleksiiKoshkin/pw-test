import { expect, Page, test } from '@playwright/test';
import { scenarioTarget } from '../target';
import { ScenarioUrl } from '../../../../shared/types';
import { commonReportCheck, CommonReportPayload } from '../../../shared/common-report-check';
import { AgGridReportModel } from '../../../shared/ag-grid/ag-grid-report-model';
import { ReportWidget } from '../../../shared/models/report-widget-model';
import { navigateTo } from '../../../../shared/common-utils';
import { getNumberValueOrZero } from '../../../shared/numbers-helper';
import { getHeaderText, hasDifferentVersions } from '../../../shared/helpers/headers-helpers';

export async function testNetCalc(target: ScenarioUrl) {
  const payload: CommonReportPayload = {
    page: {} as Page,
    reportGrid: {} as AgGridReportModel,
    reportWidget: {} as ReportWidget,
    gridData: [],
    gridHeaders: [],
    groupRowHeaders: []
  };

  let revenueIdx = -1;
  let costOfGoodSoldIdx = -1;
  let operatingExpensesIdx = -1;
  let otherIncomeIdx = -1;
  let otherExpensesIdx = -1;
  let netIdx = -1;

  test.describe(`Check ${target.name}`, async () => {
    test.describe.configure({ mode: 'serial' });

    test.describe(`Internal checks ${target.name}`, async () => {
      test.describe.configure({ mode: 'serial' });

      test.beforeAll('Open page', async ({ browser }) => {
        payload.page = await browser.newPage();
        await navigateTo(payload.page, target.url);
      });

      await commonReportCheck({
        payload,
        boardTitle: scenarioTarget.specific!.boardTitle,
        reportWidgetId: 'board-widget-pnl'
      });
    });

    test.describe(`Scenario checks ${target.name}`, async () => {
      test.describe.configure({ mode: 'serial' });

      test.afterAll(async () => {
        await payload?.page?.close();
      });

      test('Should include critical lines', async () => {
        revenueIdx = payload.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('1. revenue'));
        costOfGoodSoldIdx = payload.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('2. cost of goods sold'));
        operatingExpensesIdx = payload.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('3. operating expenses'));
        otherIncomeIdx = payload.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('4. other income'));
        otherExpensesIdx = payload.groupRowHeaders.findIndex((group) => group.value.toLowerCase().includes('5. other expenses'));
        netIdx = payload.groupRowHeaders.findIndex((group) => group.value.toLowerCase() === 'net');

        expect(revenueIdx, '1. Revenue').toBeGreaterThan(-1);
        expect(costOfGoodSoldIdx, '2. Cost of good sold').toBeGreaterThan(-1);
        expect(operatingExpensesIdx, '3. Operating expenses').toBeGreaterThan(-1);
        expect(otherIncomeIdx, '4. Other income').toBeGreaterThan(-1);
        expect(otherExpensesIdx, '5. Other expenses').toBeGreaterThan(-1);
        expect(netIdx, 'Net').toBeGreaterThan(-1);
        expect(netIdx, 'Net to data').toBe(payload.gridData.length - 1); // idx from 0
      });

      test('Check Net calculation', async () => {
        let diffCounter = 0;
        const diffVersions = hasDifferentVersions(payload.gridHeaders);

        for (let colIdx = 0; colIdx < payload.gridData[0].cols.length; colIdx++) {
          const revenueValue = getNumberValueOrZero(payload.gridData[revenueIdx].cols[colIdx].value);
          const costOfGoodSold = getNumberValueOrZero(payload.gridData[costOfGoodSoldIdx].cols[colIdx].value);
          const operatingExpenses = getNumberValueOrZero(payload.gridData[operatingExpensesIdx].cols[colIdx].value);
          const otherIncome = getNumberValueOrZero(payload.gridData[otherIncomeIdx].cols[colIdx].value);
          const otherExpenses = getNumberValueOrZero(payload.gridData[otherExpensesIdx].cols[colIdx].value);
          const net = getNumberValueOrZero(payload.gridData[netIdx].cols[colIdx].value);

          // Net line is calculated as follows (for the example below - we can tune for other PnL templates):
          // Revenue+COST OF GOOD SOLD+OPERATING EXPENSES+Other Income-Other Expenses
          const result = revenueValue + costOfGoodSold + operatingExpenses + otherIncome - otherExpenses;

          if (result !== net) {
            diffCounter += 1;
            const colHeader = getHeaderText(payload.gridHeaders, colIdx, diffVersions);
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
            `PNL Report Net Calc has ${diffCounter} error(s) (on ${payload.gridData[0].cols.length} columns total)`
          ).toBe(0);
        }
      });
    });
  });
}
