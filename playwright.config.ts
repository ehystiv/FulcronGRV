import { defineConfig, devices } from '@playwright/test'

// Smoke tests on the generated site: run `npm run generate` first, then `npm run test:e2e`.
// tests/serve.mjs serves .output/public with real 404s, as Vercel does.
const PORT = 4321

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'off',
    // A Chromium already on the machine, if any (e.g. CHROMIUM_PATH=/opt/pw-browsers/chromium)
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `node tests/serve.mjs ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
})
