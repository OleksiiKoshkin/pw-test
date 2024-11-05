import { ProjectConfig } from './types';
import { checkSkipAuth } from '../lib/preset';

// SKIP_AUTH=true npm run test perf
export const scenarioPnlLines: ProjectConfig[] = [
  {
    name: 'scenario pnl report line values',
    testMatch: 'scenarios/validate-pnl-reports/pnl-line-values/**/*.spec.ts',
    dependencies: checkSkipAuth() ? [] : ['app auth']
  }
];
