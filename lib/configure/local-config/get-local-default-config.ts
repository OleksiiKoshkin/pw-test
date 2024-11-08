import * as fs from 'node:fs';
import { setupScenarioStaticDefault } from '../../config-consts';
import { ConfigScenario } from '../../../types';

export function getLocalDefaultScenarios(): ConfigScenario[] {
  console.warn('Please pay attention: local file template used');
  console.log('Getting Local Default static config...');
  console.log('Source:', setupScenarioStaticDefault);

  if (!fs.existsSync(setupScenarioStaticDefault)) {
    console.error('No static default config available!');
    process.exit(-2);
  }

  console.log('File found.', 'Size:', fs.statSync(setupScenarioStaticDefault).size, 'bytes');

  return JSON.parse(fs.readFileSync(setupScenarioStaticDefault, 'utf-8').toString()).scenarios;
}