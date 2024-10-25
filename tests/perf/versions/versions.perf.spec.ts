import { expect, Page, test } from '@playwright/test';
import { navigateTo } from '../../shared/common-utils';
import { VersionsPage } from '../../../models/versions-page';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Check versions page performance', async () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await navigateTo(page, 'versions');
  });

  test('Should load versions page', async () => {
    const versionsPage = new VersionsPage(page);
    await versionsPage.waitVersionPageVisibility();

    const versionsCount = await versionsPage.agGridRows.count();
    expect(versionsCount).toBeGreaterThan(1);
  });
});
