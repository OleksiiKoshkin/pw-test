import 'dotenv/config';
import { ConfigScenario } from '../types';
import { parseRawData } from './db-config/utils';
import * as fs from 'node:fs';
import { setupScenarioTargetsFile } from './config-consts';
import { getDBConfig } from './db-config/get-db-config';

console.log('Getting DB config');
console.log('=================');
console.log('Check environment...');

// 1. Get config from DB
const dbConfig = await getDBConfig();

// 2. Process config
console.log(`Processing data (${dbConfig.length} rows)...`);
let scenarios: ConfigScenario[] = [];

try {
  scenarios = parseRawData(dbConfig);
  if (scenarios.length === 0) {
    throw new Error('Nothing to process.');
  }
} catch (error) {
  console.log('');
  console.error('Failed with', error);
  console.log('');
  process.exit(-4);
}

console.log();
console.log('Scenarios:', scenarios.length);

scenarios.forEach((scenario, scenarioIdx) => {
  console.log((scenarioIdx + 1) + '.', scenario.scenarioId, 'on ' + scenario.targets.length + ' target(s)');

  scenario.targets.forEach((target, targetIdx) => {
    const defaultName = target.domain + ':' + target.tenant;
    console.log('    ' + (scenarioIdx + 1) + '.' + (targetIdx + 1) + '.',
      defaultName,
      defaultName !== target.name ? '"' + target.name + '"' : '');

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

try {
  console.log('Write new configuration file...');
  fs.writeFileSync(setupScenarioTargetsFile, JSON.stringify({ scenarios }), 'utf-8');
  if (!fs.existsSync(setupScenarioTargetsFile)) {
    throw new Error('Configuration file was not created!');
  }
} catch (error: any) {
  console.error(error);
  process.exit(-7);
}

console.log('Done.');
console.log();