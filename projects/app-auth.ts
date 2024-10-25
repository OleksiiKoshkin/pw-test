import { ProjectConfig } from './types';

export const appAuthProject: ProjectConfig[] = [
  {
    name: 'app auth',
    testMatch: 'app-login.spec.ts', // stores auth cookies
    dependencies: ['config prereq', 'login prereq']
  },
];
