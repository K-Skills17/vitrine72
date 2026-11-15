import { test } from "node:test";
import assert from "node:assert/strict";
import {
  FONT_PAIRS,
  LEGACY_FONT_IDS,
  LEGACY_PALETTE_IDS,
  PALETTES,
  contrastRatio,
  paletteContrastIssues,
  resolveFontPair,
  resolvePalette,
} from "./design-presets.js";

test("contrastRatio matches known WCAG values", () => {
  assert.equal(contrastRatio("#000000", "#ffffff").toFixed(1), "21.0");
  assert.equal(contrastRatio("#ffffff", "#ffffff").toFixed(1), "1.0");
});

test("every palette passes AA for the pairs the template renders", () => {
  const issues = Object.values(PALETTES).flatMap((p) => paletteContrastIssues(p));
  assert.deepEqual(issues, []);
});

test("no purple, neon or generic SaaS-blue palettes", () => {
  const banned = /#(c77dff|7fffd4|5b2d6a|1565c0|8b5cf6|a855f7|6366f1)/i;
  for (const p of Object.values(PALETTES)) {
    assert.ok(!banned.test(Object.values(p).join(" ")), `${p.id} uses a banned colour`);
  }
});

test("no generic display fonts", () => {
  const generic = ["Inter", "Montserrat", "Poppins", "Roboto", "Open Sans"];
  for (const f of Object.values(FONT_PAIRS)) {
    assert.ok(!generic.includes(f.display), `${f.id} uses ${f.display} as display face`);
  }
});

test("legacy ids resolve to existing presets", () => {
  for (const [old, current] of Object.entries(LEGACY_PALETTE_IDS)) {
    assert.ok(PALETTES[current], `${old} → ${current} missing`);
    assert.equal(resolvePalette(old).id, current);
  }
  for (const [old, current] of Object.entries(LEGACY_FONT_IDS)) {
    assert.ok(FONT_PAIRS[current], `${old} → ${current} missing`);
    assert.equal(resolveFontPair(old).id, current);
  }
  assert.equal(resolvePalette("does-not-exist").id, "ivory-espresso");
  assert.equal(resolvePalette(undefined).id, "ivory-espresso");
});
