/**
 * Renders the clinic flyer to 1080x1350 PNGs (the portrait size WhatsApp
 * shows inline, so nobody has to open a file or a link).
 *
 *   node tools/flyers/render.cjs                 → out/flyer-generico.png
 *   node tools/flyers/render.cjs clinics.csv     → one flyer per clinic + the generic one
 *
 * clinics.csv: a header row with a `name` column (other columns are ignored).
 * Settings (seller name, WhatsApp, CNPJ, season end) are in config.json.
 * Requires Playwright and network access to Google Fonts.
 */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const dir = __dirname;
const out = path.join(dir, "out");
const config = JSON.parse(fs.readFileSync(path.join(dir, "config.json"), "utf8"));
const template = fs.readFileSync(path.join(dir, "flyer.html"), "utf8");

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function formatPhone(digits) {
  const local = digits.replace(/\D/g, "").replace(/^55/, "");
  const ddd = local.slice(0, 2);
  const rest = local.slice(2);
  const cut = rest.length === 9 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, cut)}-${rest.slice(cut)}`;
}

function slug(name) {
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Minimal CSV reader: handles quoted fields with commas; returns the `name` column. */
function readNames(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l) => l.trim());
  const parse = (line) => {
    const cells = [];
    let cur = "", q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') q = !q;
      else if (ch === "," && !q) { cells.push(cur); cur = ""; }
      else cur += ch;
    }
    cells.push(cur);
    return cells.map((c) => c.trim());
  };
  const header = parse(lines[0]).map((h) => h.toLowerCase());
  const col = header.indexOf("name");
  if (col === -1) throw new Error(`${file}: no "name" column`);
  return lines.slice(1).map(parse).map((cells) => cells[col]).filter(Boolean);
}

function html(clinicName) {
  const seasonal = new Date() <= new Date(`${config.seasonalUntil}T23:59:59-03:00`);
  const fill = {
    forLine: clinicName ? `Preparado para <strong>${escapeHtml(clinicName)}</strong>` : "Para clínicas de estética",
    kicker: seasonal ? `Campanha de fim de ano · Black Friday ${escapeHtml(config.blackFriday)}` : "Para clínicas de estética",
    sellerName: escapeHtml(config.sellerName),
    phone: formatPhone(config.whatsapp),
    cnpj: escapeHtml(config.cnpj),
    domain: escapeHtml(config.domain),
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (!(k in fill)) throw new Error(`template token {{${k}}} has no value`);
    return fill[k];
  });
}

(async () => {
  const csv = process.argv[2];
  const names = csv ? readNames(path.resolve(csv)) : [];
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  const jobs = [{ name: null, file: "flyer-generico.png" }, ...names.map((n) => ({ name: n, file: `flyer-${slug(n)}.png` }))];
  for (const job of jobs) {
    await page.setContent(html(job.name), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollHeight - 1350);
    if (overflow > 0) console.warn(`  ! ${job.file}: content is ${overflow}px taller than the flyer (long clinic name?)`);
    await page.screenshot({ path: path.join(out, job.file), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    console.log(`  ${job.file}`);
  }
  await browser.close();
  console.log(`${jobs.length} flyer(s) in ${out}`);
})();
