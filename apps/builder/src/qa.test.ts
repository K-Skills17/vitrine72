import { test } from "node:test";
import assert from "node:assert/strict";
import { PALETTES } from "./design-presets.js";
import { checkConfig, checkDeployment, isRegulatedVertical, loadBannedPhrases, mergeResults, type QaInput } from "./qa.js";

const base: QaInput = {
  businessName: "Estúdio Lume",
  vertical: "moveis-planejados",
  phone: "(11) 91234-5678",
  palette: PALETTES["ivory-espresso"]!,
  copyBlocks: {
    heroHeadline: "Marcenaria sob medida no Itaim",
    heroSubheadline: "Projetos de cozinha e closet desenhados para o seu imóvel.",
    aboutText: "Atendemos o Itaim e a Vila Olímpia desde o projeto até a instalação.",
    serviceDescriptions: { Cozinhas: "Projeto, produção e montagem." },
    faqAnswers: { "Qual o prazo?": "Combinado após a medição." },
  },
};

const with_ = (patch: Partial<QaInput["copyBlocks"]>, other: Partial<QaInput> = {}): QaInput => ({
  ...base,
  ...other,
  copyBlocks: { ...base.copyBlocks, ...patch },
});

test("clean config passes every check", () => {
  const r = checkConfig(base, ["qualidade e excelência"]);
  assert.equal(r.passed, true, r.blocking_issues.join("\n"));
  assert.equal(r.checks.regulated_claims, undefined); // not a regulated vertical
});

test("banned phrases are caught regardless of case and accents", () => {
  const r = checkConfig(with_({ aboutText: "Trabalhamos com QUALIDADE E EXCELENCIA." }), ["qualidade e excelência"]);
  assert.equal(r.passed, false);
  assert.equal(r.checks.banned_phrases, "fail");
});

test("real banned-phrases.json loads", () => {
  assert.ok(loadBannedPhrases().length > 10);
});

test("placeholders and leftover markup fail", () => {
  assert.equal(checkConfig(with_({ heroSubheadline: "Atendemos [BAIRRO]" }), []).checks.placeholders, "fail");
  assert.equal(checkConfig(with_({ aboutText: "PLACEHOLDER" }), []).checks.placeholders, "fail");
});

test("invalid phone and long headline fail", () => {
  const r = checkConfig(with_({ heroHeadline: "um dois três quatro cinco seis sete oito nove dez onze doze treze" }, { phone: "123" }), []);
  assert.equal(r.checks.phone_format, "fail");
  assert.equal(r.checks.headline_length, "fail");
});

test("regulated verticals reject outcome promises", () => {
  assert.equal(isRegulatedVertical("estetica"), true);
  assert.equal(isRegulatedVertical("Fisioterapia & Pilates"), true);
  assert.equal(isRegulatedVertical("buffet-eventos"), false);
  const r = checkConfig(with_({ aboutText: "Resultados garantidos e sem dor." }, { vertical: "estetica" }), []);
  assert.equal(r.checks.regulated_claims, "fail");
  assert.equal(r.passed, false);
});

test("low-contrast palette fails", () => {
  const bad = { ...base.palette, id: "bad", accent: "#7fffd4" };
  assert.equal(checkConfig({ ...base, palette: bad }, []).checks.palette_contrast, "fail");
});

const fakeFetch = (pages: Record<string, { status: number; body?: string }>) =>
  (async (input: string | URL | Request) => {
    const path = new URL(input instanceof Request ? input.url : input).pathname;
    const page = pages[path] ?? { status: 404 };
    return new Response(page.body ?? "", { status: page.status });
  }) as typeof fetch;

test("deployment check passes when every route renders the business", async () => {
  const ok = { status: 200, body: "<h1>Estúdio Lume</h1>" };
  const r = await checkDeployment("https://x.vercel.app", "Estúdio Lume", fakeFetch({ "/": ok, "/servicos": ok, "/sobre": ok, "/faq": ok, "/contato": ok }));
  assert.equal(r.passed, true, r.blocking_issues.join("\n"));
});

test("deployment check fails on 404, protection and wrong content", async () => {
  const ok = { status: 200, body: "<h1>Estúdio Lume</h1>" };
  const r = await checkDeployment(
    "https://x.vercel.app",
    "Estúdio Lume",
    fakeFetch({ "/": ok, "/servicos": { status: 401 }, "/sobre": { status: 200, body: "other" }, "/faq": ok }),
  );
  assert.equal(r.passed, false);
  assert.equal(r.blocking_issues.length, 3);
  assert.match(r.blocking_issues.join(" "), /protected/);
});

test("mergeResults fails if any part fails", () => {
  const pass = { passed: true, checks: { a: "pass" as const }, blocking_issues: [] };
  const fail = { passed: false, checks: { b: "fail" as const }, blocking_issues: ["x"] };
  assert.equal(mergeResults(pass, fail).passed, false);
  assert.deepEqual(mergeResults(pass, fail).checks, { a: "pass", b: "fail" });
});
