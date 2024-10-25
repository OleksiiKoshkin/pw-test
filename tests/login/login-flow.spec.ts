import { expect, Page, test } from '@playwright/test';
import { LoginPage } from '../../models/login-page';
import { invalidUser, testUser } from '../../lib/test-user';
import { AppPageContainer } from '../../models/app-page-container';
import { loginWithPopupPost, loginWithPopupPre } from '../shared/login-utils';

let page: Page;
let loginPage: LoginPage;
let popup: Page;

test.describe.configure({ mode: 'parallel' });
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login flow', { tag: '@login' }, async () => {
  test.beforeEach(async ({ browser }) => {
    const { popup: _popup, page: _page, loginPage: _loginPage } = await loginWithPopupPre(browser);
    page = _page;
    popup = _popup;
    loginPage = _loginPage;
    // page = await browser.newPage();
    // loginPage = new LoginPage(page);
    // // set tenant
    // await page.goto(`${testTarget.baseUrl}/?tenant-override=${testTarget.tenant}`);
    // // await page.goto(`${testTarget.baseUrl}/versions`);
    // // await page.goto(`${testTarget.baseUrl}`);
    //
    // const res = await Promise.all([
    //   page.waitForEvent('popup'),
    //   loginPage.clickLogin()
    // ]);
    // popup = res[0];
  });

  test.afterEach(async () => {
    await loginWithPopupPost(page, popup);
    // if (popup) {
    //   await popup.close();
    // }
    // await page.close();
  });

  test('Should open Auth0 login on click and access the fields', async () => {
    await popup.waitForSelector('#username');
    await popup.waitForSelector('#password');
    const continueButton = popup.locator('button[type="submit"][name="action"]');
    expect(continueButton).toBeDefined();
    expect(await continueButton.evaluate((node: HTMLElement) => node.innerText)).toBe('Continue');
  });

  test('Should fail login with incorrect creds', async () => {
    test.skip(!invalidUser.login || !invalidUser.password);

    await popup.fill('#username', invalidUser.login);
    await popup.fill('#password', invalidUser.password);
    await popup.getByRole('button', { name: 'Continue', exact: true }).click();

    await loginPage.waitLoginVisible();

    await expect(loginPage.loginTitle).toHaveText('Login failed. The username provided doesn’t exist.');
    await expect(loginPage.loginMessage).toHaveText('Please check your details or contact your administrator for assistance.');
  });

  test('Should pass login with correct creds', async () => {
    await popup.fill('#username', testUser.login);
    await popup.fill('#password', testUser.password);
    await popup.getByRole('button', { name: 'Continue', exact: true }).click();

    const appPage = new AppPageContainer(page);
    await appPage.waitAppPageVisibility();
  });
});
