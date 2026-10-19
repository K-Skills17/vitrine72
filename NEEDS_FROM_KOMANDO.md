# NEEDS_FROM_KOMANDO.md

Items marked ✅ are resolved. All others block production.

| # | Item | Used for | Placeholder |
|---|---|---|---|
| 1 | Register vitrine72.com.br; point DNS to Vercel | Marketing site, email sending domain | `PLACEHOLDER_DOMAIN` |
| 2 | Vercel team slug + API token | App hosting, client site deploys | `PLACEHOLDER_VERCEL_TOKEN`, `PLACEHOLDER_VERCEL_TEAM` |
| 3 | Supabase project URL, anon key, service key | Database, storage, ops auth | `PLACEHOLDER_SUPABASE_URL`, `PLACEHOLDER_SUPABASE_ANON_KEY`, `PLACEHOLDER_SUPABASE_SERVICE_KEY` |
| 4 | Resend API key + verified sending domain | Intake and reminder emails | `PLACEHOLDER_RESEND_KEY`, `PLACEHOLDER_RESEND_FROM` |
| 5 | Kiwify account, product IDs per SKU, webhook secret; confirm service product allowed | Self-checkout, affiliates | `PLACEHOLDER_KIWIFY_WEBHOOK_SECRET`, `PLACEHOLDER_KIWIFY_PRODUCT_*` |
| 6 | Asaas API key, payment links per SKU, webhook secret | Seller deals, maintenance subscriptions | `PLACEHOLDER_ASAAS_API_KEY`, `PLACEHOLDER_ASAAS_WEBHOOK_SECRET` |
| 7 | Google Places API key | Research pass | `PLACEHOLDER_GOOGLE_PLACES_KEY` |
| 8 | Anthropic API key | Copy drafting | `PLACEHOLDER_ANTHROPIC_KEY` |
| 9 | Transcription API key (OpenAI or Groq Whisper) | Audio answers in intake | `PLACEHOLDER_TRANSCRIPTION_KEY`, `PLACEHOLDER_TRANSCRIPTION_URL` |
| 10 | Final hero headlines and section titles (hook-tested) | Marketing site hero, partner landings | See `data-copy="provisional"` elements in `apps/web/app/(marketing)/page.tsx` |
| 11 | Yohanny site fixed and on custom domain (yes/no) | Portfolio section — gated by `enabled: false` | `config/portfolio.json` item `yohanny` |
| 12 | Portfolio screenshots or approval to auto-capture | Portfolio section | `config/portfolio.json` screenshot URLs |
| 13 | Lawyer review of `termos`, `contrato` and privacy policy | Legal pages, intake contract version | `apps/web/app/termos/page.tsx`, `apps/web/app/privacidade/page.tsx` |
| 14 | Holiday calendar confirmation 2026–2027 | Deadline calculation | `config/holidays.json` seeded; needs operator sign-off |
| 15 | Ops allowlist emails (Komando, operator) | `/ops` login | `OPS_EMAIL_ALLOWLIST` in env |
| 16 | Seller names/IDs and their Asaas payment links | `/s/[seller]`, commissions | `config/sellers.json` |
| 17 | Influencer handles + Kiwify affiliate IDs | `/p/[handle]`, commissions | `config/partners.json` |
| 18 | Curated palettes and font pairs per vertical approved | Generator presets | `packages/site-template/src/verticals/*.ts` |
| 19 | Vitrine72 WhatsApp number and contact e-mail | Marketing site, emails | `PLACEHOLDER_WHATSAPP`, `PLACEHOLDER_CONTACT_EMAIL` |
| 20 | MEI CNPJ and legal name for footer and terms | Legal pages | `PLACEHOLDER_CNPJ`, `PLACEHOLDER_LEGAL_NAME` |
| 21 | Kiwify fallback decision: if service products not allowed, confirm switch to Asaas-only (`config/payment.json → provider: "asaas"`) | Payment routing | `config/payment.json` |
| 22 | Groq or OpenAI endpoint URL for transcription | Audio transcription | `PLACEHOLDER_TRANSCRIPTION_URL` |
