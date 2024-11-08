import { ConfigTarget } from '../../types';
import { setupScenarioTargetsFile } from '../../lib/config-consts';
import * as fs from 'node:fs';
import { checkConfig } from '../../lib/configure/utils';

if (!fs.existsSync(setupScenarioTargetsFile)) {
  throw new Error('Unable to find setupScenarioTargetsFile');
}

const configText = fs.readFileSync(setupScenarioTargetsFile, 'utf-8');
const staticConfig = JSON.parse(configText);

console.log(`Checking config: ${setupScenarioTargetsFile}`);
checkConfig(staticConfig.scenarios, true);

console.log('Config OK. Scenarios:', staticConfig.scenarios.length);

export const getRuntimeConfig = (scenarioId: string) => {
  if (!scenarioId) {
    return undefined;
  }

  return staticConfig.scenarios.find((scenario) => scenario.scenarioId === scenarioId);
};

export const getScenarioName = (scenarioId: string) => {
  if (!scenarioId) {
    return 'Unknown scenario';
  }

  return staticConfig.scenarios.find((scenario) => scenario.scenarioId === scenarioId)?.name || 'Unknown scenario';
};

export const getConfigTargets = (scenarioId: string): ConfigTarget[] => {
  const config = getRuntimeConfig(scenarioId);

  return ((config?.targets || []) as ConfigTarget[])
    .filter((target) => (target.domain && target.tenant));
};
