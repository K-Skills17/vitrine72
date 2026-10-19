import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { generateSite } from "../generator.js";
import { runAllChecks } from "../../../qa/src/checks.js";

const FIXTURE_INTAKES: Record<string, Record<string, unknown>> = {
  estetica: {
    businessName: "Studio Teste Estética",
    documentType: "cpf",
    document: "12345678909",
    responsibleName: "Maria",
    whatsapp: "11999999999",
    email: "maria@example.com",
    vertical: "estetica",
    city: "São Paulo",
    neighborhoods: "Pinheiros",
    exactAddress: "Rua dos Pinheiros, 100 — Pinheiros, São Paulo - SP",
    hours: "Seg–Sex 9h–18h",
    service1Name: "Progressiva",
    service1Price: "R$ 250",
    service2Name: "Coloração",
    service2Price: "R$ 300",
    service3Name: "Corte",
    service3Price: "R$ 90",
    idealCustomer: "Mulheres que querem cabelos saudáveis.",
    faq1: "Quanto dura a progressiva?",
    faq2: "Aceita cartão?",
    faq3: "Precisa agendar?",
    primaryAction: "whatsapp",
    primaryActionUrl: "11999999999",
    updateFrequency: "mensal",
    colorChoice: "preset1",
    domainHas: "nao",
    uploadedPhotos: Array.from({ length: 8 }, (_, i) => `test_photo_${i}.jpg`),
  },
};

const VERTICALS_TO_TEST = [
  "estetica",
  "moveis-planejados",
  "energia-solar",
  "servicos-urgentes",
  "fisioterapia-pilates",
  "buffet-eventos",
  "generico",
] as const;

describe("site generator — fixture snapshots", () => {
  let tmpDirs: string[] = [];

  afterAll(() => {
    for (const dir of tmpDirs) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  for (const vertical of VERTICALS_TO_TEST) {
    it(`generates a site for vertical: ${vertical}`, async () => {
      const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `vitrine72-test-${vertical}-`));
      tmpDirs.push(tmpDir);

      const intake: Record<string, unknown> = {
        ...(FIXTURE_INTAKES.estetica),
        vertical,
        businessName: `Negócio Teste ${vertical}`,
        uploadedPhotos: Array.from({ length: 8 }, (_, i) => `test_${i}.jpg`),
      };

      const config = await generateSite({
        projectId: `test-${vertical}`,
        intake,
        gbpData: null,
        outputDir: tmpDir,
      });

      // Verify output files exist
      expect(fs.existsSync(path.join(tmpDir, "site-config.json"))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, "robots.txt"))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, "llms.txt"))).toBe(true);
      expect(fs.existsSync(path.join(tmpDir, "sitemap.xml"))).toBe(true);

      // Verify JSON-LD
      const siteConfig = JSON.parse(
        fs.readFileSync(path.join(tmpDir, "site-config.json"), "utf-8")
      ) as { jsonLd: unknown[] };
      expect(Array.isArray(siteConfig.jsonLd)).toBe(true);
      expect(siteConfig.jsonLd.length).toBeGreaterThan(0);

      // Verify robots.txt has AI bots
      const robots = fs.readFileSync(path.join(tmpDir, "robots.txt"), "utf-8");
      expect(robots).toContain("GPTBot");
      expect(robots).toContain("ClaudeBot");

      // Run QA checks
      const qa = await runAllChecks(tmpDir, config);
      const blocking = qa.blockingIssues.filter(
        (i) => !i.includes("placeholder") // placeholders expected without API key
      );
      expect(blocking).toHaveLength(0);
    }, 30000); // 30s timeout for async copy drafting
  }
});

describe("site generator — banned phrases detection", () => {
  it("throws if copy contains banned phrases", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vitrine72-banned-"));

    const intake = {
      ...FIXTURE_INTAKES.estetica,
      idealCustomer: "qualidade e excelência no atendimento diferenciado",
    };

    // Without Anthropic key, fallback copy won't contain banned phrases
    // This test verifies the validateCopy function would catch them
    // by injecting a banned phrase directly
    const configPath = path.join(tmpDir, "site-config.json");
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        businessName: "Test",
        address: "Rua Test",
        phone: "11999",
        copyBlocks: {
          heroHeadline: "qualidade e excelência",
        },
      })
    );

    const { checkNoBannedPhrases } = await import("../../../qa/src/checks.js");
    const result = checkNoBannedPhrases(tmpDir);
    expect(result.passed).toBe(false);
    expect(result.message).toContain("qualidade e excelência");

    fs.rmSync(tmpDir, { recursive: true });
  });
});
