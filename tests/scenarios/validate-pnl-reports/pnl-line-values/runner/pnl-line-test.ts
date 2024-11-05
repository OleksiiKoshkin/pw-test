import { expect, Page, test } from '@playwright/test';
import { scenarioTarget } from '../target';
import { ScenarioUrl } from '../../../../shared/types';
import { commonReportCheck, CommonReportPayload } from '../../../shared/common-report-check';
import { AgGridReportModel } from '../../../shared/ag-grid/ag-grid-report-model';
import { ReportWidget } from '../../../shared/models/report-widget-model';
import { navigateTo } from '../../../../shared/common-utils';
import { getNumberValue } from '../../../shared/numbers-helper';
import { getHeaderText, hasDifferentVersions } from '../../../shared/helpers/headers-helpers';

export async function testPnlLines(target: ScenarioUrl) {
  const payload: CommonReportPayload = {
    page: {} as Page,
    reportGrid: {} as AgGridReportModel,
    reportWidget: {} as ReportWidget,
    gridData: [],
    gridHeaders: [],
    groupRowHeaders: []
  };

  let lastColumnToCheck = 0;

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
        reportWidgetId: 'board-widget-pnl_vendor'
      });
    });

    test.describe(`Scenario checks ${target.name}`, async () => {
      test.describe.configure({ mode: 'serial' });
      test.afterAll(async () => {
        await payload?.page?.close();
      });

      test('Should have Total column(s)', async () => {
        const lastMeaningColumnIndex = payload.gridHeaders[0].cols.findIndex((col) => col.value.toLowerCase().includes('total')) - 1;
        expect(lastMeaningColumnIndex).toBeGreaterThan(0);
        const colCounter = payload.gridData[0].cols.length;
        expect(lastMeaningColumnIndex).toBeLessThan(colCounter);

        lastColumnToCheck = lastMeaningColumnIndex;
      });

      test('Check 10x diff between columns', async () => {
        let diffCounter = 0;
        const diffVersions = hasDifferentVersions(payload.gridHeaders);

        for (let rowIdx = 0; rowIdx < payload.gridData.length - 1; rowIdx++) {
          const row = payload.gridData[rowIdx];

          for (let colIdx = 1; colIdx < lastColumnToCheck; colIdx++) {
            const prevValue = row.cols[colIdx - 1].value;
            const thisValue = row.cols[colIdx].value;

            const prevNumber = getNumberValue(prevValue);
            const thisNumber = getNumberValue(thisValue);
            const multiplier = Math.max(prevNumber, thisNumber) / Math.min(prevNumber, thisNumber);

            if (multiplier > 10) {
              diffCounter += 1;
              const rowHeader = payload.groupRowHeaders[rowIdx];
              const prevHeader = getHeaderText(payload.gridHeaders, colIdx - 1, diffVersions);
              const thisHeader = getHeaderText(payload.gridHeaders, colIdx, diffVersions);

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
            `PNL Report should has ${diffCounter} of 10x violations  (${payload.gridData.length - 1}x${payload.gridData[0].cols.length} total)`
          ).toBe(0);
        }
      });
    });
  });
}
