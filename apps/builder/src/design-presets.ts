/**
 * Palettes and font pairs the builder may choose from.
 *
 * Rules (enforced by design-presets.test.ts):
 * - Every palette passes WCAG AA (4.5:1) for the three pairs the client-site
 *   template actually renders: body text on background, `primary` used as
 *   text on background, and white button labels on `accent`.
 * - No purple, neon or default "SaaS blue" palettes; no Inter/Montserrat/
 *   Poppins/Roboto/Open Sans display faces. See
 *   .claude/skills/editorial-web-build/SKILL.md.
 *
 * Ids of removed presets are mapped in LEGACY_PALETTE_IDS / LEGACY_FONT_IDS
 * so configs or prompts that still name them resolve to the closest preset.
 */

export type Palette = {
  id: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type FontPair = {
  id: string;
  display: string;
  body: string;
  googleFontsUrl: string;
};

const gf = (families: string[]) =>
  `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;

export const PALETTES: Record<string, Palette> = {
  "ivory-espresso":  { id: "ivory-espresso",  primary: "#5e6055", secondary: "#e9e1d5", accent: "#292720", background: "#f4efe8", text: "#292720" },
  "rose-clay":       { id: "rose-clay",       primary: "#8a4a44", secondary: "#f3e7e3", accent: "#7a3f3a", background: "#fbf7f5", text: "#2a1f1d" },
  "forest-linen":    { id: "forest-linen",    primary: "#2d5a45", secondary: "#eef1ea", accent: "#2d5a45", background: "#f7f6f1", text: "#1d211c" },
  "harbour":         { id: "harbour",         primary: "#0d5c63", secondary: "#eef5f4", accent: "#0d5c63", background: "#fafaf8", text: "#172022" },
  "warm-terracotta": { id: "warm-terracotta", primary: "#a8461f", secondary: "#fff5ef", accent: "#a8461f", background: "#fffaf6", text: "#1f1a17" },
  "ink-ochre":       { id: "ink-ochre",       primary: "#7a5a12", secondary: "#f6f0e2", accent: "#2b2a26", background: "#fbf9f4", text: "#1c1b18" },
  "graphite-signal": { id: "graphite-signal", primary: "#b23c17", secondary: "#f1efec", accent: "#b23c17", background: "#fbfaf8", text: "#1b1a19" },
  "night-brass":     { id: "night-brass",     primary: "#c9a96e", secondary: "#1d1b18", accent: "#7d5f28", background: "#121110", text: "#f3eee6" },
};

export const DEFAULT_PALETTE_ID = "ivory-espresso";

/** Old ids → closest current preset. */
export const LEGACY_PALETTE_IDS: Record<string, string> = {
  "dark-elegance": "night-brass",
  "rose-gold": "rose-clay",
  "deep-plum": "rose-clay",
  "sage-green": "forest-linen",
  "midnight-teal": "harbour",
  "clean-blue": "harbour",
  "coral-energy": "graphite-signal",
  "dark-teal": "night-brass",
  "dark-plum": "night-brass",
  "classic-gold": "ink-ochre",
};

export const FONT_PAIRS: Record<string, FontPair> = {
  "cormorant-manrope": {
    id: "cormorant-manrope", display: "Cormorant Garamond", body: "Manrope",
    googleFontsUrl: gf(["Cormorant+Garamond:ital,wght@0,400;0,500;1,400", "Manrope:wght@400;500;600"]),
  },
  "fraunces-manrope": {
    id: "fraunces-manrope", display: "Fraunces", body: "Manrope",
    googleFontsUrl: gf(["Fraunces:ital,wght@0,400;0,600;1,400", "Manrope:wght@400;500;600"]),
  },
  "newsreader-public-sans": {
    id: "newsreader-public-sans", display: "Newsreader", body: "Public Sans",
    googleFontsUrl: gf(["Newsreader:ital,wght@0,400;0,600;1,400", "Public+Sans:wght@400;500;600"]),
  },
  "dm-serif-dm-sans": {
    id: "dm-serif-dm-sans", display: "DM Serif Display", body: "DM Sans",
    googleFontsUrl: gf(["DM+Serif+Display", "DM+Sans:wght@400;500;600"]),
  },
  "bricolage-dm-sans": {
    id: "bricolage-dm-sans", display: "Bricolage Grotesque", body: "DM Sans",
    googleFontsUrl: gf(["Bricolage+Grotesque:wght@500;700", "DM+Sans:wght@400;500;600"]),
  },
  "cormorant-raleway": {
    id: "cormorant-raleway", display: "Cormorant Garamond", body: "Raleway",
    googleFontsUrl: gf(["Cormorant+Garamond:ital,wght@0,400;0,500;1,400", "Raleway:wght@400;500;600"]),
  },
};

export const DEFAULT_FONT_PAIR_ID = "cormorant-manrope";

export const LEGACY_FONT_IDS: Record<string, string> = {
  "playfair-lato": "newsreader-public-sans",
  "montserrat-opensans": "bricolage-dm-sans",
  "inter-inter": "bricolage-dm-sans",
  "josefin-lato": "dm-serif-dm-sans",
};

export function resolvePalette(id: string | undefined): Palette {
  const key = id && (PALETTES[id] ? id : LEGACY_PALETTE_IDS[id]);
  return PALETTES[key ?? DEFAULT_PALETTE_ID] ?? PALETTES[DEFAULT_PALETTE_ID]!;
}

export function resolveFontPair(id: string | undefined): FontPair {
  const key = id && (FONT_PAIRS[id] ? id : LEGACY_FONT_IDS[id]);
  return FONT_PAIRS[key ?? DEFAULT_FONT_PAIR_ID] ?? FONT_PAIRS[DEFAULT_FONT_PAIR_ID]!;
}

// ─── Contrast (WCAG 2.x) ──────────────────────────────────────────────────────

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** The colour pairs the client-site template renders as text. */
export function paletteContrastIssues(p: Palette, minimum = 4.5): string[] {
  const pairs: Array<[string, string, string]> = [
    ["text on background", p.text, p.background],
    ["primary (as text) on background", p.primary, p.background],
    ["white label on accent", "#ffffff", p.accent],
  ];
  return pairs
    .map(([label, fg, bg]) => [label, contrastRatio(fg, bg)] as const)
    .filter(([, ratio]) => ratio < minimum)
    .map(([label, ratio]) => `${p.id}: ${label} ${ratio.toFixed(2)}:1 < ${minimum}:1`);
}
