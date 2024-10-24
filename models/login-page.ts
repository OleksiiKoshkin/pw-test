import { Page } from '@playwright/test';

export class LoginPage {
  readonly loginButton;
  readonly loginTitle;
  readonly loginWelcome;
  readonly loginMessage;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = this.page.getByTestId('login-button');
    this.loginWelcome = this.page.getByTestId('login-welcome');
    this.loginTitle = this.page.getByTestId('error-alert-title');
    this.loginMessage = this.page.getByTestId('error-alert-message');
    // this.loginMessage = this.page.locator('div[data-testid="login-welcome"] >> div[data-testid="error-alert-message"]');
  }

  async clickLogin() {
    return this.loginButton.click();
  }

  async waitLoginVisible() {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginTitle.waitFor({ state: 'visible' });
    await this.loginMessage.waitFor({ state: 'visible' });
  }
}
