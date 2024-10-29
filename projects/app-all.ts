import { ProjectConfig } from './types';
import { checkSkipAuth } from '../lib/preset';

// SKIP_AUTH=true npm run test
export const appAllProject: ProjectConfig[] = [
  {
    name: 'app all (logged-in)',
    testMatch: 'app/**/*.spec.ts',
    dependencies: checkSkipAuth() ? [] : ['app auth']
  }
];
