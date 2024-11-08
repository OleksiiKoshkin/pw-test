import { expect, test } from '@playwright/test';
import { ensureEndSlash, ensureStartQuestion, getConfigTargets, getScenarioName, Widget } from '../shared';
import { LoginPage } from '../../models/login-page';
import { testUser } from '../../lib/test-user';
import { AppPageContainer } from '../../models/app-page-container';
import { ConfigTargetVariant, domainTypes, PlayerParams, ScenarioRunContext, tenants } from '../../types';

export function scenarioPlayer({ scenarioId, testExecutor }: PlayerParams) {
  const targets = getConfigTargets(scenarioId);

  if (!testUser.login) {
    throw new Error('Empty login!');
  }

  if (!testUser.password) {
    throw new Error('Empty password!');
  }

  const scenarioName = getScenarioName(scenarioId);
  console.log();
  test.describe(`${scenarioName} (${targets.length})`, { tag: ['@scenario', '@' + scenarioId] }, async () => {
    if (targets.length === 0) {
      console.log(`Targets not found for "${scenarioId}"`);
    }
    test.skip(targets.length === 0, `Targets not found for "${scenarioId}"`);
    test.describe.configure({ mode: 'parallel' });
    test.use({ storageState: { cookies: [], origins: [] } });

    console.log('Prepare scenario', scenarioName, `(${scenarioId})`);

    targets.forEach((target, targetIdx) => {
      test.describe(`Target ${targetIdx + 1}: ${target.domain}:${target.tenant}`, { tag: ['@' + target.domain, '@' + target.tenant] }, async () => {
        console.log('  Target:', target.domain + ':' + target.tenant, target.name || '', target.url);
        console.log('    name:', target.name || '-');
        console.log('     url:', target.url || '-');
        console.log('  widget:', target.targetWidgetId || '-');

        test.describe.configure({ mode: 'parallel' });

        test.skip(!domainTypes[target.domain], 'Invalid domain ' + target.domain);
        test.skip(!tenants[target.tenant], 'Invalid tenant ' + target.tenant);

        // test.skip(!target.targetWidgetId, 'Empty targetWidgetId');
        // test.skip(!target.url, 'Empty Target URL');

        const baseUrl = (target.domain === 'local' ? 'http://' : 'https://') + domainTypes[target.domain];

        (!target.variants || target.variants.length === 0 ? [{
          name: 'Default single variant',
          id: '0',
          queryParams: ''
        }] : target.variants).forEach((variant: ConfigTargetVariant, variantIdx: number) => {
          test.describe(`${variantIdx + 1}. ${variant.name}`, { tag: ['@' + variant.name.replace(/\s+/g, '_')] }, async () => {
            test.describe.configure({ mode: 'serial' });

            console.log('        ',
              (variantIdx + 1) + '.',
              variant.name || '',
              'Params:',
              variant.queryParams ? variant.queryParams.substring(0, 20) + '...' + variant.queryParams.substring(variant.queryParams.length - 20) : 'no params');

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