import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests against the production build. Run `pnpm build` first;
 * the web server below starts `next start` on port 3003 if one is not
 * already running.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3003",
    trace: "off",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3003",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
