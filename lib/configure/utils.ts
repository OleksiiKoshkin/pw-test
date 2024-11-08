import { ConfigScenario } from '../../types';
import { domainTypes, knownScenarios, tenants } from '../../tests/shared/types';

export function checkConfig(scenarios?: ConfigScenario[], throwError = false) {
  if (!scenarios || !scenarios.length) {
    if (throwError) {
      throw new Error('Nothing to process. List of available scenarios is empty.');
    }
    console.log();
    console.error('Nothing to process. List of available scenarios is empty.');
    console.log();
    process.exit(-100);
  }

  try {
    scenarios.forEach((scenario) => {
      if (!knownScenarios.includes(scenario.scenarioId)) {
        throw new Error(`Unknown scenario "${scenario.scenarioId}": not listed in ${knownScenarios.join(', ')}`);
      }

      (scenario.targets || []).forEach((target) => {
        if (!domainTypes[target.domain]) {
          throw new Error(`No environment (from ${Object.keys(domainTypes).join(', ')}) found for ${JSON.stringify(target, null, 2)}`);
        }

        if (!tenants[target.tenant]) {
          throw new Error(`No tenant (from ${Object.keys(tenants).join(', ')}) found for  ${JSON.stringify(target, null, 2)}`);
        }
      });
    });
  } catch (error) {
    if (throwError) {
      throw error;
    }
    console.log();
    console.error(error);
    console.log();
    process.exit(-101);
  }
}