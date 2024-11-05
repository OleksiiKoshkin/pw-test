import { expect, Page, test } from '@playwright/test';
import { navigateTo } from '../../../shared/common-utils';
import { scenarioTarget } from '../target';
import { ScenarioUrl } from '../../../shared/types';
import { getHeaderText, hasDifferentVersions } from '../../shared/helpers/headers-helpers';
import { ReportWidget } from '../../shared/models/report-widget-model';
import { AgGridReportModel } from '../../shared/ag-grid/ag-grid-report-model';
import { commonReportCheck, CommonReportPayload } from '../../shared/common-report-check';

export async function testArrTarget(target: ScenarioUrl) {
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
        reportWidgetId: 'board-widget-arr'
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

      test('Net value of every column equals to the start value of next column', async () => {
        const lastRowIdx = payload.gridData.length - 1;

        let diffCounter = 0;
        const diffVersions = hasDifferentVersions(payload.gridHeaders);

        for (let i = 1; i < lastColumnToCheck; i++) {
          const netValue = payload.gridData[lastRowIdx].cols[i - 1].value;
          const currentTopValue = payload.gridData[0].cols[i].value;

          const netColumnHeader = getHeaderText(payload.gridHeaders, i - 1, diffVersions);
          const currentColumnHeader = getHeaderText(payload.gridHeaders, i, diffVersions);

          if (netValue !== currentTopValue) {
            diffCounter += 1;
          }

          expect.soft(netValue, `${i}. NET ${netValue} !== TOP ${currentTopValue} (${netColumnHeader} - ${currentColumnHeader})`).toBe(currentTopValue);
        }

        expect(diffCounter, `ARR Report has ${diffCounter} gaps on NET-TOP pairs (out of ${lastColumnToCheck} total)`).toBe(0);
      });
    });
  });
}
