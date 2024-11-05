import { Page } from '@playwright/test';

export class LoginPage {
  readonly loginButton;
  readonly loginTitle;
  readonly loginWelcome;
  readonly loginMessage;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    // this.loginButton = this.page.getByTestId('login-button')
    this.loginButton = this.page.locator('button >> nth=0')

    this.loginWelcome = this.page.getByTestId('login-welcome');

    // this.loginTitle = this.page.getByTestId('error-alert-title');
    this.loginTitle = this.page.getByText('Welcome to fintastic');

    //this.loginMessage = this.page.getByTestId('error-alert-message');
    this.loginMessage = this.page.getByText('Please login into your account');
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
