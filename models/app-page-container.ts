import { Page } from '@playwright/test';

export class AppPageContainer {
  readonly pageContainer;
  readonly logoutButton;
  readonly logoutMenuButton;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.pageContainer = this.page.getByTestId('layout-v2-app-root');

    // @todo: test id for logout, logout menu, avatar
    this.logoutMenuButton = this.page.locator('button.MuiAvatar-root');
    this.logoutButton = this.page
      .getByRole('button')
      .filter({ hasText: 'Log Out' });
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
}
