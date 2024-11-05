import { test } from '@playwright/test';
import { scenarioTarget } from './target';
import { testArrTarget } from './runner/arr-accuracy-test';
import { checkScenarioEnvironment } from '../shared/helpers/prereq-helpers';

checkScenarioEnvironment(scenarioTarget);

test.describe(`Check ARR report numbers (${scenarioTarget.targets.length})`, { tag: ['@scenario', '@arr_report'] }, async () => {
  test.describe.configure({ mode: 'parallel' });

  scenarioTarget.targets.forEach((target) => {
    testArrTarget(target);
  });
});
