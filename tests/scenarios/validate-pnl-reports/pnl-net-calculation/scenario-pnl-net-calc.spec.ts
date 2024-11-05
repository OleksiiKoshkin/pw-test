import { test } from '@playwright/test';
import { scenarioTarget } from './target';
import { checkScenarioEnvironment } from '../../shared/helpers/prereq-helpers';
import { testNetCalc } from './runner/pnl-net-calc-test';

checkScenarioEnvironment(scenarioTarget);

test.describe(`Check PNL report Net calc (${scenarioTarget.targets.length})`, { tag: ['@scenario', '@pnl_report', '@pnl_report_net_calc'] }, async () => {
  test.describe.configure({ mode: 'parallel' });

  scenarioTarget.targets.forEach((target) => {
    testNetCalc(target);
  });
});
