import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getProfessional } from "./professionals";
import { treatmentDetails } from "./treatment-details";
import { treatmentSummaries } from "./treatments";

const summarySlugs = treatmentSummaries.map((t) => t.slug).sort();

describe("treatment content", () => {
  it("has exactly one detail page per treatment summary", () => {
    expect(treatmentDetails.map((d) => d.slug).sort()).toEqual(summarySlugs);
  });

  it.each(treatmentDetails)("$slug: related links and professional resolve", (d) => {
    for (const slug of d.related) expect(summarySlugs).toContain(slug);
    expect(d.related).not.toContain(d.slug);
    expect(getProfessional(d.responsibleProfessionalId)).toBeDefined();
  });

  it.each(treatmentDetails)("$slug: 'para quem' ends with the evaluation caveat", (d) => {
    expect(d.candidacy.at(-1)).toMatch(/avaliação presencial/);
  });

  it("contains no banned phrases", () => {
    const banned = JSON.parse(readFileSync(resolve(__dirname, "../../../../config/banned-phrases.json"), "utf8")) as unknown;
    const phrases = (Array.isArray(banned) ? banned : Object.values(banned as Record<string, unknown>).flat()).filter(
      (p): p is string => typeof p === "string",
    );
    const text = JSON.stringify([treatmentSummaries, treatmentDetails]).toLowerCase();
    expect(phrases.filter((p) => text.includes(p.toLowerCase()))).toEqual([]);
  });
});
