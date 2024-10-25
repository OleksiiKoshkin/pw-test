import { ProjectConfig } from './types';

// SKIP_AUTH=true npm run test
const skipAuth = process.env.SKIP_AUTH ?? false;

export const appAllProject: ProjectConfig[] = [
  {
    name: 'app all (logged-in)',
    testMatch: 'app/**/*.spec.ts',
    dependencies: skipAuth ? [] : ['app auth']
  }
];
