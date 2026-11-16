# Clinic flyers

WhatsApp flyer for the aesthetic-clinic outreach (B list). Its only job is to get a 15-minute meeting with the owner. It is an image, not a file or a link, because clinics don't open links from people they don't know.

## Generate

```bash
# from the repo root (needs Playwright and internet for Google Fonts)
node tools/flyers/render.cjs                      # generic flyer
node tools/flyers/render.cjs tools/flyers/clinics.csv   # + one flyer per clinic
```

`clinics.csv` needs a `name` column; other columns are ignored. It is git-ignored so scraped clinic lists never enter the repo (`clinics.example.csv` shows the format). Output: `tools/flyers/out/flyer-<clinic>.png` (1080×1350, git-ignored).

## Settings (`config.json`)

| Key | Use |
|---|---|
| `sellerName` | The real person who calls and answers. Change per seller. |
| `whatsapp` | Digits only, 55 + DDD + number. |
| `cnpj`, `domain` | Shown so the clinic can check the company is real. |
| `seasonalUntil`, `blackFriday` | The "Campanha de fim de ano" line shows until this date. |

## Rules

- No price, no case studies, no results: the flyer sells the meeting, not the package.
- No QR code or link: the call to action is "reply to this message".
- Long clinic names are cut at two lines; the renderer warns if anything overflows.
