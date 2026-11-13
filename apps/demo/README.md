# Vitrini72 Demo Sites — apps/demo

Two cold-call demos, one codebase. The prospect opens the link on WhatsApp while still on the phone.

| Demo | Brand | Niche |
|---|---|---|
| `estetica` | Clínica Aurora Estética | Procedimentos estéticos faciais |
| `planejados` | Atelier Madeira Planejados | Móveis planejados sob medida |

**Core promise shown:** Only qualified clients reach the business's WhatsApp.

---

## Run locally

```bash
# Estética (port 3001)
pnpm dev:estetica

# Planejados (port 3002)
pnpm dev:planejados
```

---

## Create a new client site from this template

1. **Add a niche config** at `config/meu-nicho.ts`:

```ts
import type { NicheConfig } from "../lib/niche";
const config: NicheConfig = {
  niche: "meu-nicho",
  brandName: "Nome do Cliente",
  // ... all fields required
};
export default config;
```

2. **Register it** in `lib/niche.ts` — add an `else if` block:

```ts
} else if (niche === "meu-nicho") {
  _config = require("../config/meu-nicho").default;
}
```

3. **Add a bot-config stub** at `bot-config/meu-nicho.json` (copy an existing file).

4. **Set Vercel env vars** per project:
   - `NEXT_PUBLIC_NICHE=meu-nicho`
   - `NEXT_PUBLIC_BOT_EMBED_URL` (Railway snippet — see NEEDS item B1)
   - `NEXT_PUBLIC_GA4_ID` (optional)
   - `NEXT_PUBLIC_META_PIXEL_ID` (optional)

5. **Deploy**:
```bash
NEXT_PUBLIC_NICHE=meu-nicho pnpm build:meu-nicho
vercel --prod
```

---

## Tier config

```ts
{
  tier: 3,            // 1=Essencial, 2=Autoridade, 3=Agenda Qualificada
  features: {
    qualifier: true,  // ON in every tier — the WhatsApp gate
    chatbot: true,    // Level 3 only — Railway bot
    multiPage: true,  // Level 2+
    serviceFilter: true, // Level 2+
    lowFitMode: "tag",   // "tag" (default) or "soft"
  }
}
```

---

## WhatsApp qualifier gate

Every entry point (Hero, Nav, Service cards, Floating button) opens a **bottom-sheet qualifier** — never a direct `wa.me` link.

- Tap-to-answer choices only (no typing except first name)
- 4 steps, progress bar, back button, ≤ 30s to complete
- On finish: opens `https://wa.me/{NUMBER}?text={URL_ENCODED_MESSAGE}` with answers as the first message
- Low-fit leads fire `lead_low_fit` event; in `"soft"` mode they see a friendly screen first

### Qualifier questions

**Estética:** Nome → Serviço → Quando → Investimento
**Planejados:** Nome → Ambiente → Situação do imóvel → Investimento

### Prefilled message format
```
Olá! Sou {name}.
Interesse: {service}
Quando: {timing}        (estética) / Situação do imóvel: {timing}  (planejados)
Investimento: {budget}
(Vim pelo site)
```

---

## Analytics events

| Event | Trigger |
|---|---|
| `qualifier_open` | Qualifier sheet opened |
| `qualifier_step_1..4` | Each step completed |
| `qualifier_complete` | All 4 steps done |
| `whatsapp_redirect` | WhatsApp URL opened |
| `lead_low_fit` | Answers match low-fit criteria |

No-op if `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL_ID` are not set.

---

## Chatbot (Level 3)

`ChatbotEmbed` loads the Railway widget **lazily** (3s idle or first interaction) — no Lighthouse impact.

- Stub mode: renders 🤖 placeholder when `NEXT_PUBLIC_BOT_EMBED_URL` is not set
- Production: injects `<script src="BOT_EMBED_URL" data-niche="..." data-client-config="...">`
- Bot config stubs: `bot-config/{niche}.json`

See `NEEDS_FROM_KOMANDO.md` items B1–B2.

---

## Security headers (vercel.json)

- `Strict-Transport-Security` (HSTS, 2y)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` — scoped to own domain + analytics + Railway bot domain

Replace `PLACEHOLDER_BOT_RAILWAY_DOMAIN` in `vercel.json` after Railway is set up.

---

## Tests

```bash
NEXT_PUBLIC_NICHE=estetica pnpm test:e2e
NEXT_PUBLIC_NICHE=planejados pnpm test:e2e
```

Covers:
- No direct `wa.me` links on the page
- All entry points open the qualifier
- Full qualifier flow → `wa.me` URL with answers URL-encoded
- Back button keeps previous step visible
- Progress bar advances
- Escape key closes qualifier
- Low-fit path (tag mode) still redirects to WhatsApp
