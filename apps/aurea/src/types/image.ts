export type ImageRatio = "4/5" | "3/4" | "4/3" | "1/1" | "16/10";

/**
 * A photograph slot. `src` stays `null` until a licensed image is chosen
 * (see docs/ASSETS.md); EditorialImage then renders a labelled placeholder.
 */
export interface ImageRef {
  /** Shot-list number from docs/ASSETS.md. */
  slot: string;
  /** What the photograph should show. Shown on the placeholder. */
  subject: string;
  /** Path under /public, e.g. "/images/hero/home-hero.jpg". */
  src: string | null;
  /** pt-BR alt text. Empty string only for purely decorative images. */
  alt: string;
  /** CSS object-position, e.g. "50% 30%". */
  focal?: string;
}
