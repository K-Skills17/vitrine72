/**
 * Motion tokens for Motion for React. The easing mirrors `--ease-aurea` in
 * globals.css; motion.test.ts fails if the two drift apart.
 */
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.24,
  base: 0.6,
  slow: 0.9,
} as const;

/** Vertical travel for text reveals, in px. Small on purpose. */
export const revealOffset = 16;
