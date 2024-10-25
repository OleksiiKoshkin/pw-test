import { Page } from '@playwright/test';
import { testTarget } from '../../lib/test-env';

export const navigateTo = async (page: Page, url: string) => (page.goto(`${testTarget.baseUrl}/${url}`));
