import { Page } from '@playwright/test';
import { testTarget } from '../../lib/test-env';

export const navigateTo = async (page: Page, url: string) => (page.goto(`${testTarget.baseUrl}/${url}`));

export const whichEnvironment = {
  isProd: testTarget.baseUrl.includes('app.fintastic.ai'),
  isStaging: testTarget.baseUrl.includes('app.staging.fintastic.ai'),
  isDev: testTarget.baseUrl.includes('development.fintastic.ai'),
  isLocal: testTarget.baseUrl.includes('localhost:3000')
};
