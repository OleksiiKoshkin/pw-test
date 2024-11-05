import { PlaywrightTestConfig } from '@playwright/test';
import 'dotenv/config';
import {
  appAllProject,
  appAuthProject,
  appPerfProject,
  globalPrerequisitesProject,
  loginFlowProject, scenarioArrAccuracy
} from './projects';
import { outDir, setupStateFile, testsDir } from './lib/config';
import { testTarget } from './lib/test-env';

const baseURL = testTarget.baseUrl;

/**
 * See https://playwright.dev/docs/test-configuration
 */
const config: PlaywrightTestConfig = {
  testDir: testsDir,
  /* Maximum time one test can run for. */
  timeout: 90 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only. */
  retries: 0, // process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* The maximum number of test failures for the whole test suite run. */
  maxFailures: process.env.CI ? 10 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 20 * 1000,
    navigationTimeout: 90 * 1000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    // trace: 'retain-on-failure',
    // video: 'retain-on-failure',
    // screenshot: 'only-on-failure',
    viewport: { width: 1920, height: 1080 },
    /* See https://playwright.dev/docs/auth#reuse-signed-in-state */
    storageState: setupStateFile
  },
  /* Configure projects for major browsers. */
  projects: [
    ...globalPrerequisitesProject,
    ...loginFlowProject,
    ...appAuthProject,
    ...appAllProject,
    ...appPerfProject,
    ...scenarioArrAccuracy
  ],
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: outDir
};

export default config;
