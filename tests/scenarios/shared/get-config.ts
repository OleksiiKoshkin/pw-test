import { ConfigTarget } from '../../../types';
import { setupScenarioTargetsFile } from '../../../lib/config-consts';
import * as fs from 'node:fs';

if (!fs.existsSync(setupScenarioTargetsFile)) {
  throw new Error('Unable to find setupScenarioTargetsFile');
}

const configText = fs.readFileSync(setupScenarioTargetsFile, 'utf-8');
const config = JSON.parse(configText);
console.log(`Used config: ${setupScenarioTargetsFile}`);

export const getConfig = (scenarioId: string) => {
  if (!scenarioId) {
    return undefined;
  }

  return config.scenarios.find((scenario) => scenario.scenarioId === scenarioId);
};

export const getScenarioName = (scenarioId: string) => {
  if (!scenarioId) {
    return 'Unknown scenario';
  }

  return config.scenarios.find((scenario) => scenario.scenarioId === scenarioId)?.name || 'Unknown scenario';
};

export const getConfigTargets = (scenarioId: string): ConfigTarget[] => {
  const config = getConfig(scenarioId);

  return ((config?.targets || []) as ConfigTarget[])
    .filter((target) => (target.domain && target.tenant));
};
