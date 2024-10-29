# Fintastic e2e: Auth flow

There are two use cases for auth flow at the moment.

### Login flow tests

Login flow tests are under `login-flow.ts` project. They all have dependency `config prereq`, and all of them are
login-independent: they runs empty session and do not share auth tokens.

The flow includes actions:

- check is login page displayed,
- open login popup,
- enter credentials, click login, wait popup close,
- process result.

Login flow checks

- user can log in with correct credentials;
- user can log out;
- user can not log in with correct credentials but for other tenant.

Login flow does not check user can not log in with incorrect credentials because it is guaranteed by Auth0 popup.

### Auth flow

All the other test suites (projects) need user logged in. To guarantee that, `app auth` project is set as a dependency:

```ts
export const appAllProject: ProjectConfig[] = [
  {
    name: 'app all (logged-in)',
    testMatch: 'app/**/*.spec.ts',
    dependencies: checkSkipAuth() ? [] : ['app auth'] // <--
  }
];
```

`app auth`, which is `tests/shared/app-auth.spec.ts`, includes `config prereq` as well.

When multiple app tests run, it is pretty consuming to log in which every test file. To avoid that, special mode is
introduced.

To skip Login (auth) step on each run for local testing you can use `SKIP_AUTH=true` env variable:

```shell
SKIP_AUTH=true npm run test
```` 

(or other `npm run`s)

ONLY after the first run. The framework will save the authorisation data after the first run and reuse it for all
subsequent runs.

To make it works, corresponding test projects should include code like that:

```ts
// SKIP_AUTH=true npm run test
export const appPerfProject: ProjectConfig[] = [
  {
    name: 'app performance',
    testMatch: 'perf/**/*.spec.ts',
    dependencies: checkSkipAuth() ? [] : ['app auth'] // <-- this one 
  }
];
```

### Bypassing auth flow in local mode

First, execute

```shell
npm run test:headless app-auth
```

It will log in with standard user and store auth credentials.

Then you can run for example performance tests:

```shell
SKIP_AUTH=true npm run test:headless perf
```

**Warning:** The credentials are stored in a JSON file. They have some TTL, so if your tests start to fail, delete this file and repeat step 1.