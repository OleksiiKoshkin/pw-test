# Fintastic e2e: How to Use Locally

1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env` file using `.env-template`:

```dotenv
DOMAIN=https://app.staging... # or http://localhost:3000 - no trailing "/" ! - for local env
TENANT=
TEST_USER=auto_test@fintastic.ai # login for correct user to run tests
TEST_USER_PASSWORD=

INCORRECT_USER= # correct user but absent in tenant
INCORRECT_USER_PASSWORD=

STANDARD_USER= # user with low permissions (not power nor modeller)
STANDARD_USER_PASSWORD=
```

Note:
User `INCORRECT_USER` is used to check "failed login" flows, so you can ignore it if you don't want to check them.
User `STANDARD_USER` is for non-power user flows (not implemented yet).

4. Run tests with [Playwright UI](https://playwright.dev/docs/test-ui-mode) (do not forget to run local app for local
   environment):

```shell
npm run test
```

![screenshot](img/local-ui.png)

ALl the test suites are tagged, so you can select desired tests.

### Console run

To run tests in console use:

`npm run test:headless` or `npm run test:headed` (is not recommended if you don't know what you're doing)

![screenshot](img/local-console.png)

To open last result run

```shell
npm run report
```

![screenshot](img/local-report.png)

### Skip login

(See [Auth flow](./auth-flow.md) page for details)

To skip Login (auth) step on each run for local testing use `SKIP_AUTH=true` env variable:

```shell
SKIP_AUTH=true npm run test
```` 

(or other `npm run`s)

ONLY after the first run. The framework will save the authorisation data after the first run (`projects/app-auth.ts`)
and reuse it for all subsequent runs.
