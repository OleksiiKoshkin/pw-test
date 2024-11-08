import 'dotenv/config';
import { ConfigScenario } from '../types';
import * as fs from 'node:fs';
import { setupScenarioTargetsFile } from './config-consts';
import { getLocalDefaultScenarios } from './configure/local-config/get-local-default-config';
import { getDbScenarios } from './configure/db-config/process-db-config';
import { checkConfig } from './configure/utils';
import path from 'node:path';

console.log('Check runtime configuration...');
console.log('==============================');

let scenarios: ConfigScenario[] = [];

if (!process.env.DB_NAME) {
  console.log('Mode: Local file');
  scenarios = getLocalDefaultScenarios();
} else {
  console.log('Mode: Database');
  scenarios = await getDbScenarios();
}

checkConfig(scenarios);

if (scenarios.length === 0) {
  throw new Error('Nothing to process. List of available scenarios is empty.');
}

console.log();
console.log('Available scenarios:', scenarios.length);

scenarios.forEach((scenario, scenarioIdx) => {
  console.log((scenarioIdx + 1) + '.', scenario.scenarioId, 'on ' + scenario.targets.length + ' target(s)');

  scenario.targets.forEach((target, targetIdx) => {
    const defaultName = target.domain + ':' + target.tenant;
    console.log('    ' + (scenarioIdx + 1) + '.' + (targetIdx + 1) + '.',
      defaultName,
      defaultName !== target.name ? '"' + target.name + '"' : '');

    if (target.skipLogin) {
      console.log('    (skip login flow)');
    }

    (target.variants || []).forEach((variant) => {
      console.log('        -', variant.name);
    });
  });
  console.log();
});

// 3. Write result
if (fs.existsSync(setupScenarioTargetsFile)) {
  console.log('Remove existing file...');

  try {
    fs.unlinkSync(setupScenarioTargetsFile);
  } catch (error: any) {
    console.error(error);
    process.exit(-5);
  }

  if (fs.existsSync(setupScenarioTargetsFile)) {
    console.error('Cannot remove existing configuration!');
    process.exit(-6);
  }
}

if (!fs.existsSync(path.dirname(setupScenarioTargetsFile))) {
  console.log('Create config folder', path.dirname(setupScenarioTargetsFile) + '...');
  fs.mkdirSync(path.dirname(setupScenarioTargetsFile));
}

try {
  console.log('Write new configuration file...');
  fs.writeFileSync(setupScenarioTargetsFile, JSON.stringify({ scenarios }), 'utf-8');
  if (!fs.existsSync(setupScenarioTargetsFile)) {
    throw new Error('Configuration file was not created!');
  }
  console.log('Configuration saved as', setupScenarioTargetsFile);
} catch (error: any) {
  console.error(error);
  process.exit(-7);
}

console.log();
console.log('Done.');
console.log();
