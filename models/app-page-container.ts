import { Locator, Page } from '@playwright/test';

export class AppPageContainer {
  readonly pageContainer: Locator;
  readonly sidebarContainer: Locator;
  readonly logoutButton: Locator;
  readonly logoutMenuButton: Locator;
  readonly logoutMenu: Locator;
  readonly logoutBackdrop: Locator;

  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = this.page.getByTestId('layout-v2-app-root');
    this.sidebarContainer = this.page.getByTestId('sidebar-bar');

    // @todo: test id for logout, logout menu, avatar
    this.logoutMenuButton = this.sidebarContainer.locator('button.MuiAvatar-root');
    this.logoutBackdrop = this.page.locator('.MuiBackdrop-root');

    this.logoutButton = this.sidebarContainer
      .getByRole('button')
      .filter({ hasText: 'Log Out' });

    // @todo: data-testid!
    this.logoutMenu = this.page.locator('div.MuiPopover-root > div.MuiPaper-root > div.MuiBox-root');
  }

  async waitAppPageVisibility() {
    await this.pageContainer.waitFor({ state: 'visible' });
    await this.logoutMenuButton.waitFor({ state: 'visible' });
  }

  async openLogoutMenu() {
    await this.logoutMenuButton.click();
    await this.logoutMenuButton.waitFor({ state: 'visible' });
  }

  async clickLogoutButton() {
    await this.logoutMenuButton.waitFor({ state: 'visible' });
    await this.logoutMenuButton.click();
    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click();
  }

  async getCurrentUserAndTenant() {
    // open menu
    await this.logoutMenuButton.waitFor({ state: 'visible' });
    await this.logoutMenuButton.click();
    await this.logoutMenu.waitFor({ state: 'visible' });

    // @todo: replace with data-testid
    const user = await this.logoutMenu.getByRole('paragraph').nth(0).textContent();
    const tenant = await this.logoutMenu.getByRole('paragraph').nth(1).textContent();

    // close menu
    await this.logoutBackdrop.click();
    await this.logoutMenu.waitFor({ state: 'hidden' });

    return {
      user, tenant
    };
  }
}
