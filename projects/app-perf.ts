import { ProjectConfig } from './types';

// SKIP_AUTH=true npm run test
const skipAuth = process.env.SKIP_AUTH ?? false;

export const appPerfProject: ProjectConfig[] = [
  {
    name: 'app performance',
    testMatch: 'perf/**/*.spec.ts',
    dependencies: skipAuth ? [] : ['app auth']
  }
];
