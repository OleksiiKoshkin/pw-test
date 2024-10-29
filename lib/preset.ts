import * as fs from 'node:fs';
import { setupStateFile } from './config';

export function checkSkipAuth(): boolean {
  const skipAuth = process.env.SKIP_AUTH ?? false;
  if (!skipAuth) {
    // not requested
    return false;
  }

  if (process.env.CI) {
    // never for CI
    return false;
  }

  let config = null;
  try {
    // setup file exists
    if (fs.existsSync(setupStateFile)) {
      config = JSON.parse(fs.readFileSync(setupStateFile, 'utf8'));
    }
  } catch (e) {
    console.error(e);
    return false;
  }
  return Boolean(config && config.cookies && config.cookies.length > 0);
}