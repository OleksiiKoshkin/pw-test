import { ProjectConfig } from './types';
import { checkSkipAuth } from '../lib/preset';

// SKIP_AUTH=true npm run test perf
export const scenarioPnlNetCalc: ProjectConfig[] = [
  {
    name: 'scenario pnl report net calc',
    testMatch: 'scenarios/validate-pnl-reports/pnl-net-calculation/**/*.spec.ts',
    dependencies: checkSkipAuth() ? [] : ['app auth']
  }
];
