import { test } from '@playwright/test';
import { scenarioTarget } from './target';
import { checkScenarioEnvironment } from '../../shared/helpers/prereq-helpers';
import { testPnlLines } from './runner/pnl-line-test';

checkScenarioEnvironment(scenarioTarget);

test.describe(`Check PNL report 10x lines/numbers (${scenarioTarget.targets.length})`, { tag: ['@scenario', '@pnl_report', '@pnl_report_x10'] }, async () => {
  test.describe.configure({ mode: 'parallel' });

  scenarioTarget.targets.forEach((target) => {
    testPnlLines(target);
  });
});
