// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  // Forbid test.only on CI
  forbidOnly: !!process.env.CI,

  // Two retries for each test
  retries: 2,

  // Look for test files in the "tests" directory, relative to this configuration file
  testDir: 'docs/js/',

  testMatch: ['**/__tests__/*.spec.js'],

  // Each test is given 30 seconds
  timeout: 30000,

  use: {
    baseURL: 'http://localhost:3000',
    browserName: 'chromium',
    headless: true,
  },

  webServer: {
    command: 'npm run serve',
    port: 3000,
    timeout: 120 * 1000,
  },

  // Limit the number of workers on CI, use default locally
  workers: process.env.CI ? 2 : undefined,
};

// eslint-disable-next-line import/no-default-export
export default config;
