# Static default config

This file `targets.json` is used in case when no database connection parameters
declared in `.env` file.

It will be automatically copied to `setup/targets.json` (`lib/config-consts.ts`, `setupScenarioTargetsFile` const)

Use that to run local (in-development) scenarios.


`new-target.json` is a template for [new scenarios](../doc/new-scenario.md)