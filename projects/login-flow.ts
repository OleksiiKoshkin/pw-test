import { ProjectConfig } from './types';

export const loginFlowProject: ProjectConfig[] = [
  {
    name: 'login prereq',
    testMatch: 'login-page-prereq.spec.ts',
    dependencies: ['config prereq']
  },
  {
    name: 'login',
    testMatch: 'login/login-flow.spec.ts',
    dependencies: ['login prereq']
  },
  {
    name: 'logout',
    testMatch: 'login/logout-flow.spec.ts',
    dependencies: ['login prereq']
  }
];
