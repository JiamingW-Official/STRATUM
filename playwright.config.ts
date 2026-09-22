import os from "node:os";
import { defineConfig } from "@playwright/test";

// The dev server is the only entry that exercises the API proxy table in
// vite.config.js, so the gate runs against it rather than a preview of dist/.
// `pnpm verify:sky` builds first and separately; this config only drives the page.
const PORT = Number(process.env.SKY_PORT ?? 4000);

export default defineConfig({
  /**
   * Traces and screenshots land outside the working tree.
   *
   * This directory is inside a synced folder, and the sync daemon moves and
   * removes files under it while a run is in progress — which is where the
   * duplicate " 2" and " 3" files in this repository come from. Playwright
   * then fails a passing test with ENOENT on its own trace. Writing the
   * artifacts to the system temp directory takes the daemon out of the loop.
   */
  outputDir: `${os.tmpdir()}/stratum-playwright`,
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
    /**
     * Traces are recorded on CI and nowhere else.
     *
     * Recording one means a screencast for every test, and the screens here
     * keep a one-second countdown running — long enough that the trace writer
     * and its own cleanup raced, and a passing test was reported as ENOENT on
     * a file Playwright had just deleted itself. Six runs of the same test
     * pass with tracing off and fail intermittently with it on.
     */
    trace: process.env.CI ? "retain-on-failure" : "off",
  },
  webServer: {
    command: "npm run dev",
    // The port goes to Vite through the environment, so a run on SKY_PORT
    // starts its own server there rather than a second one on 4000 — where
    // the app's preview already lives, and where two of them starting on top
    // of each other left a Vite that was listening and answering nothing.
    env: { PORT: String(PORT) },
    port: PORT,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
