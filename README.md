# Fintastic e2e

## Description

## How to Use

1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env` file using `.env-template`:

```dotenv
DOMAIN=https:// #... or http://localhost:3000 - no trailing "/" ! - for local env
TENANT=
TEST_USER=auto_test@fintastic.ai # login for correct user to run tests
TEST_USER_PASSWORD=

INCORRECT_USER= # correct user but absent for tenant
INCORRECT_USER_PASSWORD=

STANDARD_USER= # user with low permissions (not power nor modeller)
STANDARD_USER_PASSWORD=
```

User `INCORRECT_USER` is used to check "failed login" flows, so you can ignore it if you don't want to check them.

4. Run tests with [Playwright UI](https://playwright.dev/docs/test-ui-mode):

```shell
npm run test
```

To run tests in console use:

`npm run test:headless` or `npm run test:headless` (is not recommended if you don't know what you're doing)

To skip Login (auth) step on each run for local testing please use `SKIP_AUTH=true` env variable:

```shell
SKIP_AUTH=true npm run test
```` 

(or other `npm run`s)

ONLY after the first run. The framework will save the authorisation data after the first run (`projects/app-auth.ts`)
and reuse it for all subsequent runs.

### Performance testing

To run only performance tests you can use

```shell
SKIP_AUTH=true npm run test perf
```

or

```shell
SKIP_AUTH=true npm run test:headless perf
```

to see results in the console. Reports will be stored in `performance-results` folder.
