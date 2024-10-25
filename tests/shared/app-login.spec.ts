import { Page, test } from '@playwright/test';
import { testUser } from '../../lib/test-user';
import { AppPageContainer } from '../../models/app-page-container';
import { loginWithPopupPost, loginWithPopupPre } from './login-utils';

let page: Page;
let popup: Page;

test.describe.configure({ mode: 'serial' });
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('App login with creds', { tag: '@login-to-app' }, async () => {
  test.beforeEach(async ({ browser }) => {
    const { popup: _popup, page: _page } = await loginWithPopupPre(browser);
    page = _page;
    popup = _popup;
  });

  test.afterEach(async () => {
    await loginWithPopupPost(page, popup);
  });

  test('Should login with correct creds', async () => {
    await popup.fill('#username', testUser.login);
    await popup.fill('#password', testUser.password);
    await popup.getByRole('button', { name: 'Continue', exact: true }).click();

    const appPage = new AppPageContainer(page);
    await appPage.waitAppPageVisibility();

    // store creds
    await page.context().storageState({ path: './setup/storage-state.json' });
  });
});
