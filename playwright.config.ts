import { defineConfig } from "@playwright/test";

// The dev server is the only entry that exercises the API proxy table in
// vite.config.js, so the gate runs against it rather than a preview of dist/.
// `pnpm verify:sky` builds first and separately; this config only drives the page.
const PORT = Number(process.env.SKY_PORT ?? 4000);

export default defineConfig({
  testDir: "tests",
  // The scene needs live ADS-B data before it can be judged, and the upstreams
  // are sometimes slow. One retry absorbs a single unlucky poll.
  timeout: 180_000,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"]],
  // Baselines live in one reviewable folder rather than a per-spec snapshot dir.
  snapshotPathTemplate: "tests/baseline/{arg}{ext}",
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1440, height: 900 },
    // Deterministic device pixel ratio, or the baseline screenshot is unusable
    // on a different display.
    deviceScaleFactor: 1,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    port: PORT,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
