import { expect, Page, test } from '@playwright/test';
import { LoginPage } from '../../models/login-page';
import { testUser } from '../../lib/test-user';
import { AppPageContainer } from '../../models/app-page-container';
import { loginWithPopupPost, loginWithPopupPre } from '../shared/login-utils.-ts';

let page: Page;
let loginPage: LoginPage;
let popup: Page;

test.describe('Logout flow', { tag: '@logout' }, async () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.beforeEach(async ({ browser }) => {
    const { popup: _popup, page: _page, loginPage: _loginPage } = await loginWithPopupPre(browser);
    page = _page;
    popup = _popup;
    loginPage = _loginPage;
  });

  test.afterEach(async () => {
    await loginWithPopupPost(page, popup);
  });

  test('Should login and logout', async () => {
    await popup.fill('#username', testUser.login);
    await popup.fill('#password', testUser.password);
    await popup.getByRole('button', { name: 'Continue', exact: true }).click();

    const appPage = new AppPageContainer(page);

    await appPage.clickLogoutButton();
    await loginPage.waitLoginVisible();

    await expect(loginPage.loginTitle).toHaveText('Welcome to fintastic');
    await expect(loginPage.loginMessage).toHaveText('Please login into your account');
  });
});
