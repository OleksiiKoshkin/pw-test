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

test('Should load versions page', async () => {
  await navigateTo(page, 'versions');

  const versionsPage = new VersionsPage(page);
  await versionsPage.waitVersionPageVisibility();

  const versionsCount = await versionsPage.agGridRows.count();
  expect(versionsCount).toBeGreaterThan(1);
});
