import { expect, Page, test as base } from '@playwright/test';
import { navigateTo } from '../../shared/common-utils';
import type { PerformanceOptions, PerformanceWorker, PlaywrightPerformance } from 'playwright-performance';
import { playwrightPerformance } from 'playwright-performance';
import { VersionsPage } from '../../../models/versions-page';
import { Sidebar } from '../../../models/sidebar/sidebar';

// https://www.npmjs.com/package/playwright-performance

const test = base.extend<PlaywrightPerformance, PerformanceOptions & PerformanceWorker>({
  performance: playwrightPerformance.performance,
  performanceOptions: [{}, { scope: 'worker' }],
  worker: [playwrightPerformance.worker, { scope: 'worker', auto: true }]
});

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Check versions page performance', async () => {
  test.describe.configure({ mode: 'serial' });

  test('loading performance', async ({ page, performance }) => {

    const startPrep = Date.now();

    await navigateTo(page, 'board'); // should be 404
    const sidebar = new Sidebar(page);
    await sidebar.getSidebar();

    const endPrep = Date.now();
    console.log(`Preparation time: ${endPrep - startPrep} ms`);

    const startExec = Date.now();

    performance.sampleStart('Versions page loading');

    await sidebar.versionsButton.click();
    const versionsPage = new VersionsPage(page);
    await versionsPage.waitVersionPageVisibility();

    performance.sampleEnd('Versions page loading');

    const endExec = Date.now();
    console.log(`Execution time: ${endExec - startExec} ms`);

    console.log('Versions page loading', performance.getSampleTime('Versions page loading'));

    expect(performance.getSampleTime('Versions page loading')).toBeLessThan(3000);
  });
});
