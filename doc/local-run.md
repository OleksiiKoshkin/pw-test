# Fintastic e2e: How to Use Locally

1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env` file using `.env-template`:

```dotenv
TEST_USER=auto_test@fintastic.ai # login for correct user to run tests
TEST_USER_PASSWORD=

# optional
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_PORT=
```

Note: `DB_NAME` and all the `DB...` required for [local database config](./db-config.md).

If you want to use DB config (local or global, [about configs](./run-config.md), [database setup](./db-config.md))
please configure `DB_...` params and in case of local DB - prepare database and data.

4. Run tests with [Playwright UI](https://playwright.dev/docs/test-ui-mode):

```shell
npm run configure:run
```

After first configuration run (or after manual run config prepared) you can use

```shell
npm run test
```

command.

![screenshot](img/local-ui.png)

ALl the test suites are tagged, so you can select desired tests.

### Console run

To run tests in console use:

```shell
npm run configure:run:headless
```

or, when config is prepared,

```shell
npm run test:headless
```

![screenshot](img/local-console.png)

To open last result run

```shell
npm run report
```

![screenshot](img/local-report.png)
