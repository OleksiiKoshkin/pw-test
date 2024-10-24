// playwright-extra is a drop-in replacement for playwright,
// it augments the installed playwright with plugin functionality
import { chromium } from 'playwright';
// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const setupVideoDirectory = './test-results/global-setup';
const setupTracesArchivePath = './test-results/global-setup/traces.zip';

// Add the plugin to playwright
// chromium.use(StealthPlugin());

// Global setup
// https://playwright.dev/docs/test-advanced#global-setup-and-teardown
async function globalSetup(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  // globalSetup does not apply playwright.e2e.config options =>
  // we need to create an additional context to pass ignoreHTTPSErrors option,
  // if your testing site does not work over HTTPS
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    recordVideo: { dir: setupVideoDirectory }
  });

  // const page = await context.newPage();

  try {
    await context.tracing.start({
      sources: true,
      snapshots: true,
      screenshots: true
    });
    // Save signed in state
    // await page.context().storageState({ path: './setup/storage-state.json' });
  } catch (error) {
    await context.tracing.stop({ path: setupTracesArchivePath });

    throw error;
  }

  await browser.close();
}

export default globalSetup;
