/**
 * Visual and structural check of the template against every fixture config.
 * For each fixture: swap it into site-config.json, `next build`, `next start`,
 * then visit every route at five widths and check overflow, console errors,
 * broken images and that the business name and every WhatsApp link are present.
 * Screenshots: scripts/fixtures/out/<fixture>-<route>-<width>.png
 *
 * Usage (from apps/client-site): node scripts/fixtures/check.cjs [fixture-name ...]
 * Restores the original site-config.json when done. Needs Playwright.
 */
const { execSync, spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "../..");
const fixturesDir = __dirname;
const outDir = path.join(fixturesDir, "out");
const configPath = path.join(root, "site-config.json");
const photoSrc = path.resolve(root, "../aurea/public/images");
const photoDst = path.join(root, "public/_fixtures");
const PORT = 3020;
const ROUTES = ["/", "/servicos", "/sobre", "/faq", "/contato"];
const WIDTHS = [1440, 1024, 768, 390, 360];

function preparePhotos() {
  fs.mkdirSync(photoDst, { recursive: true });
  for (const dir of fs.readdirSync(photoSrc)) {
    for (const f of fs.readdirSync(path.join(photoSrc, dir))) fs.copyFileSync(path.join(photoSrc, dir, f), path.join(photoDst, f));
  }
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://localhost:${PORT}/`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start");
}

async function check(name, cfg) {
  const browser = await chromium.launch();
  const failures = [];
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
      const errors = [];
      page.on("console", (m) => m.type() === "error" && !/fonts\.g|ERR_TUNNEL|ERR_PROXY/.test(m.text()) && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "load" });
      const r = await page.evaluate((biz) => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        pastEdge: [...document.querySelectorAll("body *")].filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1).length,
        brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
        hasName: document.body.innerText.includes(biz),
        h1: document.querySelectorAll("h1").length,
        badWa: [...document.querySelectorAll('a[href*="wa.me"]')].filter((a) => !new URL(a.href).searchParams.get("text")?.includes(biz)).length,
      }), cfg.businessName);
      const tag = `${name} ${route} ${width}`;
      if (r.overflow > 0 || r.pastEdge > 0) failures.push(`${tag}: overflow ${r.overflow}px, ${r.pastEdge} elements past edge`);
      if (r.brokenImages) failures.push(`${tag}: ${r.brokenImages} broken images`);
      if (!r.hasName) failures.push(`${tag}: business name missing`);
      if (r.h1 !== 1) failures.push(`${tag}: ${r.h1} h1 elements`);
      if (r.badWa) failures.push(`${tag}: ${r.badWa} WhatsApp links without the business in the message`);
      if (errors.length) failures.push(`${tag}: console ${errors.slice(0, 2).join(" | ")}`);
      if ([1440, 390].includes(width) && ["/", "/servicos"].includes(route)) {
        await page.screenshot({ path: path.join(outDir, `${name}-${route === "/" ? "home" : route.slice(1)}-${width}.png`), fullPage: true });
      }
      await page.close();
    }
  }
  await browser.close();
  return failures;
}

(async () => {
  const wanted = process.argv.slice(2);
  const fixtures = fs.readdirSync(fixturesDir).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""))
    .filter((f) => wanted.length === 0 || wanted.includes(f));
  const original = fs.readFileSync(configPath);
  fs.mkdirSync(outDir, { recursive: true });
  preparePhotos();
  let total = 0;
  try {
    for (const name of fixtures) {
      const cfg = JSON.parse(fs.readFileSync(path.join(fixturesDir, `${name}.json`), "utf8"));
      fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2));
      execSync("npx next build", { cwd: root, stdio: "pipe" });
      const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: root, stdio: "ignore", detached: true });
      try {
        await waitForServer();
        const failures = await check(name, cfg);
        total += failures.length;
        console.log(`${name}: ${failures.length === 0 ? "PASS" : `FAIL (${failures.length})`}`);
        failures.slice(0, 12).forEach((f) => console.log(`  - ${f}`));
      } finally {
        process.kill(-server.pid);
      }
    }
  } finally {
    fs.writeFileSync(configPath, original);
  }
  process.exit(total === 0 ? 0 : 1);
})();
