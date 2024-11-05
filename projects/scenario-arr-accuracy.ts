import { ProjectConfig } from './types';
import { checkSkipAuth } from '../lib/preset';

// SKIP_AUTH=true npm run test perf
export const scenarioArrAccuracy: ProjectConfig[] = [
  {
    name: 'scenario arr accuracy numbers',
    testMatch: 'scenarios/validate-arr-accuracy/**/*.spec.ts',
    dependencies: checkSkipAuth() ? [] : ['app auth']
  }
];
