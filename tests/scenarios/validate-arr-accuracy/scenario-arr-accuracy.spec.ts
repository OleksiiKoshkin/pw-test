import { test } from '@playwright/test';
import { isCiCd, isTargetDomain, isTargetTenant } from '../../shared/common-utils';
import { scenarioTarget } from './target';
import { testArrTarget } from './runner/arr-accuracy-test';

if (isCiCd) {
  if (!isTargetDomain(scenarioTarget.domain)) {
    throw new Error('Invalid environment settings (domain)!');
  }
  if (!isTargetTenant(scenarioTarget.tenant)) {
    throw new Error('Invalid environment settings (tenant)!');
  }
}

test.skip(!isCiCd && !isTargetDomain(scenarioTarget.domain), 'Incorrect target domain!');
test.skip(!isCiCd && !isTargetTenant(scenarioTarget.tenant), 'Incorrect target tenant!');

test.describe(`Check ARR report numbers (${scenarioTarget.targets.length})`, { tag: ['@scenario', '@arr_report'] }, async () => {
  test.describe.configure({ mode: 'parallel' });

  scenarioTarget.targets.forEach((target) => {
    testArrTarget(target);
  });
});
