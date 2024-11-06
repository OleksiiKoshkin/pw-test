import config from '../config/scenarios-config.json';
import { ConfigTarget } from './types';

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

  return ((config?.targets || []) as ConfigTarget[]) // JSON, so explicit casting. @TODO: use JSON schema
    .filter((target) => (target.domain && target.tenant));
};
