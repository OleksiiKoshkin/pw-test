import { LoginPage } from '../../models';
import { Page } from '@playwright/test';

export const loginWithPopupPre = async (page: Page) => {
  const loginPage = new LoginPage(page);

  const res = await Promise.all([
    page.waitForEvent('popup'),
    loginPage.waitLoginVisible(),
    loginPage.clickLogin()
  ]);

  return { page, loginPage, popup: res[0] };
};
