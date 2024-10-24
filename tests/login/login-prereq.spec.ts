import { expect, Page, test } from '@playwright/test';
import { LoginPage } from '../../models/login-page';
import { testTarget } from '../../lib/test-env';

test.describe.configure({ mode: 'serial' });
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Should display login page with login button and welcome message', { tag: '@login-prerequisites' }, async () => {
  let page: Page;
  let loginPage: LoginPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    await page.goto(`${testTarget.baseUrl}/versions`);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Should have login button and welcome message', async () => {
    await loginPage.waitLoginVisible();
    await expect(loginPage.loginTitle).toHaveText('Welcome to fintastic');
    await expect(loginPage.loginMessage).toHaveText('Please login into your account');
  });
});
