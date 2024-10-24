import { LoginPage } from '../../models/login-page';
import { testTarget } from '../../lib/test-env';
import { Page } from '@playwright/test';
import { Browser } from 'playwright';

export const setTenant = async (page: Page) => (page.goto(`${testTarget.baseUrl}/?tenant-override=${testTarget.tenant}`));

export const loginWithPopupPre = async (browser: Browser) => {
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);

  await setTenant(page);

  const res = await Promise.all([
    page.waitForEvent('popup'),
    loginPage.waitLoginVisible(),
    loginPage.clickLogin()
  ]);

  return { page, loginPage, popup: res[0] };
};


export const loginWithPopupPost = async (page: Page, popup: Page) => {
  if (popup?.close) {
    await popup.close();
  }

  if (page?.close) {
    await page.close();
  }
};
