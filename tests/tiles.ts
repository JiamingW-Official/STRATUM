import type { Page } from "@playwright/test";

/**
 * Serve the map its tiles locally.
 *
 * The map draws real imagery from Esri and real elevation from the AWS open
 * data registry, and it should: a seat-back map of an invented earth is not a
 * map. But a test of the camera is not a test of anybody's tile service, and
 * leaving the real ones in made the suite fail on somebody else's afternoon —
 * the run that prompted this one went red on a rate limit while a single
 * assertion about panning sat waiting for a raster it did not need.
 *
 * So the pixels are stubbed and nothing else is. Every request still goes out
 * of the map with the same URL, the style is untouched, and what comes back is
 * a tile of the right size and the right encoding. What is being tested —
 * where the camera is, who owns it, whether the aircraft is in frame — is
 * exactly what it was.
 */

/** 256x256 of plausible ocean, for the imagery and label layers. */
const GROUND =
  "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAACAUlEQVR42u3TQQ0AAAjEsNOBBETgXxZvNNCkCpYs1QNvRQIMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA2AAFTAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAADKACBgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAEwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAC4FnmwB59FiMMbAAAAAElFTkSuQmCC";

/**
 * The same size in terrarium encoding, reading exactly zero metres
 * everywhere: elevation is R*256 + G + B/256 - 32768, so (128, 0, 0) is sea
 * level. Flat ground is the honest stand-in — inventing relief here would be
 * inventing the one thing the forward view is meant to show.
 */
const FLAT =
  "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAB+0lEQVR42u3TQQkAAAjAwEU3un8reHAJBmsK3pIAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwABgADAAGAAMAAYAA4ABwAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgAJMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAyAASTAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAYAAwABgADgAHAAGAAMAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADAAGAAOAAcAAYAAwABgADADHAnGpB4FDLHHvAAAAAElFTkSuQmCC";

const IMAGERY_HOST = /server\.arcgisonline\.com/;
const DEM_HOST = /elevation-tiles-prod/;

export async function stubMapTiles(page: Page) {
  const png = (b64: string) => ({
    status: 200,
    contentType: "image/png",
    headers: { "cache-control": "max-age=3600" },
    body: Buffer.from(b64, "base64"),
  });
  await page.route(IMAGERY_HOST, (route) => route.fulfill(png(GROUND)));
  await page.route(DEM_HOST, (route) => route.fulfill(png(FLAT)));
}
