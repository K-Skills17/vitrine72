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

---

## Demo Sites — apps/demo (Estética + Planejados)

| # | Item | Used for | Placeholder |
|---|---|---|---|
| B1 | Railway bot embed snippet URL + JSON schema the bot expects | `ChatbotEmbed.tsx` — `NEXT_PUBLIC_BOT_EMBED_URL` env var; bot-config/*.json stubs ready to fill | `PLACEHOLDER_BOT_EMBED_URL` |
| B2 | Whether one Railway instance serves many clients (multi-tenant) or each client gets a dedicated instance | Determines `clientId` field in bot-config/*.json and CORS setup | bot-config/{niche}.json `corsAllowedOrigins` |
| B3 | WhatsApp number for Estética demo | Qualifier redirect | `PLACEHOLDER_WHATSAPP_ESTETICA` in `config/estetica.ts` |
| B4 | WhatsApp number for Planejados demo | Qualifier redirect | `PLACEHOLDER_WHATSAPP_PLANEJADOS` in `config/planejados.ts` |
| B5 | DNS access — create `estetica.vitrini72.com.br` and `planejados.vitrini72.com.br` subdomains pointing to Vercel | Demo site URLs for cold calls | Two Vercel projects: `vitrine72-demo-estetica`, `vitrine72-demo-planejados` |
| B6 | GA4 Measurement ID (optional) | Analytics events — no-op if missing | `NEXT_PUBLIC_GA4_ID` env var per Vercel project |
| B7 | Meta Pixel ID (optional) | Analytics events — no-op if missing | `NEXT_PUBLIC_META_PIXEL_ID` env var per Vercel project |
| B8 | Confirm budget ranges per niche (current defaults: estética R$500/1.5k/3k; planejados R$15k/30k/60k) | Qualifier options | `config/estetica.ts` and `config/planejados.ts` |
| B9 | Real photos to replace placeholder blocks (labeled "Exemplo") | ProofPlaceholder section | `ProofPlaceholder.tsx` — swap dashed boxes for `<Image>` |
| B10 | Intake tool for paying clients (Tally / Google Forms link) | Not part of demo build — needed for sales close | Separate from demo; note here for tracking |

### Railway Bot Security Checklist (to implement on Railway side)
- [ ] CORS restricted to each client domain only (no wildcard)
- [ ] Rate limiting per IP (e.g., max 20 req/min)
- [ ] Monthly spend cap on the LLM API key
- [ ] Data-retention period defined for chat logs (e.g., 30 days)
- [ ] Health endpoint exposed so ChatbotEmbed.tsx can verify bot is alive before loading widget

### Vercel Deployment (after DNS + WhatsApp numbers are confirmed)
```bash
# Estética
cd apps/demo
NEXT_PUBLIC_NICHE=estetica vercel --prod

# Planejados
NEXT_PUBLIC_NICHE=planejados vercel --prod
```
Set env vars in each Vercel project:
- `NEXT_PUBLIC_NICHE` = `estetica` or `planejados`
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (or baked into config — already in config files)
- `NEXT_PUBLIC_GA4_ID` (optional)
- `NEXT_PUBLIC_META_PIXEL_ID` (optional)
- `NEXT_PUBLIC_BOT_EMBED_URL` (from Railway, item B1)
