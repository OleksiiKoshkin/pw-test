import { expect, test } from '@playwright/test';
import {
  ConfigTargetVariant,
  ensureEndSlash,
  ensureStartQuestion,
  getConfigTargets,
  getScenarioName,
  PlayerParams,
  ScenarioRunContext,
  Widget
} from '../shared';
import { LoginPage } from '../../../models/login-page';
import { testUser } from '../../../lib/test-user';
import { domainTypes, tenants } from '../../shared/types';
import { AppPageContainer } from '../../../models/app-page-container';

export function scenarioPlayer({ scenarioId, testExecutor }: PlayerParams) {
  const targets = getConfigTargets(scenarioId);

  if (!testUser.login) {
    throw new Error('Empty login!');
  }

  if (!testUser.password) {
    throw new Error('Empty password!');
  }

  const scenarioName = getScenarioName(scenarioId);

  test.describe(`${scenarioName} (${targets.length})`, { tag: ['@scenario', '@' + scenarioId] }, async () => {
    test.skip(targets.length === 0, `Targets not found for "${scenarioId}"`);
    test.describe.configure({ mode: 'parallel' });

    targets.forEach((target, targetIdx) => {
      test.describe(`Target ${targetIdx + 1}: ${target.domain}/${target.tenant}`, { tag: ['@' + target.domain, '@' + target.tenant] }, async () => {
        test.describe.configure({ mode: 'parallel' });

        test.skip(!domainTypes[target.domain], 'Invalid domain ' + target.domain);
        test.skip(!tenants[target.tenant], 'Invalid tenant ' + target.tenant);

        test.skip(!target.targetWidgetId, 'Empty targetWidgetId');
        test.skip(!target.url, 'Empty Target URL');

        const baseUrl = (target.domain === 'local' ? 'http://' : 'https://') + domainTypes[target.domain];

        (target.variants || [{ name: 'Default' }]).forEach((variant: ConfigTargetVariant, variantIdx: number) => {
          test.describe(`${variantIdx + 1}. ${variant.name}`, { tag: ['@' + variant.name.replace(/\s+/g, '_')] }, async () => {
            test.describe.configure({ mode: 'serial' });

            const runContext: ScenarioRunContext = {
              page: undefined,
              popup: undefined,
              widget: undefined
            };

            test.beforeAll(async ({ browser }) => {
              console.log(`Execute login for ${target.domain}/${target.tenant}@${testUser.login}...`);

              runContext.page = await browser.newPage();
              const loginPage = new LoginPage(runContext.page);
              await runContext.page.goto(`${baseUrl}/?tenant-override=${target.tenant}`);

              const res = await Promise.all([
                runContext.page.waitForEvent('popup'),
                loginPage.waitLoginVisible(),
                loginPage.clickLogin()
              ]);

              runContext.popup = res[0];

              await runContext.popup.fill('#username', testUser.login);
              await runContext.popup.fill('#password', testUser.password);
              await runContext.popup.getByRole('button', { name: 'Continue', exact: true }).click();

              const appPage = new AppPageContainer(runContext.page);
              await appPage.waitAppPageVisibility();

              console.log(`Login done for ${target.domain}/${target.tenant}@${testUser.login}...`);
            });

            test.afterAll(async () => {
              if (runContext.popup?.close) {
                await runContext.popup.close();
              }

              if (runContext.page?.close) {
                await runContext.page.close();
              }
              console.log(`Close page ${target.domain}/${target.tenant}@${testUser.login}`);
            });

            test(`Should be logged in to ${target.domain}/${target.tenant}`, async () => {
              expect(runContext.page, 'Run context is not initialized').toBeDefined();

              const appPage = new AppPageContainer(runContext.page!);
              const { user, tenant } = await appPage.getCurrentUserAndTenant();

              expect(user, 'Invalid user').toEqual(testUser.login);
              expect(tenant, 'Invalid tenant').toEqual(target.tenant);
            });

            test('Should navigate to target URL/widget', async () => {
              const targetUrl = ensureEndSlash(baseUrl) + target.url + ensureStartQuestion(variant.queryParams);
              await runContext.page!.goto(targetUrl);

              const appPage = new AppPageContainer(runContext.page!);
              await appPage.waitAppPageVisibility();

              if (target.targetWidgetId) {
                runContext.widget = new Widget(runContext.page!, target.targetWidgetId!);
                await runContext.widget.waitWidgetVisibility();

                expect(runContext.widget, `Target widget (${target.targetWidgetId}) should be visible`).toBeDefined();
              }
            });

            test.describe(`Testing ${scenarioName}: ${variant.name}`, async () => {
              test.describe.configure({ mode: 'serial' });
              testExecutor(runContext);
            });
          });
        });
      });
    });
  });
}