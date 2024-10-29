# Fintastic e2e: Auth flow

There are two use cases for auth flow at the moment.

### Login flow tests

Login flow tests are under `login-flow.ts` project. They all have dependency `config prereq`, and all of them are login-independent: they runs empty session and do not share auth tokens.

The flow includes actions: 
- check is login page displayed,
- open login popup,
- enter credentials, click login,
- process result.

Login flow checks 
- user can log in with correct credentials; 
- user can log out; 
- user can not log in with correct credentials but for other tenant.

Login flow does not check user can not login with incorrect creds because it is guaranteed by Auth0 popup.

### Auth flow

All the other test suites (projects) need user logged in. To guarantee that, `app auth` project is set as a dependency:

```ts
export const appAllProject: ProjectConfig[] = [
  {
    name: 'app all (logged-in)',
    testMatch: 'app/**/*.spec.ts',
    dependencies: skipAuth ? [] : ['app auth'] // <--
  }
];
```

`app auth`, which is `tests/shared/app-auth.spec.ts`, includes `config prereq` as well.

When multiple app tests run, it is pretty consuming to log in which every test file. To avoid that, special mode is introduced.

To skip Login (auth) step on each run for local testing you can use `SKIP_AUTH=true` env variable:

```shell
SKIP_AUTH=true npm run test
```` 

(or other `npm run`s)

ONLY after the first run. The framework will save the authorisation data after the first run and reuse it for all subsequent runs.
