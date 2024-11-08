import { expect, test } from '@playwright/test';
import { ensureEndSlash, ensureStartQuestion, getConfigTargets, getScenarioName, Widget } from './';
import { testUser } from '../lib/test-user';
import {
  ConfigTargetVariant,
  domainTypes,
  KnownScenario,
  knownScenarios,
  PlayerParams,
  ScenarioRunContext,
  tenants
} from '../types';
import { LoginPage } from '../models/login-page';
import { AppPageContainer } from '../models/app-page-container';

const onlyScenario = process.env.ONLY_SCENARIO;
if (onlyScenario) {
  console.log('Run only | Scenario', onlyScenario);

  if (!knownScenarios.includes(onlyScenario as KnownScenario)) {
    throw new Error(`Unknown scenario "${onlyScenario}": not listed in ${knownScenarios.join(', ')}`);
  }
}

const onlyEnvironment = process.env.ONLY_ENVIRONMENT;
if (onlyEnvironment) {
  console.log('Run only | Environment', onlyEnvironment);

  if (!domainTypes[onlyEnvironment]) {
    throw new Error(`No such environment "${onlyEnvironment}" (from ${Object.keys(domainTypes).join(', ')})}`);
  }
}

const onlyTenant = process.env.ONLY_TENANT;
if (onlyTenant) {
  console.log('Run only | Tenant', onlyTenant);

  if (!tenants[onlyTenant]) {
    throw new Error(`No such tenant "${onlyTenant}" (from ${Object.keys(tenants).join(', ')})}`);
  }
}

export function scenarioPlayer({ scenarioId, testExecutor }: PlayerParams) {
  const targets = getConfigTargets(scenarioId);

  if (targets.length === 0) {
    console.log(`Environment: targets not found for "${scenarioId}", skip`);
    return;
  }

  const scenarioName = getScenarioName(scenarioId);
  console.log();
  test.describe(`${scenarioName} (${targets.length})`, { tag: ['@' + scenarioId] }, async () => {
    const shouldSkipByScenario = !!onlyScenario && scenarioId !== onlyScenario;

    test.skip(targets.length === 0, `Targets not found for "${scenarioId}"`);
    test.skip(shouldSkipByScenario, `Skip for onlyScenario "${onlyScenario}"`);

    test.describe.configure({ mode: 'parallel' });
    test.use({ storageState: { cookies: [], origins: [] } });
    if (shouldSkipByScenario) {
      return;
    }

    console.log('Prepare scenario', scenarioName, `(${scenarioId})`);

    targets.forEach((target, targetIdx) => {
      test.describe(`Target ${targetIdx + 1}: ${target.domain}:${target.tenant}`, { tag: ['@' + target.domain, '@' + target.tenant] }, async () => {
        const shouldSkipByEnv = !!onlyEnvironment && target.domain !== onlyEnvironment;
        const shouldSkipByTenant = !!onlyTenant && target.tenant !== onlyTenant;

        console.log('  -----------------');
        console.log('  Target parameters');
        console.log('  -----------------');
        if (target.name !== `${target.domain}:${target.tenant}`) {
          console.log('       name:', target.name || '-');
        }
        console.log('  environment:', target.domain || '-');
        console.log('       tenant:', target.tenant || '-');
        console.log('          url:', target.url || '-');
        console.log('       widget:', target.targetWidgetId || '-');

        if (target.skipLogin) {
          console.log('     (skip default scenario login flow)');
        }

        console.log('     variants:');

        test.describe.configure({ mode: 'parallel' });

        test.skip(!domainTypes[target.domain], 'Invalid domain ' + target.domain);
        test.skip(!tenants[target.tenant], 'Invalid tenant ' + target.tenant);

        test.skip(shouldSkipByEnv, `Skip for onlyEnvironment "${onlyEnvironment}"`);
        test.skip(shouldSkipByTenant, `Skip for onlyTenant "${onlyTenant}"`);

        if (shouldSkipByEnv) {
          console.warn(`Skip for onlyEnvironment "${onlyEnvironment}"`);
          return;
        }
        if (shouldSkipByTenant) {
          console.warn(`Skip for onlyTenant "${onlyTenant}"`);
          return;
        }

        const baseUrl = (target.domain === 'local' ? 'http://' : 'https://') + domainTypes[target.domain];

        (!target.variants || target.variants.length === 0 ? [{
          name: 'Default single variant',
          id: '',
          queryParams: ''
        }] : target.variants).forEach((variant: ConfigTargetVariant, variantIdx: number) => {
          test.describe(`${variantIdx + 1}. ${variant.name}`, { tag: ['@' + variant.name.replace(/\s+/g, '_')] }, async () => {
            test.describe.configure({ mode: 'serial' });

            console.log('           ',
              (variantIdx + 1) + '.',
              variant.name || '',
              'Params:',
              variant.queryParams ? variant.queryParams.substring(0, 20) + '...' + variant.queryParams.substring(variant.queryParams.length - 20) : 'no params');

            const runContext: ScenarioRunContext = {
              page: undefined,
              popup: undefined,
              widget: undefined,
              baseUrl,
              tenant: target.tenant,
              domain: target.domain
            };

            test.beforeAll(async ({ browser }) => {
              runContext.page = await browser.newPage();
              runContext.navigate = async (url: string) => {
                await runContext.page.goto(`${ensureEndSlash(baseUrl)}${url}`);
              };

              console.log(`Execute preparation flow for ${target.domain}/${target.tenant}@${testUser.login} for ${scenarioId}...`);

              // tenant override executes even for skip login flows
              const loginPage = new LoginPage(runContext.page);
              await runContext.page.goto(`${ensureEndSlash(baseUrl)}?tenant-override=${target.tenant}`);

              if (!target.skipLogin) {
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
              }

              console.log(`Login done for ${target.domain}/${target.tenant}@${testUser.login} for ${scenarioId}.`);
            });

            test.afterAll(async () => {
              if (runContext.popup?.close) {
                await runContext.popup.close();
              }

              if (runContext.page?.close) {
                await runContext.page.close();
              }
              console.log(`Close page ${target.domain}/${target.tenant}@${testUser.login} for ${scenarioId}.`);
            });

            test(`Should be logged in to ${target.domain}/${target.tenant}`, async () => {
              test.skip(target.skipLogin, 'Skip default login flow');
              expect(runContext.page, 'Run context is initialized').toBeDefined();

              const appPage = new AppPageContainer(runContext.page!);
              const { user, tenant } = await appPage.getCurrentUserAndTenant();

              expect(user, 'Check user').toEqual(testUser.login);
              expect(tenant, 'Check tenant').toEqual(target.tenant);
            });

            test('Should navigate to target URL/widget', async () => {
              test.skip(!variant.queryParams && !target.targetWidgetId, 'Standalone test target');

              if (target.url) {
                const targetUrl = ensureEndSlash(baseUrl) + target.url + ensureStartQuestion(variant.queryParams);
                await runContext.page!.goto(targetUrl);

                const appPage = new AppPageContainer(runContext.page!);
                await appPage.waitAppPageVisibility();
              }

              if (target.targetWidgetId) {
                runContext.widget = new Widget(runContext.page!, target.targetWidgetId!);
                await runContext.widget.waitWidgetVisibility();

                expect(runContext.widget, `Target widget (${target.targetWidgetId}) should be visible`).toBeDefined();
              }
            });

            test.describe(`Testing ${scenarioName}: ${variant.name}`, { tag: ['@check'] }, async () => {
              test.describe.configure({ mode: 'serial' });
              testExecutor(runContext);
            });
          });
        });
      });
    });
  });
}