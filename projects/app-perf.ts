import { ProjectConfig } from './types';
import { checkSkipAuth } from '../lib/preset';

// SKIP_AUTH=true npm run test perf
export const appPerfProject: ProjectConfig[] = [
  {
    name: 'app performance',
    testMatch: 'perf/**/*.spec.ts',
    dependencies: checkSkipAuth() ? [] : ['app auth']
  }
];
