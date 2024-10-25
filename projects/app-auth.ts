import { ProjectConfig } from './types';

export const appAuthProject: ProjectConfig[] = [
  {
    name: 'app auth',
    testMatch: 'app-auth.spec.ts', // stores auth cookies
    dependencies: ['config prereq']
  },
];
