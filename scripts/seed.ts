#!/usr/bin/env ts-node
/**
 * Seed script: creates 3 fixture projects for local development.
 * Run: pnpm seed
 */

import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../apps/web/.env.local") });

const FIXTURES = [
  {
    id: "fixture-estetica-001",
    sku: "SITE_5P",
    vertical: "estetica",
    businessName: "Studio Bella Vita",
    intake: {
      businessName: "Studio Bella Vita",
      documentType: "cnpj",
      document: "11222333000181",
      responsibleName: "Ana Silva",
      whatsapp: "11987654321",
      email: "ana@bellavita.example.com",
      vertical: "estetica",
      city: "São Paulo",
      neighborhoods: "Pinheiros, Vila Madalena",
      exactAddress: "Rua dos Pinheiros, 500 — Pinheiros, São Paulo - SP, 05422-001",
      hours: "Seg–Sex 9h–19h, Sáb 9h–14h",
      gbpLink: "",
      instagramLink: "@studiobellavita",
      service1Name: "Progressiva brasileira",
      service1Price: "R$ 280",
      service2Name: "Coloração completa",
      service2Price: "R$ 350",
      service3Name: "Corte feminino",
      service3Price: "R$ 120",
      idealCustomer: "Mulheres de 25 a 45 anos que querem cuidar do cabelo sem complicação.",
      faq1: "Quanto tempo dura a progressiva?",
      faq2: "Aceita cartão de crédito?",
      faq3: "É necessário agendar?",
      primaryAction: "whatsapp",
      primaryActionUrl: "11987654321",
      updateFrequency: "mensal",
      colorChoice: "preset1",
      domainHas: "nao",
      uploadedPhotos: Array.from({ length: 10 }, (_, i) => `seed/photo_${i + 1}.jpg`),
      allowGoogleReviews: true,
    },
  },
  {
    id: "fixture-solar-002",
    sku: "ANCHOR_SITE_GBP_BOT",
    vertical: "energia-solar",
    businessName: "Solar Sul Energia",
    intake: {
      businessName: "Solar Sul Energia",
      documentType: "cnpj",
      document: "22333444000192",
      responsibleName: "Carlos Souza",
      whatsapp: "11912345678",
      email: "carlos@solarsul.example.com",
      vertical: "energia-solar",
      city: "São Paulo",
      neighborhoods: "Santo André, São Bernardo, Mauá",
      exactAddress: "Av. Industrial, 200 — Santo André - SP, 09080-000",
      hours: "Seg–Sex 8h–18h",
      service1Name: "Instalação residencial",
      service1Price: "A partir de R$ 15.000",
      service2Name: "Instalação comercial",
      service2Price: "A partir de R$ 35.000",
      service3Name: "Manutenção preventiva",
      service3Price: "R$ 350",
      idealCustomer: "Proprietários de casa própria que querem reduzir a conta de luz.",
      faq1: "Em quanto tempo tenho retorno do investimento?",
      faq2: "O que acontece em dias nublados?",
      faq3: "Precisa de aprovação da concessionária?",
      primaryAction: "orcamento",
      updateFrequency: "raramente",
      colorChoice: "preset1",
      domainHas: "nao",
      uploadedPhotos: Array.from({ length: 9 }, (_, i) => `seed/solar_${i + 1}.jpg`),
    },
  },
  {
    id: "fixture-pilates-003",
    sku: "SITE_5P",
    vertical: "fisioterapia-pilates",
    businessName: "Studio Movimento e Saúde",
    intake: {
      businessName: "Studio Movimento e Saúde",
      documentType: "cpf",
      document: "12345678909",
      responsibleName: "Dra. Fernanda Costa",
      whatsapp: "11956789012",
      email: "fernanda@movimento.example.com",
      vertical: "fisioterapia-pilates",
      city: "São Paulo",
      neighborhoods: "Moema, Ibirapuera, Vila Nova Conceição",
      exactAddress: "Rua Iraí, 85, cj 42 — Moema, São Paulo - SP, 04082-001",
      hours: "Seg–Sex 7h–20h, Sáb 8h–12h",
      service1Name: "Pilates reformer",
      service1Price: "R$ 150/sessão",
      service2Name: "Fisioterapia ortopédica",
      service2Price: "R$ 180/sessão",
      service3Name: "Pilates solo",
      service3Price: "R$ 100/sessão",
      idealCustomer: "Pessoas com dores crônicas ou que buscam condicionamento físico.",
      faq1: "Preciso de indicação médica?",
      faq2: "Quantas sessões são necessárias?",
      faq3: "Fazem plano mensal?",
      primaryAction: "agendamento",
      primaryActionUrl: "https://agenda.exemplo.com.br",
      updateFrequency: "semanal",
      colorChoice: "preset1",
      domainHas: "nao",
      uploadedPhotos: Array.from({ length: 8 }, (_, i) => `seed/pilates_${i + 1}.jpg`),
    },
  },
];

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log("Seeding fixture projects…");

  for (const fixture of FIXTURES) {
    const intakeToken = randomUUID();
    const paymentDate = new Date();
    paymentDate.setDate(paymentDate.getDate() - 10); // 10 days ago

    // Upsert project
    const { data: project, error } = await supabase
      .from("projects")
      .upsert({
        id: fixture.id as unknown as string,
        status: "intake_complete",
        sku: fixture.sku,
        intake_token: intakeToken,
        source: "inbound",
        payment_provider: "kiwify",
        payment_provider_ref: `fixture_${fixture.id}`,
        gross_amount: fixture.sku === "SITE_5P" ? 1997 : 3497,
        payment_method: "pix",
        payment_date: paymentDate.toISOString().slice(0, 10),
        clock_started_at: paymentDate.toISOString(),
        preview_due_at: new Date(paymentDate.getTime() + 3 * 24 * 3600 * 1000).toISOString(),
        golive_earliest_at: new Date(paymentDate.getTime() + 8 * 24 * 3600 * 1000).toISOString(),
        maintenance_active: false,
        has_partner_bonus: false,
        revision_count: 0,
        vertical: fixture.vertical,
      })
      .select("id")
      .single();

    if (error) {
      console.error(`Error upserting project ${fixture.id}:`, error.message);
      continue;
    }

    // Upsert intake
    await supabase.from("intake_submissions").upsert({
      project_id: project.id,
      completed_at: paymentDate.toISOString(),
      data: fixture.intake,
    });

    console.log(`✓ Seeded: ${fixture.businessName} (${fixture.vertical})`);
  }

  console.log("\nSeed complete. Run `pnpm generate <projectId>` to generate a site.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
