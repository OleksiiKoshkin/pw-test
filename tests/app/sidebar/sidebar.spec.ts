import { Page, test } from '@playwright/test';
import { Sidebar } from '../../../models/sidebar/sidebar';
import { navigateTo } from '../../shared/common-utils';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Check sidebar', async () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeAll(async () => {
    await navigateTo(page, 'versions');
  });


  test('Should have sidebar', async () => {
    const sidebar = new Sidebar(page);
    await sidebar.getSidebar();
  });
});
