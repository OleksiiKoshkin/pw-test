import { expect, Page, test } from '@playwright/test';
import { ScenarioRunContext } from '../../types';
import { LoginPage } from '../../models/login-page';
import { testUser } from '../../lib/test-user';
import { AppPageContainer } from '../../models/app-page-container';

export function testLoginFlow(params: ScenarioRunContext) {
  let popup: Page;

  test('Should display login page', async () => {
    const loginPage = new LoginPage(params.page!);
    await loginPage.waitLoginVisible();
  });

  test.describe('Login flow', async () => {
    test.beforeAll(async () => {
      const loginPage = new LoginPage(params.page!);

      const res = await Promise.all([
        params.page!.waitForEvent('popup'),
        loginPage.waitLoginVisible(),
        loginPage.clickLogin()
      ]);

      popup = res[0];
    });

    test.afterAll(async () => {
      if (popup?.close) {
        await popup.close();
      }
    });

    test('Should open Auth0 login on click and access the fields', async () => {
      await popup.waitForSelector('#username');
      await popup.waitForSelector('#password');
      const continueButton = popup.locator('button[type="submit"][name="action"]');
      expect(continueButton).toBeDefined();
      expect(await continueButton.evaluate((node: any) => node.innerText)).toBe('Continue');
    });

    // test('Should fail login with incorrect creds', async () => {
    //   test.skip(!invalidUser.login || !invalidUser.password);
    //
    //   await popup.fill('#username', invalidUser.login);
    //   await popup.fill('#password', invalidUser.password);
    //   await popup.getByRole('button', { name: 'Continue', exact: true }).click();
    //
    //   await loginPage.waitLoginVisible();
    //
    //   await expect(loginPage.loginTitle).toHaveText('Login failed. The username provided doesn’t exist.');
    //   await expect(loginPage.loginMessage).toHaveText('Please check your details or contact your administrator for assistance.');
    // });

    test('Should pass login with correct creds', async () => {
      await popup.fill('#username', testUser.login);
      await popup.fill('#password', testUser.password);
      await popup.getByRole('button', { name: 'Continue', exact: true }).click();

      const appPage = new AppPageContainer(params.page!);
      await appPage.waitAppPageVisibility();
    });

    test(`Should be logged in to ${params.domain}/${params.tenant}`, async () => {
      const appPage = new AppPageContainer(params.page!);
      const { user, tenant } = await appPage.getCurrentUserAndTenant();

      expect(user, 'Check user').toEqual(testUser.login);
      expect(tenant, 'Check tenant').toEqual(params.tenant);
    });

    // todo: check logout
    // todo: update login page selectors
  });
}
