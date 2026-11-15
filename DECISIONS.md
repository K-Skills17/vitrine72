# DECISIONS.md — Engineering decisions log

| Decision | Reason |
|---|---|
| pnpm workspaces over turborepo | Simpler setup; turbo can be added later if build times become an issue. |
| App Router (Next.js 15) over Pages Router | App Router is stable; RSC enables zero-JS marketing pages; better for SEO. |
| Supabase over PlanetScale/Neon | Supabase provides Auth, Storage and Postgres in one; no extra vendor for auth. |
| Resend over SendGrid | Better DX, pt-BR UTF-8 safe, cleaner API. |
| Zod everywhere at API/form boundary only | Avoids double-validation; internal business logic stays plain TypeScript. |
| `offer.ts` as single price source; lint rule blocks R$ literals | Spec requirement; enforced by Vitest test `offer.noLiterals.test.ts`. |
| Business days in `packages/core` using `date-fns-tz` | Timezone-safe (America/Sao_Paulo); avoids moment.js. |
| Status machine as a pure function (not a class) | Easier to unit-test; no hidden state. |
| Kiwify config-switch `config/payment.json` → `provider: "kiwify"│"asaas"` | Spec says implement both paths; one setting swaps them. If Kiwify rejects service products, set provider to "asaas". |
| Audio transcription via Whisper-compatible endpoint (OpenAI Whisper or Groq) | Key in NEEDS. Fallback: skip transcription, store raw audio only. |
| Lighthouse CI via @lhci/cli inside `pnpm qa` | No extra infra; runs against the built static site. |
| Schema.org type map: estética→HealthAndBeautyBusiness, móveis→FurnitureStore, energia→LocalBusiness+ElectricalContractor, urgentes→LocalBusiness (with serviceType), fisio→Physiotherapy, buffet→EventVenue, genérico→LocalBusiness | Closest valid types per Schema.org; trade-off between specificity and coverage. Documented here per spec. |
| `/ops` uses Supabase Auth email-allowlist (not RBAC) | Single-operator MVP; can add roles later. |
| Color extraction from logo uses `color-thief-node` (Node port of color-thief) | No external API needed; runs in generate.ts. |
| Generated sites use static export (`output: 'export'`) | Simplest Vercel deploy; no SSR needed for client sites. ISR-dependent sites (self-edit) use `output: 'standalone'` instead. |
| Self-edit (field 17 = "semanal") uses Google Sheets published CSV + ISR 60s | No login required for client; safe fallback to last good cache. |
| Commission clawback creates negative `commission_entries` rows (not deletes) | Preserves audit trail. |
| Partner 20% on Kiwify is paid by Kiwify's split; recorded here for reporting only | Spec requirement. |
| `golive_earliest_at = payment_date + 8 calendar days` | Spec says "day 8 after payment"; using calendar days not business days (spec is explicit). |
| Annual holidays list seeded for 2026–2027; flagged in NEEDS for operator confirmation | Reduces blocking; operator must verify before first production intake. |
| Before/after slider hidden unless client supplies paired images in intake | Avoids showing one-sided images; better UX. |
| Portfolio `biodonth.com.br`, `studioafrorosas.com.br`, `gymeraactive.com` included; `yohanny-kamilly.vercel.app` gated behind `enabled: false` in portfolio.json | Spec requirement. |
| Builder QA fails closed (2026-11) | `apps/builder/src/qa.ts` runs real checks; the deploy endpoint treats a missing QA result as a fail, so no client is emailed an unchecked preview. |
| Builder palettes and fonts are a checked preset list (2026-11) | `apps/builder/src/design-presets.ts`; a test enforces WCAG AA for the colour pairs the template renders. 10 of the previous 11 palettes failed. |
| Client-site template rebuilt on the editorial framework (2026-11) | Same config contract and routes; variants map to editorial compositions; `framer-motion` removed; fixture-based checks in `apps/client-site/scripts/fixtures`. See `apps/client-site/README.md`. |
| `primaryAction: "form"` opens WhatsApp (2026-11) | The template has no form backend; linking to a contact page without a form created a loop. |
