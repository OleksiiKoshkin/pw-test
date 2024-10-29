# Fintastic e2e: Test Projects

## Test projects

1. All the tests are composed in to [_projects_](https://playwright.dev/docs/test-projects) under
`projects` folder. There is `types.ts` which includes the list of project's names:

```ts
export type ProjectNames = |
  'config prereq' |
  'login prereq' |
  'login' |
  'logout' |
  'app auth' |
  'app all (logged-in)' |
  'app performance'

export type ProjectConfig = {
  name: ProjectNames
  testMatch: string
  dependencies?: ProjectNames[]
}
```

2. and, then in particular project (`login-flow.ts`) test files are declared:

```ts
import { ProjectConfig } from './types';

export const loginFlowProject: ProjectConfig[] = [
  {
    name: 'login prereq',
    testMatch: 'login-page-prereq.spec.ts', // <-- exact file
    dependencies: ['config prereq'] // <-- should be passed before run
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
```

Wildcards could be used as well:
```ts
export const appPerfProject: ProjectConfig[] = [
  {
    name: 'app performance',
    testMatch: 'perf/**/*.spec.ts',  // <-- all the files and subfolders
    dependencies: skipAuth ? [] : ['app auth']
  }
];
```

3. In `./playwright.config.ts` the projects are imported:

```ts
import {
  appAllProject,
  appAuthProject,
  appPerfProject,
  globalPrerequisitesProject,
  loginFlowProject
} from './projects'; // <-- index.ts
// ...
  projects: [
  ...globalPrerequisitesProject,
  ...loginFlowProject,
  ...appAuthProject,
  ...appAllProject,
  ...appPerfProject
  ]
```

There are some predefined dependencies: `config prereq` and `app auth`

### Config prereq

Test suite is in `tests/shared/config-prereq.spec.ts` and it checks global config: `.env` file or CI/CD variables, especially application URL, tenant, user(s) credentials.
It has to be called on the beginning of every test, so it usually declared as a dependency:

```ts
{
    name: 'app auth',
    testMatch: 'app-auth.spec.ts',
    dependencies: ['config prereq']
}
```

