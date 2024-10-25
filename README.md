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

`npm run test`

To run tests in console use:

`npm run test:headless` or `npm run test:headless` (is not recommended if you don't know what you're doing)
