import { test } from '@playwright/test';
import { scenarioTarget } from './target';
import { checkScenarioEnvironment } from '../../helpers/prereq-helpers';

checkScenarioEnvironment(scenarioTarget);

test.describe(`Check PNL report lines/numbers (${scenarioTarget.targets.length})`, { tag: ['@scenario', '@pnl_report'] }, async () => {
  test.describe.configure({ mode: 'parallel' });

  scenarioTarget.targets.forEach((target) => {
    testArrTarget(target);
  });
});
