import { Page, test } from '@playwright/test';
import { testTarget } from '../../../lib/test-env';
import { Sidebar } from '../../../models/sidebar/sidebar';

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
    await page.goto(`${testTarget.baseUrl}/versions`);
  });

  test('Should have sidebar', async () => {
    const sidebar = new Sidebar(page);
    await sidebar.getSidebar();
  });
  //
  // test('Should have signed in user', async () => {
  //   const toolbar = new CernToolbar(page);
  //   await toolbar.getLocatorText(`Signed in as:${testUser.login} (Drupal)`);
  // });
  //
  // test('Should have sign out', async () => {
  //   const toolbar = new CernToolbar(page);
  //   await toolbar.getLocatorText('Sign out');
  // });
});
