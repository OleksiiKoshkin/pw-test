import { Page, test } from '@playwright/test';
import { testTarget } from '../../../lib/test-env';
import { SidebarBoards } from '../../../models/sidebar/sidebar-boards';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Check sidebar boards', async () => {
  test.beforeAll(async () => {
    await page.goto(`${testTarget.baseUrl}/versions`);
  });

  test('Should have Boards button', async () => {
    const sidebarBoards = new SidebarBoards(page);
    await sidebarBoards.clickBoardsButton();
    await sidebarBoards.getBoardsSideMenu().waitFor({ state: 'visible' });
  });
});
