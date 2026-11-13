# Assets — shot list and manifest

Status: **3 of 20 sourced** (slots 01, 02, 11). Source URLs and licences still to be recorded for those three. The shot list below is the brief for selection. Each row gets its source URL, photographer and licence once chosen.

Art direction for every image: natural daylight, warm neutral grade (ivory, sand, espresso), real skin texture, minimal retouching, calm expressions, no visible procedures, needles or "results". Architecture should be contemporary: limestone, travertine, oak, linen. Nothing should look clinical-blue or like generic stock.

| # | Slot | Subject | Ratio (desktop / mobile) | Source | Licence |
|---|---|---|---|---|---|
| 1 | Home hero | Woman, 35–45, three-quarter profile, natural skin, soft window light, neutral linen | 4:5 / 4:5 | Supplied by Vitrini72 (free stock). File: `hero/retrato-luz-janela.jpg`, converted to an espresso→ivory duotone | Pending: record URL |
| 2 | Home intro | Architectural detail: travertine or limestone wall with raking light. **Used instead:** eucalyptus in a ceramic vase on linen, raking light | 3:4 / 4:3 | Supplied by Vitrini72 (free stock). File: `editorial/eucalipto-luz-rasante.jpg` | Pending: record URL |
| 3 | Category: Estética facial | Close crop of jaw and cheek profile, natural texture | 4:5 | — | — |
| 4 | Category: Qualidade da pele | Macro of skin texture or hand on cheek | 1:1 | — | — |
| 5 | Category: Rejuvenescimento | Woman 45–55, relaxed, natural light | 4:5 | — | — |
| 6 | Category: Estética corporal | Shoulder or back in linen, editorial, not body-shaming | 4:5 | — | — |
| 7 | Clinic: reception | Warm minimal reception, stone counter, oak | 16:10 / 4:5 | — | — |
| 8 | Clinic: consultation room | Table and two chairs, daylight | 4:5 | — | — |
| 9 | Clinic: treatment room | Clean treatment chair in a warm-toned room | 4:5 | — | — |
| 10 | Clinic: detail | Ceramic, linen towel, plant shadow | 1:1 | — | — |
| 11 | Clinic: corridor/light | Architectural light and shadow. **Used on the homepage clinic teaser:** waiting area with a backlit marble panel | 16:10 / 4:5 | Supplied by Vitrini72 (free stock). File: `clinic/corredor-marmore.jpg` | Pending: record URL |
| 12–14 | Professionals (3) | Portraits: neutral background, white coat or smart casual, natural expression | 4:5 | — | — |
| 15–20 | Treatment heroes (6) | One per treatment: face or skin detail, no procedure shown | 4:5 / 4:5 | — | — |

How to add a photo: save it under `public/images/<folder>/`, then set `src` (and `focal` if the crop needs it) on the matching entry in `src/content/images.ts`. Until then the slot shows a placeholder with its number and subject.

Rules:
- Portraits of real people are **never** captioned as clinic staff or patients without a "fictional / illustrative" note. Professionals are labelled "Profissional fictício — imagem ilustrativa".
- Files are stored in `public/images/{hero,treatments,clinic,professionals,editorial}/` with descriptive kebab-case names, optimised to a 2400px long edge maximum. `next/image` produces the responsive variants.
- Each image gets a `focal` object-position and alt text in pt-BR in the content files.
