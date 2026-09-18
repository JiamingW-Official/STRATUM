import { chromium } from "@playwright/test";
const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2000, height: 1240 }, deviceScaleFactor: 2 });
const errs = [];
p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 200)));
await p.goto("http://localhost:4000/dev/ife/", { waitUntil: "domcontentloaded" });
await p.waitForSelector(".bench-glass");
await p.getByRole("button", { name: "Pause" }).click();
await p.locator(".ife-idle").click();
await p.waitForTimeout(1800);
await p.locator(".ife-strip-menu").click();
await p.locator(".ife-drawer").getByRole("button", { name: "Flight map" }).click();
await p.waitForTimeout(9000);
const glass = p.locator(".bench-glass");
const shot = async (n) => p.screenshot({ path: `${out}/${n}.png`, clip: await glass.boundingBox() });
await shot("v-route");
for (const [name, label] of [["v-globe","Globe"],["v-aircraft","Follow aircraft"],["v-forward","Forward view"]]) {
  await p.getByRole("button", { name: label, exact: true }).click();
  await p.waitForTimeout(7000);
  await shot(name);
}
console.log("errors:", errs.length ? [...new Set(errs)].slice(0,4).join(" | ") : "none");
await b.close();
