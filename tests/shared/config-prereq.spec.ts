import { expect, test } from '@playwright/test';
import { invalidUser, standardUser, testUser } from '../../lib/test-user';
import { testTarget } from '../../lib/test-env';

test.describe.configure({ mode: 'serial' });

test.describe('Should pass .env', { tag: '@prerequisites' }, async () => {
  test('Should access tenant data', async () => {
    expect(testTarget.tenant).toBeTruthy();
    expect(testTarget.baseUrl).toBeTruthy();
  });

  test('Should access creds data', async () => {
    expect(testUser.login).toBeTruthy();
    expect(testUser.password).toBeTruthy();

    expect(standardUser.login).toBeTruthy();
    expect(standardUser.password).toBeTruthy();

    expect(invalidUser.login).toBeTruthy();
    expect(invalidUser.password).toBeTruthy();
  });
});
