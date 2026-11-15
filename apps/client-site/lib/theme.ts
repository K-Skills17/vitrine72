import type { ColorPalette, FontPair } from "./config";

/**
 * Turns the builder's palette and font pair into CSS variables on <html>.
 * The builder only ships palettes whose text/background, primary/background
 * and white/accent pairs pass WCAG AA (apps/builder/src/design-presets.ts),
 * so the template uses exactly those pairs for text:
 *   ink on bg, primary on bg, white on accent.
 * Derived tones (muted, line, surface) are mixed from ink and bg so they work
 * on light and dark palettes alike.
 */

function luminance(hex: string): number {
  const v = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(v.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isDarkPalette(p: ColorPalette): boolean {
  return luminance(p.background) < 0.2;
}

export function themeStyle(palette: ColorPalette, fonts: FontPair): Record<string, string> {
  const mix = (a: string, pct: number, b: string) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;
  return {
    "--c-bg": palette.background,
    "--c-ink": palette.text,
    "--c-primary": palette.primary,
    "--c-accent": palette.accent,
    "--c-surface": palette.secondary,
    // 72% ink keeps secondary text above 4.5:1 on every shipped palette.
    "--c-muted": mix(palette.text, 72, palette.background),
    "--c-line": mix(palette.text, 16, palette.background),
    // Inverse band: the ink colour as background, used for one contrasting
    // section per page (works for light and dark palettes).
    "--c-inverse-bg": palette.text,
    "--c-inverse-ink": palette.background,
    "--c-inverse-muted": mix(palette.background, 75, palette.text),
    "--c-inverse-line": mix(palette.background, 20, palette.text),
    "--font-display": `"${fonts.display}"`,
    "--font-body": `"${fonts.body}"`,
  };
}
