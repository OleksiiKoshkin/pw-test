import { expect, test } from '@playwright/test';
import { invalidUser, standardUser, testUser } from '../../lib/test-user';
import { testTarget } from '../../lib/test-env';

test.describe.configure({ mode: 'serial' });

test.describe('Should pass .env', { tag: '@prerequisites' }, async () => {
  test('Should access tenant data', async () => {
    expect(testTarget.tenant).toBeTruthy();
    expect(testTarget.baseUrl).toBeTruthy();
  });

  test('Should access creds data for main user', async () => {
    expect(testUser.login).toBeTruthy();
    expect(testUser.password).toBeTruthy();
  });

  test('[Optional] Should access creds data for invalid user', async () => {
    test.skip(!invalidUser.login || !invalidUser.password);
    expect(invalidUser.login).toBeTruthy();
    expect(invalidUser.password).toBeTruthy();
  });

  test('[Optional] Should access creds data for standard user', async () => {
    test.skip(!standardUser.login || !standardUser.password);
    expect(standardUser.login).toBeTruthy();
    expect(standardUser.password).toBeTruthy();
  });
});
