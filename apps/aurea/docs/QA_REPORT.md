# QA Report — ÁUREA

Date: 2026-11-13 · Build: Next 16.4.6, production (`next build` + `next start`)

## Summary

All nine phases are complete. Every automated check passes. The site is ready for review as a **demonstration**. It is **not** ready to represent a real clinic: see "Before real use".

## Automated checks (actual runs)

| Check | Result |
|---|---|
| `pnpm typecheck` | Pass |
| `pnpm lint` | Pass, 0 warnings |
| `pnpm test` (Vitest) | 33/33: WhatsApp utility, qualified message, analytics allow-list, motion token sync, inquiry validation, content integrity (every treatment has a page, links and professionals resolve, every "para quem" ends with the evaluation caveat, 25 banned phrases absent) |
| `pnpm build` | Pass; 12 pages, sitemap, robots and OG image statically generated |
| `pnpm test:e2e` (Playwright, desktop 1440px + Pixel 7) | 44/44: every route 200 with one `h1` and no console errors; unknown treatment 404; robots blocks indexing; sitemap complete; qualification gate (4 steps from the hero, 3 from a treatment page, Escape closes); inquiry form errors, focus and demo state; no horizontal overflow on any route; every image has alt text; skip link; sticky bar on mobile, floating button on desktop |
| Link crawl from `/` | 12 pages, 0 broken links |

## Manual and scripted checks done during the build

- Layout reviewed in screenshots at 1440px and 390px for every page.
- Chatbot photo upload: with the lk-chatbot API intercepted in the browser, a photo plus text is sent as `{ sessionId, text, imageBase64, imageMimeType }` (downscaled to about 90 KB) and the reply renders. **Not tested against the live chatbot server**, which this build environment cannot reach.
- Motion: no on-screen element is ever hidden at load; all reveal elements show after scrolling; nothing animates with reduced motion.

## Open items for Vitrini72

| # | Item | Owner |
|---|---|---|
| 1 | **Photographs:** 3 of 20 slots filled (01, 02, 11). Missing: clinic 07–10, professionals 12–14, treatments 15–20. Placeholders show slot number and subject. | Vitrini72 |
| 2 | **Licences:** record the source URL and licence for the 3 photos in use (`docs/ASSETS.md`). | Vitrini72 |
| 3 | **Chatbot tenant:** create an ÁUREA tenant in lk-chatbot and set `NEXT_PUBLIC_CHATBOT_TENANT_ID`. Until then the chat forwards text to WhatsApp and photo upload is hidden. | Vitrini72 |
| 4 | **Chatbot image prompt:** lk-chatbot analyses photos with a generic prompt that may comment on appearance or imply an indication. Add an aesthetic-clinic prompt before showing photo upload to prospects. | lk-chatbot |
| 5 | **Budget ranges** in the gate are copied from the estética demo (from "Até R$500"); probably low for a premium positioning. | Vitrini72 |
| 6 | **Vercel project:** Root Directory `apps/aurea`, environment variables from `.env.example`. | Vitrini72 |
| 7 | The marble-panel photo is 1375px wide and looks slightly soft on high-density screens at full width. | Vitrini72 |

## Before real use (for a real clinic built from this template)

1. Responsible professional reviews every treatment page and FAQ; set `reviewStatus` to `approved`.
2. Copy checked against the relevant council's advertising rules (e.g. CFM Resolução 2.336/2023).
3. Privacy notice reviewed for LGPD, with retention periods and the data protection officer added.
4. Real professionals, registrations, address, hours, CNPJ and technical responsible in `config/site.ts` and `content/professionals.ts`.
5. `NEXT_PUBLIC_INQUIRY_ENDPOINT` connected to a real handler; `NEXT_PUBLIC_ALLOW_INDEXING=true`; `isDemo: false`.
