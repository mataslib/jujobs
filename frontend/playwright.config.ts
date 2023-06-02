// playwright.config.ts
import { defineConfig } from "@playwright/test";

console.log(`playwright.config.ts read`);
console.log(`host is "${process.env.HOST_URL}"`);

const isLocalhost = () =>
  (process.env.HOST_URL ?? "")?.indexOf("localhost") !== -1;

const withDevtools = isLocalhost() || process.env.DEVTOOLS === "1";

const config = defineConfig({
  timeout: 60000, // test timeout PW default is 30 000
  expect: {
    timeout: 10000, // expect timeout - (at least match api timeout) PW default is 5000
  },
  use: {
    launchOptions: {
      devtools: withDevtools,
    },
    baseURL: process.env.HOST_URL,
    // I'm running gui tests with open devtools
    viewport: {
      width: 1920,
      height: 1080,
    },
    trace: {
      mode: "retain-on-failure",
      screenshots: true,
      snapshots: true,
      sources: true,
    },
  },
  reporter: [["html", { open: "never" }], ["github"]],
  testDir: "src/e2e",
});
export default config;
