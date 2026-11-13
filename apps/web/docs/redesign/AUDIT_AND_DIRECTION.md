# Main site redesign — audit and direction

Date: 2026-11-13 · Scope: the marketing homepage at `/` (`app/(marketing)/page.tsx`, `components/marketing/*`). Offer, prices, checkout and intake are **not** changed by this redesign.

## 1. Audit: why the site reads as AI-built

Rendered locally from `master` at 1440px and 390px. Findings, most important first.

### 1.1 No proof, on a site that sells websites
- The portfolio section renders three cards that each say **"Screenshot em breve"**. `config/portfolio.json` lists real clients (Biodonth, Studio Afro Rosas, Gymera) but every `screenshotUrl` is a placeholder.
- No testimonials, no client results, no founder or team, no photo of a real person anywhere.
- The site's own design is the main proof of quality, and it is the most generic part (see 1.2).

### 1.2 The template look
- **Identical section rhythm, seven times:** centered small gold label → large serif title → short gold divider → grey subtitle → grid of identical cards with a lucide icon in a rounded square. Nothing breaks the pattern, so nothing is remembered.
- **The most common AI landing-page palette:** near-black background, gold accent, Playfair Display + Inter, gold gradient text, pulsing radial glow, grain overlay.
- **Centered hero with checkmark chips**, the default output of most site generators.
- **Generic copy:** "Seu negócio merece estar online", "Sem letras miúdas", "Clientes te encontram, você só atende". Any agency could say it.

### 1.3 Promise clarity
- Headline promises **"em 72 horas úteis"**; elsewhere the site says **"Prévia em 3 dias úteis"** and **"Site vai ao ar a partir do dia 8"**. "72 horas úteis" can be read as 72 working hours (about 9 working days) or as 3 days. A buyer who expects a live site in 72 hours and learns it goes live on day 8 at the earliest may feel misled. The rules are disclosed, but the headline sets the wrong expectation.

### 1.4 Craft details
- Hero content starts invisible (`initial="hidden"` in framer-motion) and fades in: slower first paint, and no content without JavaScript.
- Cookie banner covers the "Como funciona" cards on first view.
- Pricing shows two plans, a maintenance plan, four add-ons and a downsell link on one screen: many decisions at the moment of purchase.
- Brand spelling: the site says **"Vitrine72"** (39 times); the domain is **vitrini72.com.br**.

### 1.5 What works and stays
- The offer is concrete and honest: fixed price, page count, preview deadline, one revision round, domain in the client's name, the "regras claras" section.
- Checkout, intake and partner/seller routes are solid and stay untouched.

## 2. Direction

### 2.1 Idea: "72" as the structure, the work as the proof
- **The clock is the layout device.** The process is shown as a timeline from hour 0 to delivery (pagamento → briefing → prévia → revisão → no ar), with the real rules on it. It explains the offer and fixes the expectation problem in 1.3 in one move.
- **The hero shows a real site, not a slogan.** A browser frame with a finished site (ÁUREA and the two demos now; client sites once screenshots exist), so the first thing a visitor sees is the quality they are buying.
- **Proof before price.** Work → process → what's included → price → rules → FAQ.

### 2.2 Identity (distinct from ÁUREA, which is a client sample)
- **Light, paper-white base with deep ink**, one sharp signal accent (no gold, no gradients, no glow).
- **Typography:** a contemporary grotesk for display and UI, with a mono for the clock, numbers and labels. Studio and tool, not boutique.
- **Asymmetric editorial grid**, hairline rules, large numerals; cards only where they hold real content (screenshots).
- **Motion:** same rules as ÁUREA (never hide content on first paint, reduced motion respected).

### 2.3 Copy principles
- Concrete over clever: say what the client gets, by when, for how much.
- One consistent promise: **"Prévia do seu site em 3 dias úteis"**, with go-live from day 8 stated next to it.
- Show the rules as the selling point they are.

## 3. Assets needed (the biggest single factor)

| Asset | Why | Status |
|---|---|---|
| Screenshots of Biodonth, Studio Afro Rosas, Gymera (desktop + mobile) | Real proof; the build environment cannot reach those sites | Needed from Vitrini72 |
| Permission to name those clients, one sentence each on the result | Testimonial/result line | Needed |
| Founder photo and two lines on who builds the sites | Trust; a real person behind the offer | Needed |
| Demo screenshots (ÁUREA, estética, planejados) | Can be captured from this repo | Done in the build |

## 4. Plan

1. Decisions on brand spelling and direction (this document).
2. Design tokens and fonts; new section components alongside the old ones.
3. Homepage rebuilt section by section; checkout URLs and offer data unchanged (`@vitrine72/core`).
4. Demo screenshots captured from the repo; client screenshots slotted in when supplied.
5. Checks: typecheck, lint, build, Playwright at 1440/390, link check, Lighthouse-style review of first paint.

## 5. Decisions (2026-11-13)

- Brand spelling: **Vitrini72** (matches the domain). Changed in every visible string in `apps/web`: metadata, nav, footer, legal pages, emails, checkout item names, card statement descriptor, `llms.txt`, JSON-LD. Package names (`@vitrine72/core`) and the internal crawler User-Agent are unchanged.
- Direction: **light studio**.
- Promise: **"Prévia em 3 dias úteis · No ar a partir do dia 8"**.

## 6. Status — homepage rebuilt

Built in `components/home/` and used by `app/(marketing)/page.tsx`:
- Palette under the Tailwind `v` namespace (paper, card, ink, muted, line, signal), Schibsted Grotesk + IBM Plex Mono loaded only on this page.
- Sections: nav · hero (real site in a browser frame + phone) · trabalhos (ÁUREA as a multi-page project "sob consulta", the two 5-page demos with links, client sites from `config/portfolio.json`) · processo (the 72 timeline on ink) · incluso · preço (two plans, opcionais table, downsell) · regras claras · dúvidas · closing CTA · footer.
- All prices, deadlines and rules read from `@vitrine72/core`; checkout links unchanged (`SITE_5P`, `ANCHOR_SITE_GBP_BOT`, `LANDING_1P`).
- Demo screenshots captured from this repo into `public/work/` (WebP, 48–90 KB).
- Cookie notice restyled as a compact neutral card (shared by all marketing routes).
- Motion: same reveal rules as ÁUREA; nothing on screen at load is ever hidden.

Verified (actual runs): typecheck, lint, unit tests (9/9), build pass. Playwright at 1440 and 390px: 0px overflow, one `h1`, all images with alt, every in-page anchor resolves, 0 elements hidden at load, all reveals shown after scroll, no console errors. `/sobre`, `/termos`, `/privacidade`, `/obrigado`, `/llms.txt` return 200.

## 7. Not yet done

- **Client screenshots** for Biodonth, Studio Afro Rosas and Gymera: until supplied, they show as typographic cards linking to the live sites. Add the file path to `screenshotUrl` in `config/portfolio.json` and the homepage picks it up.
- **Partner and seller pages** (`/p/[handle]`, `/s/[seller]`) still use the old dark components; move them to the new sections once the homepage is approved.
- **`/sobre`** still uses the old dark design and needs the founder photo and story.
- No testimonials yet: add only real ones, with permission.
